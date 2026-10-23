import React, { useState } from 'react';
import {
  X,
  Star,
  Download,
  Share2,
  CheckCircle,
  Shield,
  Smartphone,
  Trophy,
  Sparkles,
  CreditCard,
  RotateCw,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Apple,
  Award,
} from 'lucide-react';
import { sound } from '../game/audio';

interface AppStoreModalProps {
  onClose: () => void;
  onGrantReward?: (coins: number) => void;
  onUnlockPass?: () => void;
}

export const AppStoreModal: React.FC<AppStoreModalProps> = ({
  onClose,
  onGrantReward,
  onUnlockPass,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'iap' | 'gamecenter' | 'reviews'>('store');
  const [purchasedIAPs, setPurchasedIAPs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('snoopy_purchased_iaps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>(() => {
    return localStorage.getItem('snoopy_app_installed') === 'true' ? 'installed' : 'idle';
  });

  // Simulated Apple Pay / StoreKit purchase sheet
  const [activePurchaseItem, setActivePurchaseItem] = useState<{
    id: string;
    title: string;
    price: string;
    coins?: number;
    pass?: boolean;
  } | null>(null);

  const [purchaseProcessing, setPurchaseProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  // Game Center Achievement Notifications
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([
    'ach_first_flight',
    'ach_warmth_master',
  ]);
  const [gcToast, setGcToast] = useState<{ title: string; points: number } | null>(null);

  // User Review Submission State
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: 'PeanutsCollector_99',
      rating: 5,
      date: 'Yesterday',
      title: 'Worth every single cent!',
      content:
        'The Schulz comic book art style, Vince Guaraldi jazz soundtrack, and Snow ATV racing with Charlie Brown and Snoopy are pure nostalgic gold. Best 99¢ I spent this holiday season!',
      developerReply:
        'Thank you so much! Snoopy and Woodstock are doing a happy dance in the snow for you!',
    },
    {
      id: 2,
      author: 'LucyVanPelt_MD',
      rating: 5,
      date: '2 days ago',
      title: 'Real Peanuts characters & authentic sound!',
      content:
        'Lucy’s psychiatric booth and Schroeder’s Beethoven chords in Level 3 made my holiday. Even better than the Apple TV specials. 5 stars all the way!',
      developerReply:
        'The Doctor is IN! Stay warm near Linus’ campfire and enjoy the holiday snowboards!',
    },
    {
      id: 3,
      author: 'PilotAce_Doghouse',
      rating: 5,
      date: '3 days ago',
      title: 'The dynamic blizzard effects are incredible',
      content:
        'The transition from gentle snowflakes in Board 1 to the intense arctic blizzard in Board 5 with wind streaks feels like a genuine console platformer on iPhone!',
      developerReply: null,
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewBody, setNewReviewBody] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Trigger Apple Pay / StoreKit purchase
  const handleInitiatePurchase = (item: {
    id: string;
    title: string;
    price: string;
    coins?: number;
    pass?: boolean;
  }) => {
    sound.playClick();
    setActivePurchaseItem(item);
    setPurchaseProcessing(false);
    setPurchaseSuccess(false);
  };

  const handleConfirmStoreKitPurchase = () => {
    if (!activePurchaseItem) return;
    setPurchaseProcessing(true);

    setTimeout(() => {
      setPurchaseProcessing(false);
      setPurchaseSuccess(true);
      sound.playLevelUp();

      const newPurchases = [...purchasedIAPs, activePurchaseItem.id];
      setPurchasedIAPs(newPurchases);
      try {
        localStorage.setItem('snoopy_purchased_iaps', JSON.stringify(newPurchases));
      } catch (e) {
        console.error(e);
      }

      if (activePurchaseItem.coins && onGrantReward) {
        onGrantReward(activePurchaseItem.coins);
      }
      if (activePurchaseItem.pass && onUnlockPass) {
        onUnlockPass();
      }

      setTimeout(() => {
        setActivePurchaseItem(null);
        setPurchaseSuccess(false);
      }, 1800);
    }, 1200);
  };

  const handleRestorePurchases = () => {
    sound.playClick();
    setRestoreMessage('Contacting Apple App Store & Google Play servers...');
    setTimeout(() => {
      setRestoreMessage('✓ Purchases restored successfully! All licenses and bonuses verified.');
      setTimeout(() => setRestoreMessage(null), 3000);
    }, 1200);
  };

  const handleSimulateGameCenterAchievement = (id: string, title: string, points: number) => {
    sound.playLevelUp();
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements((prev) => [...prev, id]);
    }
    setGcToast({ title, points });
    setTimeout(() => setGcToast(null), 3500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewBody.trim()) return;

    sound.playCoin();
    const newEntry = {
      id: Date.now(),
      author: newReviewAuthor.trim() || 'HolidayPlayer_' + Math.floor(Math.random() * 900 + 100),
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim(),
      content: newReviewBody.trim(),
      developerReply: 'Thank you for your rating! Happy Holidays from Peanuts Worldwide!',
    };

    setReviewsList([newEntry, ...reviewsList]);
    setNewReviewTitle('');
    setNewReviewBody('');
    setShowReviewForm(false);
  };

  const handleInstallApp = () => {
    sound.playClick();
    setInstallState('installing');
    setTimeout(() => {
      setInstallState('installed');
      sound.playLevelUp();
      localStorage.setItem('snoopy_app_installed', 'true');
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Game Center Notification Toast */}
      {gcToast && (
        <div className="absolute top-4 z-50 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-2.5 rounded-full border border-slate-700 shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-sm">
            🏆
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              Game Center Achievement Unlocked
            </div>
            <div className="text-xs font-black text-white">
              {gcToast.title} <span className="text-yellow-300">+{gcToast.points} G</span>
            </div>
          </div>
        </div>
      )}

      {/* Main App Store Window */}
      <div className="relative w-full max-w-3xl bg-slate-900 text-slate-100 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* App Store Top Header Bar */}
        <div className="bg-slate-950/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <div className="ml-3 flex items-center gap-2 text-xs font-black text-slate-400">
              <span className="text-amber-400"> App Store</span>
              <span>&amp; Google Play Store Official Product Hub</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900 px-5 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('store');
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'store'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Store Overview</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('iap');
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'iap'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>In-App Purchases (99¢)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('gamecenter');
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'gamecenter'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Game Center &amp; Play Games</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('reviews');
            }}
            className={`px-4 py-2 text-xs font-black rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-slate-800 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Ratings &amp; Reviews (4.9 ★)</span>
          </button>
        </div>

        {/* Restore Purchases Notification Banner */}
        {restoreMessage && (
          <div className="bg-amber-400 text-slate-950 px-5 py-2 text-xs font-black flex items-center justify-between animate-in fade-in">
            <span>{restoreMessage}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: APP STORE OVERVIEW */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              {/* Product Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-400 border-2 border-slate-900 shadow-xl flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                  <span>🐶</span>
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl">
                    99¢
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase border border-amber-400/30">
                      #1 Holiday Arcade
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase border border-blue-400/30">
                      Editors' Choice
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Holiday Mini Game with Snoopy and Friends
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">
                    Peanuts Worldwide LLC · Contains In-App Purchases
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs font-black">
                    <div className="flex items-center gap-1 text-amber-400">
                      <span>4.9</span>
                      <div className="flex text-amber-400 text-[10px]">★★★★★</div>
                      <span className="text-slate-400 font-normal">(128.4K)</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="text-slate-300">Age 4+</div>
                    <span className="text-slate-600">|</span>
                    <div className="text-slate-300">48.2 MB</div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleInstallApp}
                    disabled={installState === 'installing'}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs border-2 border-slate-900 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                      installState === 'installed'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {installState === 'installing' ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>INSTALLING...</span>
                      </>
                    ) : installState === 'installed' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>OPEN / INSTALLED</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>GET · $0.99</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRestorePurchases}
                    className="text-[11px] text-slate-400 hover:text-white font-bold text-center underline transition-colors"
                  >
                    Restore Purchases
                  </button>
                </div>
              </div>

              {/* In-App Highlights Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center">
                  <div className="text-2xl mb-1">🛷</div>
                  <div className="text-xs font-black text-white">Snow ATV Rally</div>
                  <div className="text-[10px] text-slate-400">3D Perspective Track</div>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center">
                  <div className="text-2xl mb-1">🧣</div>
                  <div className="text-xs font-black text-white">Real Friends</div>
                  <div className="text-[10px] text-slate-400">Charlie, Linus, Lucy</div>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center">
                  <div className="text-2xl mb-1">❄️</div>
                  <div className="text-xs font-black text-white">Dynamic Weather</div>
                  <div className="text-[10px] text-slate-400">Flurry to Blizzard</div>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-center">
                  <div className="text-2xl mb-1">👻</div>
                  <div className="text-xs font-black text-white">Snapchat Lens</div>
                  <div className="text-[10px] text-slate-400">Official AR Camera</div>
                </div>
              </div>

              {/* What's New in Version 2.5 */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">What's New in Version 2.5</h3>
                  <span className="text-[11px] text-slate-400">Holiday Special Release</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>
                    <b className="text-amber-400">Dynamic Weather Overlays:</b> CSS animated gentle
                    snowflakes in Boards 1–2 and arctic blizzards with gale wind streaks in Boards 4–5.
                  </li>
                  <li>
                    <b className="text-amber-400">Real Peanuts Characters:</b> Hand-crafted Schulz
                    sprites for Lucy Van Pelt and Schroeder with Beethoven musical aura.
                  </li>
                  <li>
                    <b className="text-amber-400">Built-in App Store Features:</b> Real In-App Purchase
                    StoreKit simulator, Apple Game Center achievements, and customer reviews.
                  </li>
                  <li>
                    <b className="text-amber-400">99¢ In-App Store:</b> Unlock all boards, sticker pack,
                    and golden doghouse pass.
                  </li>
                </ul>
              </div>

              {/* App Information Specs Table */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">
                  App Store Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Provider</span>
                    <span className="font-bold text-white">Peanuts Worldwide LLC</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Size</span>
                    <span className="font-bold text-white">48.2 MB</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category</span>
                    <span className="font-bold text-white">Games / Family / Arcade</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Compatibility</span>
                    <span className="font-bold text-white">iOS 16+, Android 12+</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Family Sharing</span>
                    <span className="font-bold text-emerald-400">Yes (Up to 6 members)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">In-App Purchases</span>
                    <span className="font-bold text-amber-400">99¢ StoreKit Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP PURCHASES (IAP) */}
          {activeTab === 'iap' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">
                    Official In-App Purchases (StoreKit)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real built-in Apple Pay &amp; Google Play Billing item catalog.
                  </p>
                </div>
                <button
                  onClick={handleRestorePurchases}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-200 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Restore Purchases</span>
                </button>
              </div>

              {/* IAP Item Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. 99¢ Holiday Full Pass */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border-2 border-slate-700/80 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black">
                      🎟️
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-black border border-amber-400/30">
                      Most Popular
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">99¢ Holiday Mini Game Full Pass</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Unlock all 5 festive boards, full Snow ATV rally mode, and all Peanuts Friends
                      (Linus, Lucy, Schroeder, Woodstock).
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-base font-black text-amber-400">$0.99</span>
                    <button
                      onClick={() =>
                        handleInitiatePurchase({
                          id: 'iap_full_pass',
                          title: 'Holiday Mini Game Full Pass',
                          price: '$0.99',
                          pass: true,
                          coins: 200,
                        })
                      }
                      disabled={purchasedIAPs.includes('iap_full_pass')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all ${
                        purchasedIAPs.includes('iap_full_pass')
                          ? 'bg-emerald-500 text-slate-950 cursor-default'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                      }`}
                    >
                      {purchasedIAPs.includes('iap_full_pass') ? '✓ UNLOCKED' : 'BUY · 99¢'}
                    </button>
                  </div>
                </div>

                {/* 2. 99¢ Snoopy Stickers & Emojis */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border-2 border-slate-700/80 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xl font-black">
                      🎀
                    </div>
                    <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-black border border-pink-400/30">
                      iMessage &amp; Android
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Snoopy &amp; Friends Sticker Pack</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Official animated holiday stickers for iOS Messages keyboard and Android
                      WhatsApp / Gboard sticker packs.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-base font-black text-pink-400">$0.99</span>
                    <button
                      onClick={() =>
                        handleInitiatePurchase({
                          id: 'iap_stickers',
                          title: 'Snoopy & Friends Sticker Pack',
                          price: '$0.99',
                          coins: 100,
                        })
                      }
                      disabled={purchasedIAPs.includes('iap_stickers')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all ${
                        purchasedIAPs.includes('iap_stickers')
                          ? 'bg-emerald-500 text-slate-950 cursor-default'
                          : 'bg-pink-500 hover:bg-pink-400 text-white active:scale-95'
                      }`}
                    >
                      {purchasedIAPs.includes('iap_stickers') ? '✓ UNLOCKED' : 'BUY · 99¢'}
                    </button>
                  </div>
                </div>

                {/* 3. $1.99 Santa Snoopy Golden Flying Ace Bundle */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border-2 border-slate-700/80 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500 text-slate-950 flex items-center justify-center text-xl font-black">
                      👑
                    </div>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[10px] font-black border border-yellow-400/30">
                      Collector Special
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Golden Doghouse &amp; 1,000 Coins</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Snoopy's iconic Golden Flying Ace Doghouse skin, 1,000 holiday gold coins, and
                      Schroeder's Hi-Fi Christmas Carol audio.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-base font-black text-yellow-400">$1.99</span>
                    <button
                      onClick={() =>
                        handleInitiatePurchase({
                          id: 'iap_golden_bundle',
                          title: 'Golden Doghouse & 1,000 Coins Bundle',
                          price: '$1.99',
                          coins: 1000,
                        })
                      }
                      disabled={purchasedIAPs.includes('iap_golden_bundle')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all ${
                        purchasedIAPs.includes('iap_golden_bundle')
                          ? 'bg-emerald-500 text-slate-950 cursor-default'
                          : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 active:scale-95'
                      }`}
                    >
                      {purchasedIAPs.includes('iap_golden_bundle') ? '✓ UNLOCKED' : 'BUY · $1.99'}
                    </button>
                  </div>
                </div>

                {/* 4. 99¢ Vince Guaraldi Peanuts Carols Jukebox Pass */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border-2 border-slate-700/80 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center text-xl font-black">
                      📻
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-black border border-sky-400/30">
                      Holiday Music
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Peanuts Holiday Jukebox Pass</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Unlimited high-fidelity playback of "Christmas Time Is Here", "Linus and Lucy",
                      and "O Tannenbaum".
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-base font-black text-sky-400">$0.99</span>
                    <button
                      onClick={() =>
                        handleInitiatePurchase({
                          id: 'iap_jukebox',
                          title: 'Peanuts Holiday Jukebox Pass',
                          price: '$0.99',
                          coins: 150,
                        })
                      }
                      disabled={purchasedIAPs.includes('iap_jukebox')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all ${
                        purchasedIAPs.includes('iap_jukebox')
                          ? 'bg-emerald-500 text-slate-950 cursor-default'
                          : 'bg-sky-400 hover:bg-sky-300 text-slate-950 active:scale-95'
                      }`}
                    >
                      {purchasedIAPs.includes('iap_jukebox') ? '✓ UNLOCKED' : 'BUY · 99¢'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GAME CENTER & PLAY GAMES */}
          {activeTab === 'gamecenter' && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-850 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center text-2xl font-black">
                    🐶
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Game Center Profile
                    </div>
                    <div className="text-base font-black text-white">Snoopy_Pilot</div>
                    <div className="text-xs text-amber-400 font-bold">2,450 Achievement Points</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-bold">Global Rank</span>
                  <span className="text-lg font-black text-amber-400">#42 in Holiday Games</span>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Official Game Center Achievements (Click to Simulate)
                </h4>

                {[
                  {
                    id: 'ach_first_flight',
                    title: 'First Flight Ace',
                    desc: 'Clear Board 1 (Snow Flurry Trail) with Snoopy.',
                    points: 50,
                    icon: '✈️',
                  },
                  {
                    id: 'ach_warmth_master',
                    title: "Linus' Blanket & Campfire",
                    desc: 'Maintain 100% warmth using campfires across 3 boards.',
                    points: 75,
                    icon: '🧣',
                  },
                  {
                    id: 'ach_lucy_advice',
                    title: "Lucy's 5¢ Winter Wisdom",
                    desc: 'Smash 10 Blizzard Ghouls with snowballs.',
                    points: 100,
                    icon: '👧',
                  },
                  {
                    id: 'ach_schroeder_concerto',
                    title: "Schroeder's Holiday Concerto",
                    desc: 'Collect all cold cookies while listening to Beethoven.',
                    points: 125,
                    icon: '🎹',
                  },
                  {
                    id: 'ach_atv_drift',
                    title: 'Snow ATV Rally Drift Champion',
                    desc: 'Finish a Snow ATV race with zero fence collisions.',
                    points: 150,
                    icon: '🛷',
                  },
                  {
                    id: 'ach_woodstock_eve',
                    title: "Woodstock's Christmas Eve Flight",
                    desc: 'Unlock Woodstock and reach the rooftop doghouse.',
                    points: 200,
                    icon: '🐤',
                  },
                ].map((ach) => {
                  const isUnlocked = unlockedAchievements.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      onClick={() =>
                        handleSimulateGameCenterAchievement(ach.id, ach.title, ach.points)
                      }
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-slate-800/80 border-amber-400/40 hover:border-amber-400'
                          : 'bg-slate-850/40 border-slate-800 hover:border-slate-700 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                            isUnlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {ach.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{ach.title}</span>
                            {isUnlocked && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                                Unlocked
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{ach.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-400">+{ach.points} G</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Ratings Summary Breakdown */}
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-black text-white">4.9</div>
                  <div className="flex text-amber-400 text-sm justify-center sm:justify-start my-1">
                    ★★★★★
                  </div>
                  <div className="text-xs text-slate-400">128,420 Ratings</div>
                </div>

                {/* Rating Bars */}
                <div className="w-full sm:w-60 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-3">5★</span>
                    <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[92%]" />
                    </div>
                    <span className="text-[10px] text-slate-400 w-8">92%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-3">4★</span>
                    <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[6%]" />
                    </div>
                    <span className="text-[10px] text-slate-400 w-8">6%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-3">3★</span>
                    <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[1%]" />
                    </div>
                    <span className="text-[10px] text-slate-400 w-8">1%</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm shrink-0 transition-transform active:scale-95"
                >
                  Write a Review
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-slate-800 p-4 rounded-2xl border-2 border-amber-400/50 space-y-3 animate-in fade-in"
                >
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Submit App Store Review
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Reviewer Nickname
                      </label>
                      <input
                        type="text"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. SnoopyHolidayFan"
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Star Rating
                      </label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
                      >
                        <option value={5}>★★★★★ (5 Stars - Love it!)</option>
                        <option value={4}>★★★★☆ (4 Stars - Great)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Best 99 cents holiday game ever!"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Your Comments
                    </label>
                    <textarea
                      value={newReviewBody}
                      onChange={(e) => setNewReviewBody(e.target.value)}
                      rows={3}
                      placeholder="Share your thoughts on Snoopy, Charlie Brown, winter gear, and Snow ATV racing..."
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-white"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900"
                    >
                      Post to App Store
                    </button>
                  </div>
                </form>
              )}

              {/* Review Feed */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{rev.author}</span>
                        <div className="flex text-amber-400 text-[10px]">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <h5 className="text-xs font-black text-amber-300">{rev.title}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>

                    {rev.developerReply && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border-l-2 border-amber-400 text-[11px] text-slate-400 space-y-0.5">
                        <span className="text-amber-400 font-bold block">Developer Response</span>
                        <p>{rev.developerReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with StoreKit Double-Click / Apple Pay Sheet */}
        {activePurchaseItem && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-white text-slate-950 flex items-center justify-center text-2xl mx-auto mb-3 font-black">
                <Apple className="w-6 h-6 fill-current" />
              </div>

              <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                Apple StoreKit &amp; Google Play
              </div>
              <h3 className="text-base font-black text-white mt-1">{activePurchaseItem.title}</h3>
              <div className="text-2xl font-black text-amber-400 my-2">
                {activePurchaseItem.price}
              </div>

              <p className="text-xs text-slate-400 mb-4">
                Confirm In-App Purchase with Touch ID, Face ID, or Password. Charges will be billed
                to your Apple ID or Google Play account.
              </p>

              {purchaseSuccess ? (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-black text-xs flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Payment Confirmed! Purchase Complete.</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePurchaseItem(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmStoreKitPurchase}
                    disabled={purchaseProcessing}
                    className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 flex items-center justify-center gap-1.5"
                  >
                    {purchaseProcessing ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <span>DOUBLE-CLICK / BUY</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
