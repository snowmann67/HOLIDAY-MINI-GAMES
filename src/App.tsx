import React, { useState, useEffect } from 'react';
import {
  CharacterType,
  LevelConfig,
  UpgradeItem,
} from './game/types';
import { GAME_LEVELS, getLevelById } from './game/levels';
import { sound } from './game/audio';
import { GameCanvas } from './game/GameCanvas';
import { UpgradesShop } from './components/UpgradesShop';
import { SnoopySnowGlobe } from './components/SnoopySnowGlobe';
import { HolidayJukebox } from './components/HolidayJukebox';
import { WallpapersGallery } from './components/WallpapersGallery';
import { PlayerSnapshotModal } from './components/PlayerSnapshotModal';
import { PlayerSubscriptionModal } from './components/PlayerSubscriptionModal';
import { SnowAtvRacing } from './components/SnowAtvRacing';
import { MobileQrModal } from './components/MobileQrModal';
import { SnoopyEmojiStoreModal } from './components/SnoopyEmojiStoreModal';
import { SnoopyRewardsAdModal } from './components/SnoopyRewardsAdModal';
import { FriendsLeaderboardModal } from './components/FriendsLeaderboardModal';
import { StoryModeModal } from './components/StoryModeModal';
import { SnoopyChatbot } from './components/SnoopyChatbot';
import { AppStoreModal } from './components/AppStoreModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { SnoopyHouseLogisticsModal } from './components/SnoopyHouseLogisticsModal';
import {
  Volume2,
  VolumeX,
  Music,
  Moon,
  Sun,
  Smartphone,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Shirt,
  Film,
  Camera,
  MessageSquare,
  Gift,
  HelpCircle,
  Share2,
} from 'lucide-react';

// Persistent light snowfall overlay across the entire screen during Cartoon Movie Night Theme
export const SnowfallOverlay: React.FC = () => {
  const snowflakes = React.useMemo(() => {
    // 48 varied flakes evenly spread across the viewport width
    return Array.from({ length: 48 }, (_, i) => {
      const left = (i * 2.1 + (i % 7) * 4.3) % 100;
      const size = 2 + (i % 4) * 1.5;
      const duration = 5.5 + (i % 6) * 1.2;
      const delay = -((i * 0.35) % 8);
      const swayDuration = 2.8 + (i % 3) * 1.1;
      const opacity = 0.35 + (i % 5) * 0.12;

      return {
        id: i,
        left: `${left}%`,
        size,
        duration,
        delay,
        swayDuration,
        opacity,
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `gentleSnowFall ${flake.duration}s linear ${flake.delay}s infinite, gentleSnowSway ${flake.swayDuration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  // Game progression state
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [coins, setCoins] = useState<number>(85);
  const [cookies, setCookies] = useState<number>(6);
  const [score, setScore] = useState<number>(1250);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerExp, setPlayerExp] = useState<number>(20);
  const [zombiesDefeated, setZombiesDefeated] = useState<number>(3);
  const [playerName, setPlayerName] = useState<string>('Snoopy_Pilot');

  // Equipped Gear
  const [character, setCharacter] = useState<CharacterType>('SNOOPY');
  const [equipped, setEquipped] = useState({
    mitts: 'mitts_0',
    hat: 'hat_0',
    sweater: 'sweater_0',
  });
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>(['mitts_0', 'hat_0', 'sweater_0']);
  const [unlockedCharacters, setUnlockedCharacters] = useState<CharacterType[]>(['SNOOPY', 'CHARLIE_BROWN']);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1, 2]);

  // Visual Themes: Cartoon Movie Night Theme vs Daylight Theme
  const [nightTheme, setNightTheme] = useState<boolean>(true);

  // Audio state
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [musicOn, setMusicOn] = useState<boolean>(true);

  // Modals & Panels state
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showSnowGlobe, setShowSnowGlobe] = useState<boolean>(false);
  const [showJukebox, setShowJukebox] = useState<boolean>(false);
  const [showWallpapers, setShowWallpapers] = useState<boolean>(false);
  const [showSnapshot, setShowSnapshot] = useState<boolean>(false);
  const [showSubscription, setShowSubscription] = useState<boolean>(false);
  const [showAtvRacing, setShowAtvRacing] = useState<boolean>(false);
  const [showMobileQr, setShowMobileQr] = useState<boolean>(false);
  const [showEmojiStore, setShowEmojiStore] = useState<boolean>(false);
  const [showRewardsAd, setShowRewardsAd] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showStoryMode, setShowStoryMode] = useState<boolean>(false);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const [showAppStore, setShowAppStore] = useState<boolean>(false);
  const [showDailyReward, setShowDailyReward] = useState<boolean>(false);
  const [showHouseLogistics, setShowHouseLogistics] = useState<boolean>(false);

  // Daily Sign-In Reward State (tracks lastLoginDate and streak)
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(() => {
    return localStorage.getItem('peanuts_daily_reward_last_date');
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('peanuts_daily_reward_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDailyRewardAvailable = lastLoginDate !== getTodayDateStr();

  // Auto-prompt daily reward if available on initial session
  useEffect(() => {
    if (lastLoginDate !== getTodayDateStr()) {
      const timer = setTimeout(() => {
        setShowDailyReward(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimDailyReward = (
    reward: { coins: number; cookies: number; bonusItem?: string },
    newStreak: number,
    newLastLoginDate: string
  ) => {
    setCoins((c) => c + reward.coins);
    setCookies((k) => k + reward.cookies);
    setStreak(newStreak);
    setLastLoginDate(newLastLoginDate);
    localStorage.setItem('peanuts_daily_reward_streak', newStreak.toString());
    localStorage.setItem('peanuts_daily_reward_last_date', newLastLoginDate);
  };

  const handleDevAdvanceDay = () => {
    // Sets lastLoginDate to yesterday so today becomes claimable to test next streak day!
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const yesterday = `${year}-${month}-${day}`;
    setLastLoginDate(yesterday);
    localStorage.setItem('peanuts_daily_reward_last_date', yesterday);
  };

  const handleDevResetStreak = () => {
    setLastLoginDate(null);
    setStreak(0);
    localStorage.removeItem('peanuts_daily_reward_last_date');
    localStorage.removeItem('peanuts_daily_reward_streak');
  };

  // Level Clear Celebration Overlay
  const [levelClearData, setLevelClearData] = useState<{
    score: number;
    coins: number;
    cookies: number;
    zombies: number;
  } | null>(null);

  const currentLevelConfig = getLevelById(currentLevelId);

  // Start holiday music upon first user interaction
  useEffect(() => {
    const handleFirstGesture = () => {
      sound.startBGM();
      window.removeEventListener('click', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture);
    return () => window.removeEventListener('click', handleFirstGesture);
  }, []);

  const handleLevelComplete = (
    pts: number,
    earnedCoins: number,
    earnedCookies: number,
    smashedZombies: number
  ) => {
    setScore((prev) => prev + pts);
    setCoins((prev) => prev + earnedCoins);
    setCookies((prev) => prev + earnedCookies);
    setZombiesDefeated((prev) => prev + smashedZombies);

    setLevelClearData({
      score: pts,
      coins: earnedCoins,
      cookies: earnedCookies,
      zombies: smashedZombies,
    });

    // Unlock next level & friend if not already unlocked
    const nextLvl = currentLevelId + 1;
    if (nextLvl <= GAME_LEVELS.length && !unlockedLevels.includes(nextLvl)) {
      setUnlockedLevels((prev) => [...prev, nextLvl]);
    }

    // Level-specific character unlocks
    if (currentLevelId === 1 && !unlockedCharacters.includes('LINUS')) {
      setUnlockedCharacters((prev) => [...prev, 'LINUS']);
    } else if (currentLevelId === 2 && !unlockedCharacters.includes('LUCY')) {
      setUnlockedCharacters((prev) => [...prev, 'LUCY']);
    } else if (currentLevelId === 3 && !unlockedCharacters.includes('SCHROEDER')) {
      setUnlockedCharacters((prev) => [...prev, 'SCHROEDER']);
    } else if (currentLevelId === 4 && !unlockedCharacters.includes('WOODSTOCK')) {
      setUnlockedCharacters((prev) => [...prev, 'WOODSTOCK']);
    }
  };

  const handleNextLevel = () => {
    setLevelClearData(null);
    if (currentLevelId < GAME_LEVELS.length) {
      setCurrentLevelId((prev) => prev + 1);
    } else {
      setCurrentLevelId(1);
    }
  };

  const handleEquip = (category: 'mitts' | 'hat' | 'sweater', id: string) => {
    setEquipped((prev) => ({ ...prev, [category]: id }));
  };

  const handleBuyUpgrade = (item: UpgradeItem): boolean => {
    if (coins >= item.cost) {
      setCoins((prev) => prev - item.cost);
      setPurchasedUpgrades((prev) => [...prev, item.id]);
      setEquipped((prev) => ({ ...prev, [item.category]: item.id }));
      return true;
    }
    return false;
  };

  const handleLevelUpStats = (): boolean => {
    if (cookies >= 3) {
      setCookies((prev) => prev - 3);
      setPlayerLevel((prev) => prev + 1);
      return true;
    }
    return false;
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 relative ${
        nightTheme
          ? 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950'
          : 'bg-amber-50/70 text-slate-900 selection:bg-amber-400 selection:text-slate-950'
      }`}
    >
      {/* Persistent Light Snowfall Overlay Across Entire Screen during Cartoon Movie Night Theme */}
      {nightTheme && <SnowfallOverlay />}

      {/* 1. TOP BAR CONTRACT */}
      <header
        className={`flex items-center justify-between gap-8 px-6 py-3.5 border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
          nightTheme
            ? 'bg-slate-900/90 border-slate-800 text-white'
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}
      >
        {/* Zone 1: Single Brand Wordmark */}
        <a
          href="/"
          className="flex items-center gap-2 text-base font-black tracking-tight whitespace-nowrap shrink-0 group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🐶</span>
          <span className="text-amber-400 font-black">Holiday Mini Game</span>
          <span className="text-white hidden sm:inline font-black">with Snoopy &amp; Friends</span>
        </a>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-black">
          <button
            onClick={() => setShowAppStore(true)}
            className="hover:text-amber-400 text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-black"
          >
            <span> App Store (99¢)</span>
          </button>
          <a
            href="https://snapchat.com/t/SrwrfBW2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 text-yellow-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-black"
          >
            <span>👻 Snapchat Lens</span>
          </a>
          <button
            onClick={() => setShowHouseLogistics(true)}
            className="hover:text-amber-400 text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-black"
          >
            <span>🏠 Doghouse &amp; Moon</span>
          </button>
          <button
            onClick={() => setShowDailyReward(true)}
            className="hover:text-amber-400 text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-black relative group"
          >
            <span>🎁 Daily Reward</span>
            {isDailyRewardAvailable && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setShowStoryMode(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            📖 Story Mode
          </button>
          <button
            onClick={() => setShowAtvRacing(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-amber-400"
          >
            🛷 ATV Racing
          </button>
          <button
            onClick={() => setShowShop(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            👕 Wardrobe
          </button>
          <button
            onClick={() => setShowEmojiStore(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            🎀 Emoji Store
          </button>
          <button
            onClick={() => setShowJukebox(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            📻 Carols
          </button>
          <button
            onClick={() => setShowWallpapers(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            🖼️ 4K Wallpapers
          </button>
          <button
            onClick={() => setShowChatbot(true)}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            ⌨️ Snoopy AI
          </button>
        </nav>

        {/* Zone 3: Single Primary Action + Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Daily Gift Quick Button */}
          <button
            onClick={() => setShowDailyReward(true)}
            className={`px-3 py-2 text-xs font-black rounded-xl border-2 border-slate-900 shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95 ${
              isDailyRewardAvailable
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 animate-pulse ring-2 ring-amber-400/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Daily Sign-In Reward"
          >
            <span>🎁</span>
            <span className="hidden sm:inline">Daily Reward</span>
            {isDailyRewardAvailable && (
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Claim!
              </span>
            )}
          </button>

          {/* Night Theme Toggle */}
          <button
            onClick={() => setNightTheme((prev) => !prev)}
            className={`p-2 rounded-xl border transition-colors ${
              nightTheme
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Cartoon Movie Night Theme"
          >
            {nightTheme ? <Moon className="w-4 h-4 fill-amber-300" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              const on = sound.toggleMusic();
              setMusicOn(on);
            }}
            className={`p-2 rounded-xl border transition-colors ${
              musicOn
                ? 'bg-amber-400 border-slate-900 text-slate-950 font-black'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Peanuts Holiday Music"
          >
            {musicOn ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Primary CTA: Apple iPhone & Android QR Code */}
          <button
            onClick={() => setShowMobileQr(true)}
            className="px-4 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl border-2 border-slate-900 shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Play on Phone (QR)</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex flex-col gap-4">
        {/* Game Stats & Feature Pills Strip */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Level Boards Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {GAME_LEVELS.map((lvl) => {
              const isUnlocked = unlockedLevels.includes(lvl.id);
              const isCurrent = currentLevelId === lvl.id;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playCoin();
                      setCurrentLevelId(lvl.id);
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-sm'
                      : isUnlocked
                      ? nightTheme
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      : 'bg-slate-800/40 text-slate-500 border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>Board {lvl.id}</span>
                  <span className="hidden sm:inline font-normal text-[11px] opacity-80">
                    · {lvl.name.split(':')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowDailyReward(true)}
              className={`px-3 py-1.5 font-black rounded-xl border-2 border-slate-900 text-xs shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5 ${
                isDailyRewardAvailable
                  ? 'bg-amber-400 text-slate-950 animate-pulse ring-2 ring-amber-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <span>🎁</span>
              <span>Daily Gift {streak > 0 ? `(Day ${((streak - 1) % 7) + 1})` : ''}</span>
              {isDailyRewardAvailable && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setShowAppStore(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black rounded-xl border-2 border-slate-900 text-xs shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span></span>
              <span>App Store &amp; 99¢ IAP</span>
            </button>

            <a
              href="https://snapchat.com/t/SrwrfBW2"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-yellow-400 text-slate-950 font-black rounded-xl border border-slate-900 text-xs shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>👻</span>
              <span>Snapchat Lens Cover</span>
            </a>

            <button
              onClick={() => setShowSnowGlobe(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl border border-slate-900 text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>🔮 Snow Globe</span>
            </button>

            <button
              onClick={() => setShowHouseLogistics(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl border border-slate-900 text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>🏠</span>
              <span>Doghouse Logistics</span>
            </button>

            <button
              onClick={() => setShowSnapshot(true)}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl border-2 border-slate-900 text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-950" />
              <span>Share Game Status</span>
            </button>

            <button
              onClick={() => setShowSubscription(true)}
              className="px-3 py-1.5 bg-red-600 text-white rounded-xl border border-slate-900 text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>⭐ 99¢ VIP Pass</span>
            </button>

            <button
              onClick={() => setShowRewardsAd(true)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl border border-slate-900 text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>🍿 +100 Coins</span>
            </button>
          </div>
        </div>

        {/* 3. PLAYABLE 2D CANVAS GAME BOARD */}
        <GameCanvas
          level={currentLevelConfig}
          character={character}
          equipped={equipped}
          playerLevel={playerLevel}
          nightTheme={nightTheme}
          onLevelComplete={handleLevelComplete}
          onGameOver={() => {
            sound.playGameOver();
            alert("Good grief! The cold got you. Warm up near campfires & upgrade your sweater!");
          }}
        />

        {/* 4. BOTTOM ACTION CONTROL DOCK */}
        <div
          className={`p-4 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
            nightTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Active Character & Wardrobe Preview */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-2xl shadow-sm">
              {character === 'SNOOPY'
                ? '🐶'
                : character === 'CHARLIE_BROWN'
                ? '👦'
                : character === 'LINUS'
                ? '🧣'
                : character === 'LUCY'
                ? '👧'
                : character === 'SCHROEDER'
                ? '🎹'
                : '🐤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-tight">{playerName}</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Lvl {playerLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Playing as: <b className="text-white">{character}</b> · Score: {score} pts
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setShowShop(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Shirt className="w-4 h-4" />
              <span>Wardrobe & Upgrades</span>
            </button>

            <button
              onClick={() => setShowAtvRacing(true)}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>🛷 Snow ATV Rally</span>
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-slate-700 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setShowChatbot(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Snoopy AI Co-Pilot</span>
            </button>
          </div>
        </div>
      </main>

      {/* 5. LEVEL COMPLETE CELEBRATION MODAL */}
      {levelClearData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-amber-50 border-4 border-slate-900 rounded-3xl p-6 text-center shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="text-6xl mb-2 animate-bounce">🐶💃✨</div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">BOARD CLEARED!</h3>
            <p className="text-xs text-amber-800 font-bold italic mt-1">
              "Snoopy does his world-famous happy dance in the snow!"
            </p>

            <div className="my-4 p-4 bg-white rounded-2xl border-2 border-slate-900 grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Bonus Score</span>
                <span className="text-base font-black text-slate-900 tabular-nums">+{levelClearData.score}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Gold Coins</span>
                <span className="text-base font-black text-amber-500 tabular-nums">+{levelClearData.coins} 🪙</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Cold Cookies</span>
                <span className="text-base font-black text-sky-600 tabular-nums">+{levelClearData.cookies} 🍪</span>
              </div>
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm rounded-2xl border-4 border-slate-900 shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>PLAY NEXT HOLIDAY BOARD!</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. MODALS */}
      {showShop && (
        <UpgradesShop
          onClose={() => setShowShop(false)}
          coins={coins}
          cookies={cookies}
          playerLevel={playerLevel}
          playerExp={playerExp}
          equipped={{ ...equipped, character }}
          purchasedUpgrades={purchasedUpgrades}
          unlockedCharacters={unlockedCharacters}
          onEquip={handleEquip}
          onBuyUpgrade={handleBuyUpgrade}
          onSelectCharacter={setCharacter}
          onLevelUpStats={handleLevelUpStats}
        />
      )}

      {showSnowGlobe && (
        <SnoopySnowGlobe
          onClose={() => setShowSnowGlobe(false)}
          coins={coins}
          zombiesDefeated={zombiesDefeated}
          playerLevel={playerLevel}
        />
      )}

      {showJukebox && <HolidayJukebox onClose={() => setShowJukebox(false)} />}
      {showWallpapers && <WallpapersGallery onClose={() => setShowWallpapers(false)} />}
      {showSnapshot && (
        <PlayerSnapshotModal
          onClose={() => setShowSnapshot(false)}
          character={character}
          score={score}
          level={currentLevelId}
          coins={coins}
          zombiesDefeated={zombiesDefeated}
          equipped={equipped}
          playerName={playerName}
        />
      )}

      {showSubscription && (
        <PlayerSubscriptionModal
          onClose={() => setShowSubscription(false)}
          playerName={playerName}
          setPlayerName={setPlayerName}
          character={character}
          setCharacter={setCharacter}
          onGrantRewardCoins={(amount) => setCoins((c) => c + amount)}
          onUnlockAllCharacters={() =>
            setUnlockedCharacters(['SNOOPY', 'CHARLIE_BROWN', 'LINUS', 'LUCY', 'SCHROEDER', 'WOODSTOCK'])
          }
        />
      )}

      {showAtvRacing && (
        <SnowAtvRacing
          onClose={() => setShowAtvRacing(false)}
          character={character}
          onCoinsEarned={(earned) => setCoins((c) => c + earned)}
        />
      )}

      {showMobileQr && <MobileQrModal onClose={() => setShowMobileQr(false)} />}
      {showEmojiStore && (
        <SnoopyEmojiStoreModal
          onClose={() => setShowEmojiStore(false)}
          coins={coins}
          onSpendCoins={(amount) => {
            if (coins >= amount) {
              setCoins((c) => c - amount);
              return true;
            }
            return false;
          }}
        />
      )}

      {showRewardsAd && (
        <SnoopyRewardsAdModal
          onClose={() => setShowRewardsAd(false)}
          onGrantReward={(earned) => setCoins((c) => c + earned)}
        />
      )}

      {showLeaderboard && (
        <FriendsLeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          playerScore={score}
          playerLevel={playerLevel}
          zombiesDefeated={zombiesDefeated}
          playerName={playerName}
          character={character}
        />
      )}

      {showStoryMode && (
        <StoryModeModal
          onClose={() => setShowStoryMode(false)}
          unlockedLevels={unlockedLevels}
          onPlayLevel={(lvl) => setCurrentLevelId(lvl)}
        />
      )}

      {showChatbot && (
        <SnoopyChatbot
          onClose={() => setShowChatbot(false)}
          coins={coins}
          currentLevelName={currentLevelConfig.name}
          equipped={equipped}
        />
      )}

      {showAppStore && (
        <AppStoreModal
          onClose={() => setShowAppStore(false)}
          onGrantReward={(bonusCoins) => setCoins((prev) => prev + bonusCoins)}
          onUnlockPass={() => {
            setUnlockedLevels([1, 2, 3, 4, 5]);
            setUnlockedCharacters(['SNOOPY', 'CHARLIE_BROWN', 'LINUS', 'LUCY', 'SCHROEDER', 'WOODSTOCK']);
          }}
        />
      )}

      {showDailyReward && (
        <DailyRewardModal
          onClose={() => setShowDailyReward(false)}
          coins={coins}
          cookies={cookies}
          lastLoginDate={lastLoginDate}
          streak={streak}
          onClaimReward={handleClaimDailyReward}
          onDevAdvanceDay={handleDevAdvanceDay}
          onDevResetStreak={handleDevResetStreak}
        />
      )}

      {showHouseLogistics && (
        <SnoopyHouseLogisticsModal
          onClose={() => setShowHouseLogistics(false)}
          coins={coins}
          onGrantRewardCoins={(amount) => setCoins((c) => c + amount)}
          onGrantRewardCookies={(amount) => setCookies((k) => k + amount)}
        />
      )}

      {/* 7. FOOTER */}
      <footer
        className={`px-6 py-4 border-t text-center text-xs font-bold transition-colors ${
          nightTheme ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-amber-100/50 border-slate-200 text-slate-600'
        }`}
      >
        <span>
          © Peanuts Worldwide LLC · Holiday Mini Game with Snoopy and Friends · Built with Gemini 3.8 Flash &amp; Web Audio
        </span>
      </footer>
    </div>
  );
}
