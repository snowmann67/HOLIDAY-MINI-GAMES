import React, { useState } from 'react';
import { sound } from '../game/audio';
import {
  Home,
  Moon,
  Sparkles,
  Volume2,
  Gift,
  X,
  Compass,
  Lightbulb,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface SnoopyHouseLogisticsModalProps {
  onClose: () => void;
  coins: number;
  onGrantRewardCoins: (amount: number) => void;
  onGrantRewardCookies: (amount: number) => void;
}

export const SnoopyHouseLogisticsModal: React.FC<SnoopyHouseLogisticsModalProps> = ({
  onClose,
  coins,
  onGrantRewardCoins,
  onGrantRewardCookies,
}) => {
  const [lightsBlinking, setLightsBlinking] = useState(true);
  const [activeFloor, setActiveFloor] = useState<'rooftop' | 'aviator' | 'gallery' | 'cellar'>('rooftop');
  const [supperDelivered, setSupperDelivered] = useState(false);
  const [moonFlying, setMoonFlying] = useState(false);

  const handleToggleLights = () => {
    sound.playStar();
    setLightsBlinking((prev) => !prev);
  };

  const handleSupperDelivery = () => {
    if (supperDelivered) return;
    sound.playBone();
    setTimeout(() => sound.playCoin(), 250);
    setSupperDelivered(true);
    onGrantRewardCoins(60);
    onGrantRewardCookies(5);
  };

  const handleFlyMoon = () => {
    sound.playDash();
    setMoonFlying(true);
    setTimeout(() => setMoonFlying(false), 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col justify-between">
        {/* Header with Moon & Doghouse Badge */}
        <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-red-600 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg relative overflow-hidden">
              🏠
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight flex items-center gap-2">
                  <span>Snoopy's Doghouse &amp; Moon Logistics</span>
                </h2>
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400">
                  1st Prize Winner
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                The impossible subterranean architecture &amp; celestial lunar navigation of Snoopy's iconic red doghouse!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celestial Moon Flight Animation Banner */}
        <div className="relative w-full h-36 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl border-2 border-slate-700 overflow-hidden p-4 mb-4 flex items-center justify-between">
          {/* Twinkling Stars */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <div className="absolute top-3 left-10 text-[9px]">✦</div>
            <div className="absolute top-7 left-1/3 text-[12px] text-amber-200 animate-pulse">★</div>
            <div className="absolute top-4 right-1/4 text-[8px]">✦</div>
            <div className="absolute bottom-6 left-1/4 text-[10px] text-sky-200">★</div>
            <div className="absolute top-10 right-16 text-[11px] text-yellow-100">✦</div>
          </div>

          {/* Luminous Cartoon Winter Moon */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-300 border-2 border-amber-300 shadow-[0_0_35px_rgba(254,240,138,0.45)] flex items-center justify-center overflow-hidden">
              {/* Moon craters */}
              <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-amber-300/40 border border-amber-400/20" />
              <div className="absolute bottom-4 right-5 w-5 h-5 rounded-full bg-amber-300/35 border border-amber-400/20" />
              <div className="absolute top-8 right-3 w-2.5 h-2.5 rounded-full bg-amber-300/30" />
              <span className="text-2xl select-none">🌕</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
                Celestial Navigation Orbit
              </span>
              <h3 className="text-sm font-black text-white">
                Apollo 10 Lunar Callsign: "Snoopy"
              </h3>
              <p className="text-[11px] text-slate-300 max-w-sm">
                In 1969, NASA officially named the Apollo 10 Lunar Module <b>"Snoopy"</b> as it snooped around the moon surface!
              </p>
            </div>
          </div>

          {/* Snoopy Doghouse Soaring Across the Moon */}
          <div
            className={`absolute z-20 text-3xl transition-transform duration-1000 ${
              moonFlying
                ? 'right-4 top-4 scale-125 animate-bounce'
                : 'right-12 top-6'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl">🛩️🐶</span>
              <span className="text-[9px] font-mono font-black text-amber-300 bg-slate-900/80 px-1 rounded">
                Sopwith Camel
              </span>
            </div>
          </div>

          <button
            onClick={handleFlyMoon}
            className="relative z-10 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Fly Across Moon!</span>
          </button>
        </div>

        {/* Floor Navigation Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-950 rounded-2xl border-2 border-slate-800 mb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFloor('rooftop')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeFloor === 'rooftop'
                ? 'bg-red-600 text-white shadow-md border border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏠 Roof Deck</span>
          </button>
          <button
            onClick={() => setActiveFloor('aviator')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeFloor === 'aviator'
                ? 'bg-red-600 text-white shadow-md border border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛩️ Flight Ace War Room</span>
          </button>
          <button
            onClick={() => setActiveFloor('gallery')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeFloor === 'gallery'
                ? 'bg-red-600 text-white shadow-md border border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎨 Van Gogh Gallery</span>
          </button>
          <button
            onClick={() => setActiveFloor('cellar')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeFloor === 'cellar'
                ? 'bg-red-600 text-white shadow-md border border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍺 Root Beer &amp; Supper</span>
          </button>
        </div>

        {/* Floor Logistics Content */}
        <div className="p-4 bg-slate-800/80 rounded-2xl border-2 border-slate-700 min-h-[220px] flex flex-col justify-between">
          {activeFloor === 'rooftop' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400">
                    Exterior Level · 0 FT
                  </span>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>Rooftop Deck &amp; 1st Prize Christmas Lights</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </h3>
                </div>
                <button
                  onClick={handleToggleLights}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{lightsBlinking ? 'Lights: Blinking!' : 'Lights: Steady'}</span>
                </button>
              </div>

              {/* Visual Doghouse with Lights */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-around">
                <div className="text-center">
                  <div className="text-5xl select-none mb-1">
                    {lightsBlinking ? '✨🏠💡' : '🏠'}
                  </div>
                  <span className="text-[11px] font-bold text-amber-300">
                    "My own dog gone commercial!" — Charlie Brown
                  </span>
                </div>
                <div className="text-xs text-slate-300 space-y-1 max-w-xs">
                  <p>• <b>Snoopy's Bed:</b> Sleeps flat on his back atop the roof peak without ever falling off.</p>
                  <p>• <b>Woodstock's Roost:</b> Yellow bird co-pilot observation nest.</p>
                  <p>• <b>Typewriter Perch:</b> "It was a dark and stormy night..." novel writing station.</p>
                </div>
              </div>
            </div>
          )}

          {activeFloor === 'aviator' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400">
                  Sub-Level 1 · -10 FT Under Doghouse
                </span>
                <h3 className="text-base font-black text-white">
                  World War I Flying Ace War Room &amp; Hangar
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700">
                  <div className="text-amber-400 font-black mb-1 flex items-center gap-1">
                    <span>🛩️ Sopwith Camel Cockpit Controls</span>
                  </div>
                  <p className="text-slate-300">
                    Dual Vickers machine guns (snowball rapid-fire), rudder pedals connected to Snoopy's hind paws, and leather flight helmet rack with red aviator scarf.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700">
                  <div className="text-amber-400 font-black mb-1 flex items-center gap-1">
                    <span>🗺️ Red Baron Intercept Radar</span>
                  </div>
                  <p className="text-slate-300">
                    Secret tactical map of the French countryside, weather barometers calculating blizzard wind gusts, and anti-aircraft dog ear radar!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFloor === 'gallery' && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400">
                  Sub-Level 2 · -25 FT Under Doghouse
                </span>
                <h3 className="text-base font-black text-white">
                  The Great Van Gogh Art Gallery &amp; Billiard Parlor
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-center">
                  <div className="text-3xl mb-1">🖼️</div>
                  <h4 className="font-black text-amber-300">Vincent van Gogh</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Original Starry Night oil painting hung above the grandfather clock.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-center">
                  <div className="text-3xl mb-1">🎨</div>
                  <h4 className="font-black text-amber-300">Andrew Wyeth Original</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Priceless watercolor masterpiece preserved in climate control.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-center">
                  <div className="text-3xl mb-1">🎱</div>
                  <h4 className="font-black text-amber-300">Mahogany Pool Table</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Full-size billiard table with genuine ivory cue ball and brass sconces.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFloor === 'cellar' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400">
                    Sub-Level 3 · -40 FT Under Doghouse
                  </span>
                  <h3 className="text-base font-black text-white">
                    Supper Dish Chute &amp; 2,000-Gal Root Beer Cellar
                  </h3>
                </div>
                <button
                  onClick={handleSupperDelivery}
                  disabled={supperDelivered}
                  className={`px-3 py-1.5 font-black text-xs rounded-xl border border-slate-900 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                    supperDelivered
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{supperDelivered ? 'Supper Delivered! 🍲' : 'Ring Dinner Bell!'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700">
                  <h4 className="font-black text-amber-300 mb-1">
                    🍲 Charlie Brown's 6:00 PM Supper Chute
                  </h4>
                  <p className="text-slate-300">
                    Pneumatic delivery chute dropping canine delicacies, hot holiday biscuits, and cold sugar cookies right into the silver supper dish.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-700">
                  <h4 className="font-black text-amber-300 mb-1">
                    🍺 2,000-Gallon Frosty Root Beer Vats
                  </h4>
                  <p className="text-slate-300">
                    Aged dark root beer on tap with frosted glass mugs for Snoopy and his French WWI Flying Ace comrades!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & Supper drop feedback */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">
            Charles M. Schulz Comic Cannon: Exterior: 3x4 ft · Interior: 1,500 sq ft!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
