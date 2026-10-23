import React, { useState } from 'react';
import {
  WINTER_MITTS,
  HOLIDAY_HATS,
  COZY_SWEATERS,
} from '../game/upgrades';
import { CharacterType, UpgradeItem } from '../game/types';
import { sound } from '../game/audio';
import { Shield, Sparkles, Zap, Heart, Check, Lock, ArrowUpCircle } from 'lucide-react';

interface UpgradesShopProps {
  onClose: () => void;
  coins: number;
  cookies: number;
  playerLevel: number;
  playerExp: number;
  equipped: {
    character: CharacterType;
    mitts: string;
    hat: string;
    sweater: string;
  };
  purchasedUpgrades: string[];
  unlockedCharacters: CharacterType[];
  onEquip: (category: 'mitts' | 'hat' | 'sweater', id: string) => void;
  onBuyUpgrade: (item: UpgradeItem) => boolean;
  onSelectCharacter: (char: CharacterType) => void;
  onLevelUpStats: () => boolean;
}

export const UpgradesShop: React.FC<UpgradesShopProps> = ({
  onClose,
  coins,
  cookies,
  playerLevel,
  playerExp,
  equipped,
  purchasedUpgrades,
  unlockedCharacters,
  onEquip,
  onBuyUpgrade,
  onSelectCharacter,
  onLevelUpStats,
}) => {
  const [activeTab, setActiveTab] = useState<'mitts' | 'hat' | 'sweater' | 'friends' | 'stats'>('sweater');

  const CHARACTERS: Array<{ id: CharacterType; name: string; title: string; emoji: string; desc: string; perk: string }> = [
    {
      id: 'SNOOPY',
      name: 'Snoopy',
      title: 'World Famous Beagle',
      emoji: '🐶',
      desc: 'Can ear-flutter glide across snowdrifts and does the legendary happy dance!',
      perk: 'Passive: +20% Air Glide Duration',
    },
    {
      id: 'CHARLIE_BROWN',
      name: 'Charlie Brown',
      title: 'Our Kindhearted Hero',
      emoji: '👦',
      desc: 'Determined leader wearing his iconic yellow zigzag sweater.',
      perk: 'Passive: +15% Health & Warmth Retention',
    },
    {
      id: 'LINUS',
      name: 'Linus Van Pelt',
      title: 'Philosopher with Blanket',
      emoji: '🧣',
      desc: 'Clutches his blue security blanket to deflect incoming snowballs.',
      perk: 'Passive: Deflects 1 Zombie Hit Every 15s',
    },
    {
      id: 'LUCY',
      name: 'Lucy Van Pelt',
      title: '5¢ Psychiatric Specialist',
      emoji: '🎀',
      desc: 'Bold and confident! Throws heavy, fast-hitting snowballs.',
      perk: 'Passive: +30% Snowball Throw Damage',
    },
    {
      id: 'SCHROEDER',
      name: 'Schroeder',
      title: 'Toy Piano Prodigy',
      emoji: '🎹',
      desc: 'Plays Beethoven holiday carols that stun nearby frost ghouls.',
      perk: 'Passive: Musical Notes Generate Bonus Coins',
    },
    {
      id: 'WOODSTOCK',
      name: 'Woodstock',
      title: 'Loyal Winter Wingman',
      emoji: '🐥',
      desc: 'Tiny yellow bird who flutters alongside you fetching loose coins.',
      perk: 'Passive: Automatic Coin Fetch Magnet',
    },
  ];

  const handleBuy = (item: UpgradeItem) => {
    const success = onBuyUpgrade(item);
    if (success) {
      sound.playStar();
    } else {
      sound.playGameOver();
    }
  };

  const handleEquip = (category: 'mitts' | 'hat' | 'sweater', id: string) => {
    sound.playCoin();
    onEquip(category, id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧤🧣👗</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Lucy's Winter Wardrobe & Upgrades Booth
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Upgrade customizable Mitts, Hats & Cozy Sweaters for Snoopy & Charlie Brown's Friends!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-200 px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-black text-slate-900">
              <span>🪙 {coins} Coins</span>
              <span>·</span>
              <span>🍪 {cookies} Cookies</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 mb-4 bg-amber-100 p-1 rounded-xl border-2 border-slate-900/10">
          <button
            onClick={() => setActiveTab('sweater')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'sweater' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👕 Sweaters</span>
          </button>
          <button
            onClick={() => setActiveTab('mitts')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'mitts' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🧤 Winter Mitts</span>
          </button>
          <button
            onClick={() => setActiveTab('hat')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'hat' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎅 Holiday Hats</span>
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'friends' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👥 Peanuts Friends</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              activeTab === 'stats' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⭐ EXP Stats</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {/* Sweaters Tab */}
          {activeTab === 'sweater' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COZY_SWEATERS.map((item) => {
                const isOwned = purchasedUpgrades.includes(item.id) || item.cost === 0;
                const isEquipped = equipped.sweater === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-100 border-slate-900 shadow-sm'
                        : isOwned
                        ? 'bg-white border-slate-900/40 hover:border-slate-900'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300">
                          Tier {item.tier}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      <div className="mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        {item.benefit}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {item.cost === 0 ? 'Starter' : `${item.cost} 🪙`}
                      </span>
                      {isEquipped ? (
                        <span className="px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip('sweater', item.id)}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Wear Sweater
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={coins < item.cost}
                          className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Buy Sweater
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mitts Tab */}
          {activeTab === 'mitts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WINTER_MITTS.map((item) => {
                const isOwned = purchasedUpgrades.includes(item.id) || item.cost === 0;
                const isEquipped = equipped.mitts === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-100 border-slate-900 shadow-sm'
                        : isOwned
                        ? 'bg-white border-slate-900/40 hover:border-slate-900'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300">
                          Tier {item.tier}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      <div className="mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        {item.benefit}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {item.cost === 0 ? 'Starter' : `${item.cost} 🪙`}
                      </span>
                      {isEquipped ? (
                        <span className="px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip('mitts', item.id)}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Wear Mitts
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={coins < item.cost}
                          className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Buy Mitts
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hats Tab */}
          {activeTab === 'hat' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HOLIDAY_HATS.map((item) => {
                const isOwned = purchasedUpgrades.includes(item.id) || item.cost === 0;
                const isEquipped = equipped.hat === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                      isEquipped
                        ? 'bg-amber-100 border-slate-900 shadow-sm'
                        : isOwned
                        ? 'bg-white border-slate-900/40 hover:border-slate-900'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300">
                          Tier {item.tier}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      <div className="mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        {item.benefit}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {item.cost === 0 ? 'Starter' : `${item.cost} 🪙`}
                      </span>
                      {isEquipped ? (
                        <span className="px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Equipped
                        </span>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip('hat', item.id)}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Wear Hat
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={coins < item.cost}
                          className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Buy Hat
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Peanuts Friends Tab */}
          {activeTab === 'friends' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHARACTERS.map((c) => {
                const isUnlocked = unlockedCharacters.includes(c.id);
                const isSelected = equipped.character === c.id;

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-100 border-slate-900 shadow-sm'
                        : isUnlocked
                        ? 'bg-white border-slate-900/40 hover:border-slate-900'
                        : 'bg-slate-100 border-slate-300 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow select-none">{c.emoji}</span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
                          <p className="text-[10px] text-amber-800 font-bold uppercase">{c.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">{c.desc}</p>
                      <div className="mt-2 text-[11px] font-black text-sky-800 bg-sky-50 p-2 rounded-lg border border-sky-200">
                        {c.perk}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                      {isSelected ? (
                        <span className="px-3 py-1 bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Playing Now
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.playCoin();
                            onSelectCharacter(c.id);
                          }}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border border-slate-900 shadow-xs"
                        >
                          Select Character
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Unlocked by Passing Levels!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EXP Stats Tab */}
          {activeTab === 'stats' && (
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Player Character Stats Level: {playerLevel}</h3>
                  <p className="text-xs text-slate-600">Upgrade using Cold Sugar Cookies collected from boards & zombies!</p>
                </div>
                <div className="px-4 py-2 bg-amber-400 rounded-xl border-2 border-slate-900 text-xs font-black">
                  EXP: {playerExp} / {playerLevel * 100}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                  <span className="text-2xl">❤️</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Max Health</h4>
                  <p className="text-lg font-black text-red-600">{100 + (playerLevel - 1) * 20} HP</p>
                </div>

                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-center">
                  <span className="text-2xl">❄️</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Snowball Damage</h4>
                  <p className="text-lg font-black text-sky-600">{15 + (playerLevel - 1) * 8} DMG</p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                  <span className="text-2xl">🔥</span>
                  <h4 className="text-xs font-black text-slate-900 mt-1">Warmth Defense</h4>
                  <p className="text-lg font-black text-amber-600">+{playerLevel * 5}% Resist</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const success = onLevelUpStats();
                  if (success) sound.playVictory();
                  else sound.playGameOver();
                }}
                disabled={cookies < 3}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>Level Up Stats (Costs 3 Cold Cookies 🍪)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
