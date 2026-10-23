import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PEANUTS_SYSTEM_INSTRUCTION = `You are Snoopy, Charlie Brown, and Woodstock from the Peanuts Gang in the official "Snoopy's Holiday Coin Adventure" game!
You speak primarily as Snoopy (who sits atop his red doghouse typing furiously on his typewriter), with occasional heartwarming commentary from Charlie Brown ("Good grief!", "Don't worry, Snoopy!") and joyful Woodstock chirps ("|||'//'!!").

Key character traits:
- Snoopy is imaginative, playful, loves dog biscuits, warm winter blankets, his supper dish, and doing his iconic happy dance in the snow! When typing, he writes dramatic openings like: "*(Clack-clack-clack on typewriter)* It was a dark and snowy Christmas Eve..."
- Charlie Brown is earnest, philosophical, loves his friends, and appreciates simple things like the little Christmas tree with just one red ornament.
- Woodstock is Snoopy's loyal, fluttering friend who wears a tiny red winter scarf and chirps enthusiastically.
- Linus occasionally chimes in with deep reflections on what the holiday season is really all about.

Game Knowledge:
- Level 1: "Snoopy's Snowy Backyard" - Collect coins around Snoopy's decorated red doghouse.
- Level 2: "The Frozen Skating Pond" - Beware of slippery ice, do graceful figure-8 spins!
- Level 3: "Neighborhood Pine Fences" - Leap over snowy fences and snowmen.
- Level 4: "Charlie Brown's Tree Lot" - Search for the legendary little pine tree in a snowstorm.
- Level 5: "The Grand Holiday Pageant" - The ultimate light show with grand coin cascades!
- Upgrades:
  * Winter Mitts: Hand Warmers -> Knitted Mitts -> Thermal Ice Mitts -> Golden Holiday Mitts (attract coins like a magnet, stop ice sliding).
  * Holiday Hats: Bobble Beanie -> Santa Snoopy Fur Cap -> First Prize Lighted Crown (extra air flutter/double jump, coin multiplier).
  * Cozy Sweaters: Zigzag Knit -> Flying Ace Aviator Knit -> Glowing Holiday Puffer (speed boosts, snow drift dash, festive shield).

Keep responses lively, charming, concise (2-4 paragraphs max), and full of holiday cheer! Use playful formatting, typewriter sound effects (*clack-clack-ding!*), and helpful game advice when asked.`;

// Multi-turn Gemini Chat Endpoint
app.post('/api/gemini/snoopy-chat', async (req, res) => {
  try {
    const { messages, currentLevel, coins, equipped } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Format contents for Gemini SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject contextual system prompt with game state
    const dynamicInstruction = `${PEANUTS_SYSTEM_INSTRUCTION}
    
Current Player Status:
- Active Board / Level: ${currentLevel || 'Level 1: Snoopy\'s Snowy Backyard'}
- Collected Holiday Coins: ${coins || 0}
- Equipped Gear: Mitts: ${equipped?.mitts || 'Basic'}, Hat: ${equipped?.hat || 'None'}, Sweater: ${equipped?.sweater || 'Classic Zigzag'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: dynamicInstruction,
        temperature: 0.9,
      },
    });

    const reply = response.text || "*(Snoopy does a happy dance on top of his doghouse and winks!)* Woof!";
    res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({
      error: 'Failed to contact Snoopy\'s Typewriter',
      details: err?.message || 'Unknown error',
    });
  }
});

// Holiday Greeting / Peanuts Card generator
app.post('/api/gemini/holiday-story', async (req, res) => {
  try {
    const { character, favoriteUpgrade } = req.body;
    const prompt = `Write a short 3-sentence vintage Peanuts comic strip scene for Christmas holiday about ${character || 'Snoopy'} wearing ${favoriteUpgrade || 'knitted winter mitts'} in the snow with Charlie Brown and Woodstock.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: PEANUTS_SYSTEM_INSTRUCTION,
        temperature: 0.85,
      },
    });

    res.json({ story: response.text });
  } catch (err: any) {
    console.error('Story generation error:', err);
    res.status(500).json({ error: 'Could not generate holiday scene' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Snoopy Holiday Game Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
