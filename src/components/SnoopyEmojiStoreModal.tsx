import React, { useState } from 'react';
import { Smile, Download, Copy, Check, Sparkles, Tag, ExternalLink, Gift, Heart } from 'lucide-react';
import { sound } from '../game/audio';

interface EmojiSticker {
  id: string;
  name: string;
  category: 'holiday' | 'snoopy' | 'charlie' | 'woodstock';
  emoji: string;
  tags: string;
  unlocked: boolean;
  cost: number;
  badge?: string;
}

interface EmojiStoreModalProps {
  onClose: () => void;
  coins: number;
  onSpendCoins: (amount: number) => boolean;
}

export const PEANUTS_STICKERS: EmojiSticker[] = [
  {
    id: 'snoop_dance',
    name: 'Snoopy Happy Dance',
    category: 'snoopy',
    emoji: '🐶💃',
    tags: 'dance joy happy holiday',
    unlocked: true,
    cost: 0,
    badge: 'Classic',
  },
  {
    id: 'snoop_doghouse_lights',
    name: '1st Prize Decorated Doghouse',
    category: 'holiday',
    emoji: '🏠🎄',
    tags: 'christmas lights holiday first prize',
    unlocked: true,
    cost: 0,
    badge: 'Holiday',
  },
  {
    id: 'charlie_good_grief',
    name: 'Charlie Brown "Good Grief!"',
    category: 'charlie',
    emoji: '👦🤦',
    tags: 'good grief sigh yellow zigzag',
    unlocked: true,
    cost: 0,
    badge: 'Iconic',
  },
  {
    id: 'woodstock_scarf',
    name: 'Woodstock in Winter Scarf',
    category: 'woodstock',
    emoji: '🐥🧣',
    tags: 'tiny yellow bird warm winter friend',
    unlocked: true,
    cost: 0,
    badge: 'Cute',
  },
  {
    id: 'charlie_little_tree',
    name: "Charlie Brown's Little Tree",
    category: 'holiday',
    emoji: '🎄❤️',
    tags: 'little tree red bulb linus blanket love',
    unlocked: false,
    cost: 30,
    badge: 'Nostalgic',
  },
  {
    id: 'snoop_flying_ace',
    name: 'Flying Ace with Aviator Scarf',
    category: 'snoopy',
    emoji: '🛩️🐶',
    tags: 'curse you red baron aviator goggles',
    unlocked: false,
    cost: 45,
    badge: 'Heroic',
  },
  {
    id: 'lucy_doctor_in',
    name: "Lucy's 5¢ Advice Booth",
    category: 'charlie',
    emoji: '🏷️💭',
    tags: 'psychiatric help 5 cents the doctor is in',
    unlocked: false,
    cost: 40,
    badge: 'Classic',
  },
  {
    id: 'linus_blanket_hug',
    name: "Linus & Blue Blanket",
    category: 'charlie',
    emoji: '🧒💙',
    tags: 'security blanket wisdom holiday peace',
    unlocked: false,
    cost: 35,
    badge: 'Cozy',
  },
  {
    id: 'snoop_santa',
    name: 'Santa Snoopy & Gift Sack',
    category: 'holiday',
    emoji: '🎅🎁',
    tags: 'santa claus treats bones christmas',
    unlocked: false,
    cost: 50,
    badge: 'Special',
  },
  {
    id: 'schroeder_piano',
    name: "Schroeder's Toy Piano Carol",
    category: 'charlie',
    emoji: '🎹🎵',
    tags: 'beethoven vince guaraldi jazz music',
    unlocked: false,
    cost: 45,
    badge: 'Musical',
  },
  {
    id: 'woodstock_ice_skate',
    name: 'Woodstock Figure Skater',
    category: 'woodstock',
    emoji: '⛸️🐥',
    tags: 'ice pond frozen spin winter',
    unlocked: false,
    cost: 40,
    badge: 'Rare',
  },
  {
    id: 'snoop_charlie_hug',
    name: 'Snoopy Hugs Charlie Brown',
    category: 'snoopy',
    emoji: '🐶❤️👦',
    tags: 'friendship true meaning holiday warm',
    unlocked: false,
    cost: 60,
    badge: 'Heartwarming',
  },
];

export const SnoopyEmojiStoreModal: React.FC<EmojiStoreModalProps> = ({
  onClose,
  coins,
  onSpendCoins,
}) => {
  const [stickers, setStickers] = useState<EmojiSticker[]>(PEANUTS_STICKERS);
  const [filter, setFilter] = useState<'all' | 'holiday' | 'snoopy' | 'charlie' | 'woodstock'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUnlock = (sticker: EmojiSticker) => {
    if (coins < sticker.cost) {
      sound.playGameOver();
      return;
    }
    const success = onSpendCoins(sticker.cost);
    if (success) {
      sound.playStar();
      setStickers((prev) =>
        prev.map((s) => (s.id === sticker.id ? { ...s, unlocked: true } : s))
      );
    }
  };

  const handleUnlockAll = () => {
    // 99¢ promo unlock
    sound.playStar();
    setTimeout(() => sound.playVictory(), 150);
    setStickers((prev) => prev.map((s) => ({ ...s, unlocked: true })));
  };

  const handleCopySticker = (s: EmojiSticker) => {
    sound.playCoin();
    navigator.clipboard.writeText(s.emoji);
    setCopiedId(s.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filtered = stickers.filter((s) => (filter === 'all' ? true : s.category === filter));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐶🎀</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Official Peanuts Emoji &amp; Sticker Store
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Inspired by the Apple App Store &amp; Google Play Peanuts Sticker App · 99¢ Promo Pack!
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

        {/* 99 Cents App Store Banner with One-Click Buy Button */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <h3 className="text-xs font-black">Official App Store Promotion · 99¢ All-Stickers Bundle</h3>
              <p className="text-[10px] text-amber-100 font-medium">
                Compatible with iMessage, WhatsApp, Android Messages &amp; Instagram Stories!
              </p>
            </div>
          </div>
          <button
            onClick={handleUnlockAll}
            className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-md active:scale-95 transition-all shrink-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>BUY ALL 99¢ PACK</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 mb-4 bg-amber-100 p-1 rounded-xl border-2 border-slate-900/10">
          {(['all', 'holiday', 'snoopy', 'charlie', 'woodstock'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-black capitalize transition-all ${
                filter === cat
                  ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All Stickers' : cat}
            </button>
          ))}
        </div>

        {/* Sticker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`p-3 rounded-2xl border-2 flex flex-col justify-between items-center text-center transition-all ${
                s.unlocked
                  ? 'bg-white border-slate-900 shadow-xs hover:border-amber-400'
                  : 'bg-slate-100 border-slate-300 opacity-80'
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 mb-1 border border-amber-300">
                {s.badge}
              </span>

              <div className="text-4xl my-2 select-none filter drop-shadow hover:scale-110 transition-transform cursor-pointer">
                {s.emoji}
              </div>

              <h4 className="text-[11px] font-black text-slate-900 truncate w-full mb-2">{s.name}</h4>

              {s.unlocked ? (
                <button
                  onClick={() => handleCopySticker(s)}
                  className="w-full py-1 px-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-[10px] rounded-lg border border-slate-900 shadow-xs flex items-center justify-center gap-1 transition-transform active:scale-95"
                >
                  {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === s.id ? 'Copied!' : 'Copy Emoji'}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUnlock(s)}
                  className="w-full py-1 px-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-[10px] rounded-lg border border-slate-900 shadow-xs flex items-center justify-center gap-1 transition-transform active:scale-95"
                >
                  <span>Unlock {s.cost} 🪙</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
