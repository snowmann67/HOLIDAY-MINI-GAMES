import React, { useState } from 'react';
import { Trophy, Users, QrCode, Sparkles, Share2, Check, ExternalLink } from 'lucide-react';
import { LeaderboardEntry, FriendOnline, CharacterType } from '../game/types';
import { sound } from '../game/audio';

interface FriendsLeaderboardProps {
  onClose: () => void;
  playerScore: number;
  playerLevel: number;
  zombiesDefeated: number;
  playerName: string;
  character: CharacterType;
}

export const FriendsLeaderboardModal: React.FC<FriendsLeaderboardProps> = ({
  onClose,
  playerScore,
  playerLevel,
  zombiesDefeated,
  playerName,
  character,
}) => {
  const [tab, setTab] = useState<'leaderboard' | 'friends' | 'invite'>('leaderboard');
  const [copied, setCopied] = useState(false);

  const LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'Snoopy_FlyingAce', score: 9450, level: 5, zombiesSmashed: 28, character: 'SNOOPY', badge: '1st Prize' },
    { rank: 2, name: 'Schroeder_Pianist', score: 8120, level: 4, zombiesSmashed: 22, character: 'SCHROEDER', badge: 'Beethoven' },
    { rank: 3, name: playerName || 'Player_1', score: Math.max(playerScore, 4500), level: playerLevel, zombiesSmashed: zombiesDefeated, character, badge: 'You', isPlayer: true },
    { rank: 4, name: 'Lucy_5Cents', score: 4200, level: 3, zombiesSmashed: 15, character: 'LUCY', badge: 'The Doctor' },
    { rank: 5, name: 'Linus_Security', score: 3850, level: 3, zombiesSmashed: 12, character: 'LINUS', badge: 'Blue Blanket' },
    { rank: 6, name: 'Charlie_Brown_Official', score: 3100, level: 2, zombiesSmashed: 9, character: 'CHARLIE_BROWN', badge: 'Good Grief' },
    { rank: 7, name: 'Woodstock_Chirp', score: 2600, level: 2, zombiesSmashed: 6, character: 'WOODSTOCK', badge: 'Warm Scarf' },
  ];

  const ONLINE_FRIENDS: FriendOnline[] = [
    { id: 'f1', name: 'Linus_Blanket', avatar: '🧣', status: 'playing', currentLevel: 'Level 3: Pine Fences', score: 3850, character: 'LINUS' },
    { id: 'f2', name: 'LucyVanPelt', avatar: '🎀', status: 'playing', currentLevel: 'Level 2: Skating Pond', score: 4200, character: 'LUCY' },
    { id: 'f3', name: 'Schroeder_Piano', avatar: '🎹', status: 'idle', currentLevel: 'Level 4: Tree Lot', score: 8120, character: 'SCHROEDER' },
    { id: 'f4', name: 'Sally_Brown', avatar: '💛', status: 'cleared', currentLevel: 'Level 1: Backyard', score: 1950, character: 'CHARLIE_BROWN' },
    { id: 'f5', name: 'Peppermint_Patty', avatar: '🧢', status: 'playing', currentLevel: 'Level 5: Blizzard Peak', score: 7200, character: 'SNOOPY' },
  ];

  const handleCopyInvite = () => {
    sound.playCoin();
    navigator.clipboard.writeText(
      `Join my Snoopy Holiday Coin Adventure session! Use Room Code: PEANUTS-${Math.floor(1000 + Math.random() * 9000)} at ${window.location.href}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Holiday Leaderboard & Friends</h2>
              <p className="text-xs font-semibold text-amber-800">
                Pass Leaderboards · See Friends Online · Multiplayer Invite QR Code
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

        {/* Tab Switcher */}
        <div className="flex gap-1.5 mb-4 bg-amber-100 p-1 rounded-xl border-2 border-slate-900/10">
          <button
            onClick={() => setTab('leaderboard')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              tab === 'leaderboard' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Top Scores</span>
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              tab === 'friends' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends Online</span>
          </button>
          <button
            onClick={() => setTab('invite')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${
              tab === 'invite' ? 'bg-amber-400 text-slate-900 shadow-sm border border-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Invite QR Code</span>
          </button>
        </div>

        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {LEADERBOARD.map((entry) => (
              <div
                key={entry.rank}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  entry.isPlayer
                    ? 'bg-amber-100 border-slate-900 shadow-sm font-black'
                    : 'bg-white border-slate-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border ${
                      entry.rank === 1
                        ? 'bg-yellow-400 border-slate-900 text-slate-950'
                        : entry.rank === 2
                        ? 'bg-slate-200 border-slate-400 text-slate-800'
                        : entry.rank === 3
                        ? 'bg-amber-600 border-slate-900 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}
                  >
                    #{entry.rank}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900">{entry.name}</h4>
                      {entry.isPlayer && (
                        <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Level {entry.level} Board · 🧟 {entry.zombiesSmashed} Smashed
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-600 tabular-nums">
                    {entry.score.toLocaleString()} pts
                  </span>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">{entry.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Friends Online Tab */}
        {tab === 'friends' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {ONLINE_FRIENDS.map((f) => (
              <div
                key={f.id}
                className="bg-white border-2 border-slate-900 rounded-2xl p-3 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{f.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900">{f.name}</h4>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {f.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">Now in: {f.currentLevel}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">{f.score} pts</span>
                  <button
                    onClick={() => {
                      sound.playCoin();
                      alert(`Sent a holiday cheer & dog biscuit treat to ${f.name}!`);
                    }}
                    className="block mt-1 text-[10px] font-black text-amber-700 hover:text-amber-900 underline"
                  >
                    Send 🪙 Treat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite QR Code Tab */}
        {tab === 'invite' && (
          <div className="text-center p-3">
            <h4 className="text-sm font-black text-slate-900 mb-1">Invite Friends via QR Code</h4>
            <p className="text-xs text-slate-600 mb-4">
              Scan with your iPhone or Android phone to jump right onto the holiday boards!
            </p>

            <div className="mx-auto w-44 h-44 bg-white border-4 border-slate-900 rounded-2xl p-2 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">📱🐶✨</div>
                <span className="text-[11px] font-black text-slate-900">ROOM: SNOOPY-HOLIDAY</span>
              </div>
            </div>

            <button
              onClick={handleCopyInvite}
              className="mt-4 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow-md flex items-center justify-center gap-2 mx-auto transition-transform active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Invite Link Copied!' : 'Copy Multi-Player Invite Link'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
