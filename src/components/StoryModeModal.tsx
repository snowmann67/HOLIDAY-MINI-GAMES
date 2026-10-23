import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Check, Lock, ChevronRight } from 'lucide-react';
import { CharacterType } from '../game/types';
import { sound } from '../game/audio';

interface StoryModeProps {
  onClose: () => void;
  unlockedLevels: number[];
  onPlayLevel: (levelId: number) => void;
}

export const STORY_CHAPTERS = [
  {
    id: 1,
    levelId: 1,
    title: 'Chapter 1: The Dark and Snowy Christmas Eve',
    subtitle: "Snoopy's Snowy Backyard",
    speaker: 'Charlie Brown',
    speakerEmoji: '👦',
    dialogue:
      "Good grief! A freak blizzard blew through the neighborhood and turned the backyard snowmen into Zombie Snowmen! Snoopy is asleep on his red doghouse and doesn't realize he's surrounded! Grab some snowballs and help me clear the yard!",
    reward: 'Unlocks Linus & Bobble Beanie Hat',
    unlockedHero: 'LINUS' as CharacterType,
  },
  {
    id: 2,
    levelId: 2,
    title: 'Chapter 2: The Frozen Skating Pond Mystery',
    subtitle: 'The Frozen Skating Pond',
    speaker: 'Linus Van Pelt',
    speakerEmoji: '🧣',
    dialogue:
      "I told Charlie Brown that in the middle of winter, peace can be fragile. Frost Ghouls are gliding across the frozen pond! Schroeder is trying to play Christmas carols on his toy piano, but the cold is freezing his fingers. Let's skate across and light the shore campfires!",
    reward: 'Unlocks Lucy & Thermal Nordic Ice Mitts',
    unlockedHero: 'LUCY' as CharacterType,
  },
  {
    id: 3,
    levelId: 3,
    title: 'Chapter 3: Night Over the Neighborhood Fences',
    subtitle: 'Neighborhood Pine Fences',
    speaker: 'Lucy Van Pelt',
    speakerEmoji: '🎀',
    dialogue:
      "That'll be five cents, Charlie Brown! The Zombie Snowmen are leaping over everyone's fences and trying to pull down the holiday lights! Snoopy has put on his Flying Ace aviator scarf. We have to defend the rooftops and collect Cold Sugar Cookies!",
    reward: 'Unlocks Schroeder & Toy Piano Shockwaves',
    unlockedHero: 'SCHROEDER' as CharacterType,
  },
  {
    id: 4,
    levelId: 4,
    title: 'Chapter 4: The True Meaning of Christmas',
    subtitle: "Charlie Brown's Tree Lot",
    speaker: 'Charlie Brown',
    speakerEmoji: '👦',
    dialogue:
      "Look at all these cold, shiny aluminum trees... But over there, hidden beneath the snowbanks, is one tiny, real pine tree. It just needs a little love. Defeat the frost bats and bring the tree to Snoopy's doghouse!",
    reward: 'Unlocks Woodstock & Golden Scarf',
    unlockedHero: 'WOODSTOCK' as CharacterType,
  },
  {
    id: 5,
    levelId: 5,
    title: 'Chapter 5: The Grand Holiday Pageant & Rescue!',
    subtitle: 'Blizzard Peak: Save Snoopy!',
    speaker: 'Snoopy & The Peanuts Gang',
    speakerEmoji: '🐶🎄',
    dialogue:
      "*(Snoopy types furiously on his red typewriter)* 'It was the crowning moment of the holiday season!' The giant Boss Zombie Snowman has occupied Blizzard Peak! With all the gang united in their upgraded holiday sweaters, mitts, and hats, we'll save the Christmas Pageant and win First Prize!",
    reward: 'First Prize Lighted Crown & Grand Pageant Gold Gear',
    unlockedHero: 'SNOOPY' as CharacterType,
  },
];

export const StoryModeModal: React.FC<StoryModeProps> = ({
  onClose,
  unlockedLevels,
  onPlayLevel,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const chapter = STORY_CHAPTERS[selectedChapter];
  const isUnlocked = unlockedLevels.includes(chapter.levelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖🎄</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Story Mode: Save Snoopy with Charlie & Friends!
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                Episodic Peanuts Holiday Adventure · Pass boards to unlock real Peanuts friends!
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

        {/* Chapter Selection Strip */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {STORY_CHAPTERS.map((ch, idx) => {
            const unlocked = unlockedLevels.includes(ch.levelId);
            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playCoin();
                  setSelectedChapter(idx);
                }}
                className={`px-3 py-2 rounded-xl border-2 text-left shrink-0 transition-all ${
                  selectedChapter === idx
                    ? 'bg-amber-400 border-slate-900 shadow-sm scale-102'
                    : unlocked
                    ? 'bg-white border-slate-900/40 hover:border-slate-900'
                    : 'bg-slate-200 border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-700">
                  {unlocked ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3" />}
                  <span>Chapter {ch.id}</span>
                </div>
                <span className="text-xs font-black text-slate-900 truncate block max-w-[120px]">
                  {ch.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Comic Panel */}
        <div className="bg-white border-4 border-slate-900 rounded-2xl p-5 shadow-md flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-900 border border-slate-900">
                Board {chapter.levelId} · {chapter.subtitle}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {isUnlocked ? 'Unlocked' : 'Locked (Complete Previous Board)'}
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">{chapter.title}</h3>

            {/* Comic Dialogue Box */}
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border-2 border-slate-900 relative">
              {/* Comic bubble pointer */}
              <div className="absolute -top-3 left-8 w-4 h-4 bg-amber-50 border-t-2 border-l-2 border-slate-900 rotate-45" />

              <div className="flex items-start gap-3">
                <span className="text-4xl filter drop-shadow select-none shrink-0">
                  {chapter.speakerEmoji}
                </span>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    {chapter.speaker}:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium mt-1">
                    "{chapter.dialogue}"
                  </p>
                </div>
              </div>
            </div>

            {/* Reward Box */}
            <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-black text-emerald-900">Chapter Reward:</span>
              </div>
              <span className="text-xs font-black text-emerald-700">{chapter.reward}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                sound.playJump();
                onPlayLevel(chapter.levelId);
                onClose();
              }}
              disabled={!isUnlocked}
              className={`px-8 py-3 rounded-2xl border-4 border-slate-900 font-black text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95 ${
                isUnlocked
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isUnlocked ? `PLAY CHAPTER ${chapter.id} NOW!` : 'CHAPTER LOCKED'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
