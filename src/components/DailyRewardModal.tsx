import React, { useState, useEffect } from 'react';
import { sound } from '../game/audio';
import {
  Gift,
  X,
  CheckCircle2,
  Sparkles,
  Clock,
  Calendar,
  Flame,
  Award,
  ChevronRight,
  RotateCcw,
  FastForward,
  Lock,
  Trophy,
  Star,
} from 'lucide-react';

export interface DailyRewardItem {
  day: number;
  coins: number;
  cookies: number;
  title: string;
  badge: string;
  description: string;
  perk: string;
}

export const DAILY_REWARDS: DailyRewardItem[] = [
  {
    day: 1,
    coins: 50,
    cookies: 2,
    title: "Snoopy's Welcome Dish",
    badge: '🐶',
    description: 'Fresh warm cookies and gold coins right from the red doghouse!',
    perk: '+50 Coins · +2 Cookies',
  },
  {
    day: 2,
    coins: 75,
    cookies: 3,
    title: "Woodstock's Crumb Box",
    badge: '🐤',
    description: 'Woodstock gathered glittering gold and frosty sugar biscuits!',
    perk: '+75 Coins · +3 Cookies',
  },
  {
    day: 3,
    coins: 100,
    cookies: 4,
    title: "Linus' Cozy Blanket Patch",
    badge: '🧣',
    description: 'Extra warmth protection against the howling winter wind!',
    perk: '+100 Coins · +4 Cookies',
  },
  {
    day: 4,
    coins: 150,
    cookies: 5,
    title: "Charlie's Holiday Tree Star",
    badge: '🎄',
    description: 'A little love made the scrawny tree sparkle with gold!',
    perk: '+150 Coins · +5 Cookies',
  },
  {
    day: 5,
    coins: 200,
    cookies: 6,
    title: "Schroeder's Jazz Note",
    badge: '🎹',
    description: 'Vince Guaraldi holiday chords that melt the ice ghouls away!',
    perk: '+200 Coins · +6 Cookies',
  },
  {
    day: 6,
    coins: 250,
    cookies: 8,
    title: "Lucy's 5¢ Psychiatric Advice",
    badge: '👧',
    description: 'Real psychiatric advice: "Keep throwing snowballs at the cold!"',
    perk: '+250 Coins · +8 Cookies',
  },
  {
    day: 7,
    coins: 500,
    cookies: 15,
    title: 'Grand Holiday Beagle Jackpot!',
    badge: '👑',
    description: 'Golden Flying Ace crown, massive cookie feast, and doghouse lights!',
    perk: '+500 Gold Coins · +15 Cookies · Grand Champion!',
  },
];

interface DailyRewardModalProps {
  onClose: () => void;
  coins: number;
  cookies: number;
  lastLoginDate: string | null;
  streak: number;
  onClaimReward: (reward: { coins: number; cookies: number; bonusItem?: string }, newStreak: number, newLastLoginDate: string) => void;
  onDevAdvanceDay?: () => void;
  onDevResetStreak?: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  onClose,
  coins,
  cookies,
  lastLoginDate,
  streak,
  onClaimReward,
  onDevAdvanceDay,
  onDevResetStreak,
}) => {
  // Format today's date YYYY-MM-DD
  const getTodayDateString = (offsetDays = 0) => {
    const d = new Date();
    if (offsetDays !== 0) {
      d.setDate(d.getDate() + offsetDays);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [todayStr, setTodayStr] = useState<string>(getTodayDateString());
  const [claimedReward, setClaimedReward] = useState<DailyRewardItem | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Determine claim eligibility based on lastLoginDate vs todayStr
  const isClaimedToday = lastLoginDate === todayStr;

  // Calculate current active day in 7-day cycle (1 to 7)
  // If already claimed today, active day is current streak.
  // If not claimed today:
  //   - If consecutive from yesterday, next day is (streak % 7) + 1
  //   - If streak was 0 or missed yesterday, day is 1
  const yesterdayStr = getTodayDateString(-1);
  const isConsecutive = lastLoginDate === yesterdayStr;
  
  let currentTargetDay = 1;
  if (isClaimedToday) {
    currentTargetDay = ((streak - 1) % 7) + 1;
  } else if (isConsecutive && streak > 0) {
    currentTargetDay = (streak % 7) + 1;
  } else {
    currentTargetDay = 1;
  }

  // Progress calculations for 7-day retention journey
  const completedDays = isClaimedToday
    ? currentTargetDay
    : Math.max(0, currentTargetDay - 1);
  const progressPercent = Math.round((completedDays / 7) * 100);

  // Next reward teaser for retention
  const upcomingDayNumber = isClaimedToday
    ? currentTargetDay < 7
      ? currentTargetDay + 1
      : 1
    : currentTargetDay < 7
    ? currentTargetDay + 1
    : null;
  const upcomingReward = upcomingDayNumber ? DAILY_REWARDS[upcomingDayNumber - 1] : null;

  // Live countdown to next midnight (or reward refresh)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeRemaining('Ready now!');
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${mins}m ${secs}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    if (isClaimedToday) return;

    const reward = DAILY_REWARDS[currentTargetDay - 1];
    const newStreak = isConsecutive ? streak + 1 : 1;

    sound.playStar();
    setTimeout(() => sound.playCoin(), 150);

    setClaimedReward(reward);
    onClaimReward(
      { coins: reward.coins, cookies: reward.cookies, bonusItem: reward.title },
      newStreak,
      todayStr
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 border-4 border-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col justify-between">
        {/* Header & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-900/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-sm animate-bounce">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Daily Sign-In Rewards
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full border border-slate-900">
                  7-Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Sign in every day with Charlie Brown &amp; Snoopy to collect cold cookies and gold coins!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-200 border-2 border-transparent hover:border-slate-900 transition-all text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Player Status Banner */}
        <div className="my-3 p-3.5 bg-white rounded-2xl border-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 border border-orange-300 text-orange-600 font-black flex items-center gap-1.5 text-xs">
              <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="text-xs text-slate-600">
              Last Login:{' '}
              <span className="font-bold text-slate-900">
                {lastLoginDate || 'First Sign-in!'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-100/60 px-2.5 py-1 rounded-xl border border-amber-300">
              <span>🪙</span>
              <span>{coins} Coins</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-sky-600 bg-sky-100/60 px-2.5 py-1 rounded-xl border border-sky-300">
              <span>🍪</span>
              <span>{cookies} Cookies</span>
            </div>
          </div>
        </div>

        {/* 7-Day Animated Progress Bar & Streak Retention Journey */}
        <div className="my-2 p-4 bg-gradient-to-b from-amber-100/90 to-amber-50 rounded-2xl border-2 border-slate-900 shadow-sm relative overflow-hidden">
          {/* Header Row of Progress Section */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400 border border-slate-900 text-xs">
                🏆
              </span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                7-Day Streak Journey
              </span>
              <span className="bg-amber-300/80 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md border border-slate-900/40">
                {completedDays} / 7 Days Claimed ({progressPercent}%)
              </span>
            </div>

            <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              {!isClaimedToday ? (
                <span className="flex items-center gap-1 text-emerald-700 font-black animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Day {currentTargetDay} reward is ready to claim!
                </span>
              ) : completedDays >= 7 ? (
                <span className="text-amber-800 font-black">
                  🎉 All 7 days unlocked! Next cycle starts tomorrow.
                </span>
              ) : (
                <span className="text-slate-600 font-bold">
                  🔥 Return tomorrow to claim Day {currentTargetDay + 1}!
                </span>
              )}
            </div>
          </div>

          {/* Interactive Stepper Track */}
          <div className="relative pt-3 pb-2 px-1">
            {/* Connecting Horizontal Progress Bar Track */}
            <div className="absolute top-7 left-4 right-4 h-2 bg-slate-200 border border-slate-900/30 rounded-full z-0 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 transition-all duration-700 ease-out rounded-full shadow-inner"
                style={{ width: `${Math.max(4, Math.min(100, (completedDays / 7) * 100))}%` }}
              />
            </div>

            {/* 7 Animated Day Nodes */}
            <div className="relative z-10 flex items-center justify-between">
              {DAILY_REWARDS.map((item) => {
                const isCompleted = isClaimedToday
                  ? item.day <= currentTargetDay
                  : item.day < currentTargetDay;
                const isCurrent = !isClaimedToday && item.day === currentTargetDay;
                const isUpcoming = isClaimedToday
                  ? item.day > currentTargetDay
                  : item.day > currentTargetDay;
                const isJackpotDay = item.day === 7;

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center group relative cursor-pointer"
                    title={`${item.title} — ${item.perk}`}
                  >
                    {/* Floating Status Tag for Current Active Day */}
                    {isCurrent && (
                      <span className="absolute -top-3.5 px-1.5 py-0.2 bg-red-500 text-white font-black text-[9px] rounded-full border border-slate-900 shadow-xs animate-bounce z-20">
                        READY!
                      </span>
                    )}

                    {/* Node Circle with Animated Icon */}
                    <div
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-100 border-emerald-600 text-slate-900 shadow-xs'
                          : isCurrent
                          ? 'bg-amber-300 border-slate-900 ring-4 ring-amber-400 shadow-md scale-110 z-10 animate-pulse'
                          : isJackpotDay
                          ? 'bg-amber-100/90 border-amber-400/80 shadow-xs ring-1 ring-amber-300'
                          : 'bg-white/90 border-slate-300 text-slate-400 opacity-80'
                      }`}
                    >
                      {/* Animated Badge Icon */}
                      <span
                        className={`text-base sm:text-lg select-none transition-transform duration-300 ${
                          isCurrent
                            ? 'scale-115 animate-bounce'
                            : isCompleted
                            ? 'grayscale-25'
                            : isUpcoming
                            ? 'opacity-70 group-hover:scale-115'
                            : ''
                        }`}
                      >
                        {item.badge}
                      </span>

                      {/* Completed Check Badge Overlay */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-slate-900 shadow-xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                      )}

                      {/* Locked Lock Badge Overlay */}
                      {isUpcoming && !isCompleted && !isCurrent && (
                        <div className="absolute -bottom-1 -right-1 bg-slate-200 text-slate-600 rounded-full p-0.5 border border-slate-400 shadow-xs">
                          <Lock className="w-2 h-2" />
                        </div>
                      )}

                      {/* Day 7 Crown Sparkle */}
                      {isJackpotDay && !isCompleted && (
                        <div className="absolute -top-1.5 -right-1 text-amber-500 animate-spin">
                          ✨
                        </div>
                      )}
                    </div>

                    {/* Day Label & Teaser Perk */}
                    <div className="mt-1 text-center">
                      <span
                        className={`text-[10px] font-black block leading-none ${
                          isCurrent
                            ? 'text-amber-900 font-extrabold underline decoration-amber-500'
                            : isCompleted
                            ? 'text-emerald-800'
                            : 'text-slate-500'
                        }`}
                      >
                        Day {item.day}
                      </span>
                      <span
                        className={`text-[9px] font-bold block mt-0.5 leading-none ${
                          isCurrent
                            ? 'text-amber-700'
                            : isJackpotDay
                            ? 'text-amber-600 font-black'
                            : 'text-slate-400'
                        }`}
                      >
                        +{item.coins}🪙
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retention Teaser Banner for Tomorrow's / Upcoming Reward */}
          {upcomingReward && (
            <div className="mt-2.5 pt-2 border-t border-slate-900/10 flex items-center justify-between text-xs bg-white/70 rounded-xl px-3 py-1.5 border border-slate-900/10">
              <div className="flex items-center gap-2">
                <span className="text-sm">{upcomingReward.badge}</span>
                <span className="text-slate-700 font-medium text-[11px]">
                  <b className="font-black text-slate-900">
                    Day {upcomingReward.day} Next Up:
                  </b>{' '}
                  {upcomingReward.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-black">
                <span className="text-amber-600">+{upcomingReward.coins} 🪙</span>
                <span className="text-sky-600">+{upcomingReward.cookies} 🍪</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">
                  Locked
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 7-Day Advent Track Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
          {DAILY_REWARDS.slice(0, 6).map((item) => {
            const isCompleted = isClaimedToday
              ? item.day <= currentTargetDay
              : item.day < currentTargetDay;
            const isCurrent = !isClaimedToday && item.day === currentTargetDay;

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-3 border-2 transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-600/60 text-slate-800'
                    : isCurrent
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-102'
                    : 'bg-white/80 border-slate-300 text-slate-500 opacity-80'
                }`}
              >
                {/* Top Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isCompleted
                        ? 'bg-emerald-200 text-emerald-900'
                        : isCurrent
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Day {item.day}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-black text-amber-700 animate-pulse">
                      READY!
                    </span>
                  )}
                </div>

                {/* Badge & Title */}
                <div className="my-1.5 flex items-center gap-2">
                  <div className="text-2xl">{item.badge}</div>
                  <div>
                    <h4 className="text-xs font-black leading-tight text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-600 line-clamp-1">{item.description}</p>
                  </div>
                </div>

                {/* Rewards Breakdown */}
                <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between text-xs font-black">
                  <span className="text-amber-600 flex items-center gap-0.5">
                    +{item.coins} 🪙
                  </span>
                  <span className="text-sky-600 flex items-center gap-0.5">
                    +{item.cookies} 🍪
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day 7: Grand Holiday Beagle Jackpot Card (Full Width) */}
        {(() => {
          const grandItem = DAILY_REWARDS[6];
          const isGrandCompleted = isClaimedToday && currentTargetDay === 7;
          const isGrandCurrent = !isClaimedToday && currentTargetDay === 7;

          return (
            <div
              className={`relative rounded-2xl p-4 border-2 my-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isGrandCompleted
                  ? 'bg-emerald-50 border-emerald-600'
                  : isGrandCurrent
                  ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-amber-500 ring-4 ring-amber-400/50 shadow-lg'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-sm shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900">
                      DAY 7 GRAND JACKPOT
                    </span>
                    {isGrandCompleted && (
                      <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed!
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    {grandItem.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {grandItem.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-black text-amber-600">
                    +{grandItem.coins} 🪙 Gold Coins
                  </div>
                  <div className="text-xs font-black text-sky-600">
                    +{grandItem.cookies} 🍪 Cold Cookies
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Claim Action / Countdown Banner */}
        <div className="mt-3 pt-3 border-t-2 border-slate-900/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isClaimedToday ? (
            <div className="flex items-center gap-2 text-slate-700 text-xs font-bold w-full sm:w-auto">
              <Clock className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Next reward unlocks in:</span>
              <span className="font-mono bg-slate-900 text-amber-400 px-2.5 py-1 rounded-xl text-xs font-black">
                {timeRemaining}
              </span>
            </div>
          ) : (
            <div className="text-xs text-slate-600 font-medium">
              Ready for{' '}
              <b className="text-slate-900 font-black">Day {currentTargetDay}</b> reward!
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isClaimedToday ? (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-300 text-slate-600 font-black text-xs rounded-2xl border-2 border-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Claimed for Today</span>
              </button>
            ) : (
              <button
                onClick={handleClaim}
                className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm rounded-2xl border-3 border-slate-900 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>CLAIM DAY {currentTargetDay} REWARD!</span>
              </button>
            )}
          </div>
        </div>

        {/* Claimed Success Banner Overlay */}
        {claimedReward && (
          <div className="mt-3 p-3 bg-emerald-100 border-2 border-emerald-600 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{claimedReward.badge}</span>
              <div>
                <p className="text-xs font-black text-emerald-950">
                  Claimed: {claimedReward.title}!
                </p>
                <p className="text-[11px] text-emerald-800">
                  +{claimedReward.coins} 🪙 and +{claimedReward.cookies} 🍪 added to your bag!
                </p>
              </div>
            </div>
            <button
              onClick={() => setClaimedReward(null)}
              className="text-xs font-black text-emerald-900 hover:underline px-2 py-1"
            >
              OK
            </button>
          </div>
        )}

        {/* Developer Sandbox Testing Controls */}
        <div className="mt-4 pt-3 border-t border-slate-900/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span className="font-bold flex items-center gap-1 text-slate-600">
            <span>⚙️</span> Fast-Forward &amp; Testing:
          </span>
          <div className="flex items-center gap-2">
            {onDevAdvanceDay && (
              <button
                onClick={onDevAdvanceDay}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
                title="Simulates advancing to the next calendar day to test streak rewards"
              >
                <FastForward className="w-3 h-3 text-amber-500" />
                <span>Advance +1 Day</span>
              </button>
            )}
            {onDevResetStreak && (
              <button
                onClick={onDevResetStreak}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-300 flex items-center gap-1 transition-colors"
                title="Reset streak and login date for first-time player preview"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Streak</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
