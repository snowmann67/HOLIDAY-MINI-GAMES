import React, { useRef } from 'react';
import { Camera, Share2, Download, Twitter, Facebook, Copy, Check, Sparkles } from 'lucide-react';
import { CharacterType } from '../game/types';
import { sound } from '../game/audio';

interface PlayerSnapshotProps {
  onClose: () => void;
  character: CharacterType;
  score: number;
  level: number;
  coins: number;
  zombiesDefeated: number;
  equipped: { mitts: string; hat: string; sweater: string };
  playerName: string;
}

export const PlayerSnapshotModal: React.FC<PlayerSnapshotProps> = ({
  onClose,
  character,
  score,
  level,
  coins,
  zombiesDefeated,
  equipped,
  playerName,
}) => {
  const [copied, setCopied] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getCharacterEmoji = (char: CharacterType) => {
    switch (char) {
      case 'SNOOPY':
        return '🐶';
      case 'CHARLIE_BROWN':
        return '👦';
      case 'LINUS':
        return '🧣';
      case 'LUCY':
        return '🎀';
      case 'SCHROEDER':
        return '🎹';
      case 'WOODSTOCK':
        return '🐥';
      default:
        return '🐶';
    }
  };

  const shareText = `🎄 I just scored ${score} pts and saved Snoopy in Snoopy's Holiday Coin Adventure (Level ${level})! Smashed ${zombiesDefeated} Zombie Snowmen with my upgraded winter gear! Can you beat my score? #PeanutsHoliday #SnoopyGame #CharlieBrown`;

  const handleTwitterShare = () => {
    sound.playCoin();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    sound.playCoin();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleWhatsAppShare = () => {
    sound.playCoin();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleRedditShare = () => {
    sound.playCoin();
    const url = `https://reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    sound.playStar();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Snoopy's Holiday Coin Adventure Score",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    sound.playCoin();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSnapshotPNG = () => {
    sound.playStar();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Vintage Comic Polar Color
    ctx.fillStyle = '#FFFDF7';
    ctx.fillRect(0, 0, 800, 900);

    // Dark Ink Border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#1E293B';
    ctx.strokeRect(20, 20, 760, 860);

    // Night Movie Background Panel inside polaroid
    const grad = ctx.createLinearGradient(0, 50, 0, 550);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.7, '#1E293B');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(50, 50, 700, 500);

    // Gentle snowflakes
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      ctx.arc(60 + Math.random() * 680, 60 + Math.random() * 460, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snowy hill
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(50, 480);
    ctx.quadraticCurveTo(400, 430, 750, 480);
    ctx.lineTo(750, 550);
    ctx.lineTo(50, 550);
    ctx.closePath();
    ctx.fill();

    // Red Doghouse in background
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(520, 380, 160, 120);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(500, 380);
    ctx.lineTo(600, 310);
    ctx.lineTo(700, 380);
    ctx.closePath();
    ctx.fill();

    // Character Avatar
    ctx.font = '110px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(getCharacterEmoji(character), 260, 480);

    // Charlie Brown Zigzag Banner
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(50, 570, 700, 40);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 570, 700, 40);

    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    for (let x = 60; x < 740; x += 30) {
      ctx.lineTo(x + 15, 576);
      ctx.lineTo(x + 30, 604);
    }
    ctx.stroke();

    // Stats Text
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${playerName}'s Holiday Scorecard`, 400, 660);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`🏆 Score: ${score.toLocaleString()} pts · Board ${level}`, 400, 715);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`🪙 Coins: ${coins}  ·  🧟 Zombies Smashed: ${zombiesDefeated}`, 400, 765);

    ctx.font = 'italic 20px sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText(`Equipped: Cozy Sweaters · Winter Mitts · Holiday Hat`, 400, 815);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`SNOOPY'S HOLIDAY COIN ADVENTURE · PEANUTS OFFICIAL APP`, 400, 850);

    // Download file
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Snoopy_Scorecard_${playerName}_Level${level}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📸</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Player Score Snapshot</h2>
              <p className="text-xs font-semibold text-amber-800">Share your level points & winter upgrades with friends!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Polaroid Card Preview */}
        <div ref={cardRef} className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-md mb-4">
          {/* Cartoon Night Movie Scene Preview */}
          <div className="h-44 rounded-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-800 p-3 relative flex items-center justify-between border-2 border-slate-900 overflow-hidden">
            <div className="absolute top-2 left-3 flex items-center gap-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-900">
              <Sparkles className="w-3 h-3" />
              <span>OFFICIAL SCORECARD</span>
            </div>

            <div className="relative z-10">
              <div className="text-5xl filter drop-shadow select-none">{getCharacterEmoji(character)}</div>
              <p className="text-xs font-black text-white mt-1">{playerName}</p>
              <p className="text-[10px] text-amber-300 font-bold uppercase">{character.replace('_', ' ')}</p>
            </div>

            <div className="relative z-10 text-right">
              <span className="text-3xl font-black text-amber-400 tabular-nums">{score}</span>
              <p className="text-[11px] text-white font-black">Level {level} Board</p>
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-bold">
                <span>🧟 {zombiesDefeated} Smashed</span>
                <span>·</span>
                <span>🪙 {coins} Coins</span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <h4 className="text-sm font-black text-slate-900">Snoopy's Holiday Coin Adventure</h4>
            <p className="text-xs text-slate-600 italic">"Happiness is passing levels with Charlie Brown & friends!"</p>
          </div>
        </div>

        {/* Share Buttons to Social Media Platforms */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <button
            onClick={handleTwitterShare}
            className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            title="Share to Twitter / X"
          >
            <Twitter className="w-3.5 h-3.5 fill-white" />
            <span>Twitter / X</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            title="Share to Facebook"
          >
            <Facebook className="w-3.5 h-3.5 fill-white" />
            <span>Facebook</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            title="Share to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleRedditShare}
            className="py-2 px-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            title="Share to Reddit"
          >
            <span>🔴 Reddit</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadSnapshotPNG}
            className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Save Polaroid Image (PNG)</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center gap-1 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
