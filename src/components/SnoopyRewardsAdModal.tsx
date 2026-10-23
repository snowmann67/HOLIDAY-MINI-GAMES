import React, { useState, useEffect } from 'react';
import { Film, Gift, CheckCircle2, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { sound } from '../game/audio';

interface RewardsAdProps {
  onClose: () => void;
  onGrantReward: (coins: number) => void;
}

export const SnoopyRewardsAdModal: React.FC<RewardsAdProps> = ({
  onClose,
  onGrantReward,
}) => {
  const [adProgress, setAdProgress] = useState(0);
  const [isAdFinished, setIsAdFinished] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsAdFinished(true);
          sound.playStar();
          return 100;
        }
        return prev + 20; // 5 seconds ad simulation
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaimReward = () => {
    sound.playVictory();
    setClaimed(true);
    onGrantReward(100);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍿🎬</span>
            <h3 className="text-base font-black text-slate-900">
              Snoopy Holiday Cinema & App Store Rewards
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Vintage Animated Ad Box */}
        <div className="bg-slate-950 rounded-2xl p-6 border-4 border-slate-900 text-white shadow-inner mb-4 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-6xl mb-2 animate-bounce">🐶🎁🎄</div>
            <h4 className="text-lg font-black text-amber-400">
              Official Snoopy Holiday Sticker App & Games
            </h4>
            <p className="text-xs text-slate-300 font-medium max-w-sm mt-1">
              "Get authentic Peanuts Emojis, iMessage Stickers, and Charlie Brown Holiday stories on the Apple App Store & Google Play!"
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg border border-white/30">
                APP STORE · 99¢ SPECIAL
              </span>
              <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg border border-white/30">
                GOOGLE PLAY VERIFIED
              </span>
            </div>
          </div>

          {/* Ad Progress Bar */}
          <div className="mt-6 w-full bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${adProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block font-bold">
            {isAdFinished ? 'Reward Unlocked!' : `Reward in ${(100 - adProgress) / 20}s...`}
          </span>
        </div>

        {/* Claim Button */}
        {isAdFinished ? (
          <button
            onClick={handleClaimReward}
            disabled={claimed}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm rounded-2xl border-4 border-slate-900 shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Gift className="w-5 h-5" />
            <span>{claimed ? 'CLAIMED +100 COINS! ✓' : 'CLAIM +100 FREE COINS & STICKER PASS!'}</span>
          </button>
        ) : (
          <div className="text-xs font-bold text-slate-600 italic">
            Watching vintage Peanuts holiday sponsor message...
          </div>
        )}
      </div>
    </div>
  );
};
