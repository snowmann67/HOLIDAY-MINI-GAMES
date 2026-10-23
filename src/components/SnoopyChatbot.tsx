import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, Volume2, RotateCcw, Bot, User } from 'lucide-react';
import { sound } from '../game/audio';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface SnoopyChatbotProps {
  onClose: () => void;
  coins: number;
  currentLevelName: string;
  equipped: { mitts: string; hat: string; sweater: string };
}

export const SnoopyChatbot: React.FC<SnoopyChatbotProps> = ({
  onClose,
  coins,
  currentLevelName,
  equipped,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        "*(Clack-clack-clack on red typewriter...)*\nIt was a dark and snowy Christmas Eve!\n\nWoof! Welcome to my holiday typewriter co-pilot! Ask me anything about beating Zombie Snowmen, upgrading your winter sweaters & mitts, or the true meaning of the holidays!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    sound.playTypewriter();
    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/snoopy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentLevel: currentLevelName,
          coins,
          equipped,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        sound.playCoin();
        setMessages([...updatedMessages, { role: 'model', content: data.reply }]);
      } else {
        setMessages([
          ...updatedMessages,
          {
            role: 'model',
            content: "*(Snoopy smiles warmly and does a happy dance!)* 'Woof! Always stay by the campfire when the blizzard blows!'",
          },
        ]);
      }
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          content: "*(Snoopy taps his typewriter with paws)* 'Good grief, the blizzard interrupted the telegram! Stay warm and collect Cold Cookies!'",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'How do I defeat the Zombie Snowmen?',
    'What do Winter Mitts & Sweaters upgrade?',
    'Tell me a holiday story on your typewriter!',
    'How do I survive the Blizzard Peak cold?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⌨️🐶</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Snoopy's Typewriter & Holiday Radio</h2>
              <p className="text-xs font-semibold text-amber-800">
                Multi-turn Gemini 3.8 Flash Co-Pilot with Snoopy, Charlie Brown & Woodstock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center text-sm shrink-0 shadow-xs">
                  🐶
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl border-2 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-400 text-slate-950 font-black border-slate-900 rounded-br-none shadow-xs'
                    : 'bg-white text-slate-900 font-medium border-slate-900 rounded-bl-none shadow-sm whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-sm shrink-0 shadow-xs">
                  👦
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs font-bold text-slate-600 italic">
              <span className="text-lg animate-bounce">⌨️</span>
              <span>Snoopy is clacking furiously on his red typewriter...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-amber-100 border border-slate-900 text-[11px] font-bold text-slate-800 rounded-full shadow-xs transition-colors shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message to Snoopy & Charlie Brown..."
            className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
