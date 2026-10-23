import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Trophy, BookOpen, Gift, Volume2 } from 'lucide-react';
import { sound } from '../game/audio';

interface SnowGlobeProps {
  onClose: () => void;
  coins: number;
  zombiesDefeated: number;
  playerLevel: number;
}

export const SnoopySnowGlobe: React.FC<SnowGlobeProps> = ({
  onClose,
  coins,
  zombiesDefeated,
  playerLevel,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'globe' | 'achievements' | 'story'>('globe');
  const [glitterParticles, setGlitterParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const HINTS = [
    "Snoopy says: 'In the icy blizzard, stay near the cozy campfires or Lucy's hot cocoa booth to refill your Warmth Meter!'",
    "Woodstock chirps: 'Press Space or the Snowball Throw button to blast Zombie Snowmen from a safe distance!'",
    "Linus whispers: 'Equipping Nordic Ice Mitts prevents sliding completely on the frozen skating pond.'",
    "Charlie Brown shares: 'Collecting Cold Cookies gives massive EXP! Leveling up increases your health and snowball toss damage.'",
    "Lucy advises (for 5¢): 'The First Prize Lighted Crown gives you a double jump and protects you against blizzard frostbite!'",
    "Secret Lore: 'Snoopy's red doghouse once won first prize with 10,000 twinkling Christmas lights!'",
  ];

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    sound.playStar();

    // Generate swirling glitter flakes
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 180,
      y: 30 + Math.random() * 180,
      size: 2 + Math.random() * 4,
    }));
    setGlitterParticles(particles);

    setTimeout(() => {
      setIsShaking(false);
      const randomHint = HINTS[Math.floor(Math.random() * HINTS.length)];
      setRevealedHint(randomHint);
      sound.playCoin();
    }, 1200);
  };

  useEffect(() => {
    // Initial random hint
    setRevealedHint(HINTS[0]);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔮</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Snoopy's Holiday Snow Globe</h2>
              <p className="text-xs font-semibold text-amber-800">Shake the Christmas Ball to discover hints, story lore & goals!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 bg-amber-100 p-1 rounded-xl border-2 border-slate-900/10">
          <button
            onClick={() => setActiveTab('globe')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
              activeTab === 'globe' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔮 Shake Globe
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
              activeTab === 'achievements' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 Achievements
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
              activeTab === 'story' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📖 Story Goals
          </button>
        </div>

        {activeTab === 'globe' && (
          <div className="flex flex-col items-center">
            {/* The Snow Globe Sphere */}
            <div
              onClick={handleShake}
              className={`relative cursor-pointer transition-transform select-none ${
                isShaking ? 'animate-bounce scale-105' : 'hover:scale-102'
              }`}
            >
              {/* Glass Sphere */}
              <div className="relative w-56 h-56 rounded-full bg-gradient-to-b from-sky-200/90 via-sky-100/70 to-blue-200/95 border-4 border-slate-900 shadow-inner overflow-hidden flex items-center justify-center">
                {/* Glass reflection highlight */}
                <div className="absolute top-3 left-6 w-16 h-8 rounded-full bg-white/60 -rotate-30 pointer-events-none" />

                {/* Snoopy & Woodstock inside the globe */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="text-6xl select-none filter drop-shadow">🐶</div>
                  <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-900 text-[10px] font-black text-slate-800">
                    <span>🐥</span> Woodstock & Snoopy
                  </div>
                </div>

                {/* Snowy ground inside globe */}
                <div className="absolute -bottom-4 left-0 right-0 h-16 bg-white rounded-t-full border-t-2 border-slate-900/30" />

                {/* Swirling Glitter / Snow Flakes */}
                {glitterParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute bg-white rounded-full shadow-sm animate-ping"
                    style={{
                      left: `${p.x}px`,
                      top: `${p.y}px`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                  />
                ))}
              </div>

              {/* Wooden Base of the Globe */}
              <div className="w-44 h-9 mx-auto -mt-3 bg-amber-800 rounded-b-2xl border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black text-amber-200 tracking-wider uppercase">
                  Peanuts Holiday · 1950
                </span>
              </div>
            </div>

            {/* Shake Button */}
            <button
              onClick={handleShake}
              disabled={isShaking}
              className="mt-4 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-black text-sm rounded-xl border-2 border-slate-900 shadow-md flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isShaking ? 'animate-spin' : ''}`} />
              {isShaking ? 'Shaking the Snow Globe...' : 'Click or Tap to Shake Globe!'}
            </button>

            {/* Hint Card */}
            {revealedHint && (
              <div className="mt-4 w-full bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-sm text-left">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Snoopy Holiday Wisdom:</span>
                </div>
                <p className="text-sm font-bold text-slate-800 leading-snug">{revealedHint}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧟</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Zombie Snowman Crusher</h4>
                  <p className="text-[11px] text-slate-600">Smashed {zombiesDefeated} / 10 Zombie Snowmen</p>
                </div>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded border border-slate-900 ${
                zombiesDefeated >= 10 ? 'bg-green-400 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {zombiesDefeated >= 10 ? 'Claimed +50 🪙' : `${zombiesDefeated}/10`}
              </span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍪</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Cold Cookie Gourmet</h4>
                  <p className="text-[11px] text-slate-600">Reached Character Player Level {playerLevel}</p>
                </div>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded border border-slate-900 ${
                playerLevel >= 3 ? 'bg-green-400 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {playerLevel >= 3 ? 'Claimed +75 🪙' : `Lvl ${playerLevel}/3`}
              </span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Holiday Treasure Hunter</h4>
                  <p className="text-[11px] text-slate-600">Collected {coins} / 100 Total Holiday Coins</p>
                </div>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded border border-slate-900 ${
                coins >= 100 ? 'bg-green-400 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {coins >= 100 ? 'Claimed +100 🪙' : `${coins}/100`}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <div className="bg-amber-100/80 border-2 border-slate-900 rounded-xl p-3">
              <h4 className="text-xs font-black text-amber-900 mb-1">Chapter 1: The Frosty Backyard</h4>
              <p className="text-xs text-slate-700">Charlie Brown searches the snowy backyard for Snoopy, who went missing after a mysterious blizzard hit the neighborhood.</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Goal: Reach the Red Doghouse</span>
                <span className="text-emerald-700">✓ In Progress</span>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3">
              <h4 className="text-xs font-black text-slate-900 mb-1">Chapter 2: The Skating Pond Mystery</h4>
              <p className="text-xs text-slate-700">Linus and Lucy spot giant frosty footprints across the pond. Defeat Frost Ghouls and glide to Schroeder's piano.</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Unlock Linus & Schroeder</span>
                <span className="text-amber-700">Locked (Beat Level 1)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3">
              <h4 className="text-xs font-black text-slate-900 mb-1">Chapter 3: Blizzard Peak Rescue</h4>
              <p className="text-xs text-slate-700">Storm the Zombie Snowman Citadel on Blizzard Peak, withstand the freezing cold, and rescue Snoopy for the Christmas Pageant!</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Save Snoopy & Win 1st Prize</span>
                <span className="text-amber-700">Locked (Final Chapter)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
