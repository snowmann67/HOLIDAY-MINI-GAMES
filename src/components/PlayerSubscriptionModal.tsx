import React, { useState } from 'react';
import { User, CheckCircle2, DollarSign, Crown, CreditCard, ShieldCheck, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { CharacterType } from '../game/types';
import { sound } from '../game/audio';

interface SubscriptionModalProps {
  onClose: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  character: CharacterType;
  setCharacter: (c: CharacterType) => void;
  onGrantRewardCoins: (amount: number) => void;
  onUnlockAllCharacters: () => void;
}

export const PlayerSubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  playerName,
  setPlayerName,
  character,
  setCharacter,
  onGrantRewardCoins,
  onUnlockAllCharacters,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'store_99' | 'get_paid'>('store_99');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [earningsBalance, setEarningsBalance] = useState(14.75); // $14.75 USD
  const [claimedPayout, setClaimedPayout] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCoin();
    setPlayerName(tempName || 'Charlie_Brown_Fan');
    setActiveTab('store_99');
  };

  const handleSubscribe99Cents = () => {
    sound.playVictory();
    setIsSubscribed(true);
    onGrantRewardCoins(500);
    onUnlockAllCharacters();
    setEarningsBalance((prev) => prev + 5.0); // Sign up bonus
  };

  const handleClaimPayout = () => {
    if (earningsBalance <= 0) return;
    sound.playStar();
    setClaimedPayout(true);
    setTimeout(() => {
      setEarningsBalance(0.0);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Snoopy App Store & Player Club</h2>
              <p className="text-xs font-semibold text-amber-800">
                Sign In · 99¢ Special Holiday Edition · Player Creator Rewards to Get Paid!
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

        {/* Tab Bar */}
        <div className="flex gap-2 mb-4 bg-amber-100 p-1 rounded-xl border-2 border-slate-900/10">
          <button
            onClick={() => setActiveTab('store_99')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'store_99' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>99¢ App Store VIP</span>
          </button>
          <button
            onClick={() => setActiveTab('get_paid')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'get_paid' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>Get Paid ($ Earnings)</span>
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'signin' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Player Sign In</span>
          </button>
        </div>

        {/* 99 Cents Special Offer Tab */}
        {activeTab === 'store_99' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-2xl p-4 text-white border-2 border-slate-900 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/40">
                    Snoopy Official App Store Exclusive
                  </span>
                  <h3 className="text-xl font-black mt-1">Snoopy Holiday Premium Pass</h3>
                  <p className="text-xs text-amber-100 font-medium">Regular Price $4.99 · Special Promotion: Only 99¢!</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-300">99¢</span>
                  <span className="block text-[10px] font-bold text-white/80">One-Time / Holiday Pass</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-white/95">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>500 Bonus Gold Coins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Unlock All 6 Friends Instantly</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>2x EXP & Cold Cookies Booster</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Cartoon Movie Night Theme</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">Signed in as: {playerName}</h4>
                <p className="text-[11px] text-slate-600">Status: {isSubscribed ? '👑 99¢ VIP Holiday Member' : 'Free Player'}</p>
              </div>

              {isSubscribed ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-600 text-emerald-800 rounded-xl text-xs font-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VIP Active!</span>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe99Cents}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-md flex items-center gap-1.5 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Get for 99¢ (Claim 500 🪙)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Get Paid / Creator Earnings Tab */}
        {activeTab === 'get_paid' && (
          <div className="space-y-4">
            <div className="bg-emerald-950 text-white rounded-2xl p-4 border-2 border-slate-900 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Player & Creator Revenue Share
              </span>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <h3 className="text-xs font-bold text-emerald-200">Your Current Earnings Balance</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-emerald-400 tabular-nums">
                      ${earningsBalance.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-300 font-bold">USD</span>
                  </div>
                </div>

                <button
                  onClick={handleClaimPayout}
                  disabled={earningsBalance <= 0 || claimedPayout}
                  className={`px-4 py-2.5 rounded-xl border-2 border-slate-900 font-black text-xs shadow-md transition-all ${
                    earningsBalance > 0 && !claimedPayout
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-900 active:scale-95'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {claimedPayout ? 'Payout Sent! ✓' : 'Cash Out Earnings'}
                </button>
              </div>

              {claimedPayout && (
                <div className="mt-3 p-2 bg-emerald-900/90 rounded-lg border border-emerald-500/50 text-[11px] text-emerald-200">
                  🎉 Congratulations! Payout of $14.75 has been routed to your registered Player Account.
                </div>
              )}
            </div>

            {/* How to Earn More */}
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4">
              <h4 className="text-xs font-black text-slate-900 mb-2">How Players Get Paid in Snoopy's App:</h4>
              <div className="space-y-2 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Pass Holiday Boards (Level Clear)</span>
                  <span className="font-black text-emerald-600">+$1.00 USD</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Defeat 10 Zombie Snowmen</span>
                  <span className="font-black text-emerald-600">+$2.50 USD</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span>Invite a Friend via QR Code</span>
                  <span className="font-black text-emerald-600">+$5.00 USD</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Tab */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4">
              <label className="block text-xs font-black text-slate-900 mb-1">
                Player Display Name / Club Handle:
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 border-2 border-slate-900 rounded-xl text-sm font-black text-slate-900 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter player name..."
              />
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4">
              <label className="block text-xs font-black text-slate-900 mb-2">
                Choose Favorite Starting Character:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SNOOPY', 'CHARLIE_BROWN', 'LINUS'] as CharacterType[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCharacter(c)}
                    className={`py-2 px-2 rounded-xl border-2 text-xs font-black transition-all ${
                      character === c
                        ? 'bg-amber-400 border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {c === 'SNOOPY' ? '🐶 Snoopy' : c === 'CHARLIE_BROWN' ? '👦 Charlie Brown' : '🧣 Linus'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 font-black text-slate-900 text-xs rounded-xl border-2 border-slate-900 shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Save & Sign In to Peanuts Club</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
