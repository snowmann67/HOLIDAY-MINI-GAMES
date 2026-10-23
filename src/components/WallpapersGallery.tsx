import React, { useRef } from 'react';
import { Download, Monitor, Smartphone, Sparkles, Image } from 'lucide-react';
import { sound } from '../game/audio';

interface WallpapersGalleryProps {
  onClose: () => void;
}

export const WallpapersGallery: React.FC<WallpapersGalleryProps> = ({ onClose }) => {
  const downloadCanvasImage = (title: string, format: 'desktop' | 'mobile', theme: string) => {
    sound.playStar();
    const canvas = document.createElement('canvas');
    const width = format === 'desktop' ? 1920 : 1080;
    const height = format === 'desktop' ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Sky Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (theme === 'night') {
      gradient.addColorStop(0, '#0F172A');
      gradient.addColorStop(0.6, '#1E293B');
      gradient.addColorStop(1, '#334155');
    } else if (theme === 'sunset') {
      gradient.addColorStop(0, '#1E1B4B');
      gradient.addColorStop(0.4, '#7C2D12');
      gradient.addColorStop(0.7, '#EA580C');
      gradient.addColorStop(1, '#FDE047');
    } else {
      gradient.addColorStop(0, '#1E293B');
      gradient.addColorStop(0.5, '#3B82F6');
      gradient.addColorStop(1, '#BAE6FD');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Stars / Snowflakes in sky
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 180; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * (height * 0.75);
      const r = 1 + Math.random() * 3.5;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snowy hills in foreground
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.quadraticCurveTo(width * 0.35, height * 0.65, width * 0.6, height * 0.75);
    ctx.quadraticCurveTo(width * 0.85, height * 0.82, width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Snoopy's Iconic Red Doghouse
    const dhX = width * 0.45;
    const dhY = height * 0.62;
    const dhW = format === 'desktop' ? 260 : 340;
    const dhH = dhW * 0.9;

    ctx.fillStyle = '#DC2626';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 6;
    ctx.fillRect(dhX, dhY + 50, dhW, dhH - 50);
    ctx.strokeRect(dhX, dhY + 50, dhW, dhH - 50);

    // Roof
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(dhX - 20, dhY + 50);
    ctx.lineTo(dhX + dhW / 2, dhY);
    ctx.lineTo(dhX + dhW + 20, dhY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Snow pile on roof
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(dhX - 25, dhY + 50);
    ctx.lineTo(dhX + dhW / 2, dhY - 10);
    ctx.lineTo(dhX + dhW + 25, dhY + 50);
    ctx.quadraticCurveTo(dhX + dhW / 2, dhY + 20, dhX - 25, dhY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sleeping / Dreaming Snoopy on roof!
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(dhX + dhW / 2, dhY - 6, dhW * 0.28, dhH * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snoopy's Floppy Ear & Black Nose
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.ellipse(dhX + dhW / 2 - 20, dhY - 2, 14, 25, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(dhX + dhW / 2 + 45, dhY - 12, 10, 0, Math.PI * 2);
    ctx.fill();

    // Multi-color Glowing Christmas Lights on Doghouse!
    const colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#FBBF24'];
    for (let c = 0; c < 12; c++) {
      const bx = dhX + (c / 11) * dhW;
      const by = dhY + 55 + Math.sin((c / 11) * Math.PI) * 20;
      ctx.fillStyle = colors[c % colors.length];
      ctx.beginPath();
      ctx.arc(bx, by, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Little Charlie Brown Christmas Tree beside doghouse
    const treeX = dhX - dhW * 0.45;
    const treeY = dhY + 80;
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(treeX, treeY + 100);
    ctx.lineTo(treeX + 5, treeY + 40);
    ctx.quadraticCurveTo(treeX + 20, treeY + 15, treeX + 45, treeY + 30);
    ctx.stroke();

    // Single red ornament bulb
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(treeX + 45, treeY + 45, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Title Typography
    ctx.fillStyle = '#FBBF24';
    ctx.font = `bold ${format === 'desktop' ? 56 : 64}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('A CHARLIE BROWN HOLIDAY', width / 2, height * 0.18);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `italic ${format === 'desktop' ? 28 : 34}px sans-serif`;
    ctx.fillText('Happiness is Christmas Time with Snoopy & Friends', width / 2, height * 0.23);

    // Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Snoopy_Holiday_Wallpaper_${title.replace(/\s+/g, '_')}_${format}.png`;
    link.href = dataUrl;
    link.click();
  };

  const WALLPAPERS = [
    {
      id: 'wp_doghouse_lights',
      title: "Snoopy's 1st Prize Christmas Lights Doghouse",
      desc: "Snoopy dreaming peacefully atop his brilliantly decorated red doghouse under starry winter skies.",
      theme: 'night',
      previewGradient: 'from-slate-900 via-blue-950 to-slate-800',
      badge: 'Most Popular',
    },
    {
      id: 'wp_charlie_tree',
      title: "Charlie Brown's Little Tree with One Red Ball",
      desc: "The nostalgic little Christmas tree wrapped in Linus' blue blanket beside the snowy pine forest.",
      theme: 'sunset',
      previewGradient: 'from-indigo-950 via-orange-950 to-amber-900',
      badge: 'Holiday Classic',
    },
    {
      id: 'wp_flying_ace',
      title: 'Flying Ace Holiday Snowstorm Flight',
      desc: 'Snoopy flying his red doghouse through a gentle flurry of golden holiday coins and snowflakes.',
      theme: 'day',
      previewGradient: 'from-sky-900 via-blue-800 to-indigo-900',
      badge: 'High Action',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🖼️</span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Downloadable Snoopy & Charlie Brown Holiday Wallpapers
              </h2>
              <p className="text-xs font-semibold text-amber-800">
                High-Resolution 4K Desktop & Mobile Phone Wallpapers · Instant Download!
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

        {/* Wallpaper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {WALLPAPERS.map((wp) => (
            <div
              key={wp.id}
              className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Visual Card Preview */}
              <div className={`h-40 bg-gradient-to-br ${wp.previewGradient} p-4 relative flex flex-col justify-between`}>
                <span className="self-start text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-900 border border-slate-900">
                  {wp.badge}
                </span>

                <div className="text-center">
                  <div className="text-4xl filter drop-shadow select-none">🐶🎄</div>
                  <span className="text-xs font-black text-amber-200 tracking-tight drop-shadow">
                    Peanuts 4K Ultra HD
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/80 font-bold">
                  <span>1920x1080 · 4K</span>
                  <span>1080x1920 · Phone</span>
                </div>
              </div>

              {/* Info & Download Actions */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 mb-1">{wp.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{wp.desc}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadCanvasImage(wp.title, 'desktop', wp.theme)}
                    className="flex-1 py-1.5 px-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-[10px] font-black rounded-xl border border-slate-900 shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Desktop 4K</span>
                  </button>

                  <button
                    onClick={() => downloadCanvasImage(wp.title, 'mobile', wp.theme)}
                    className="flex-1 py-1.5 px-2 bg-sky-400 hover:bg-sky-300 text-slate-900 text-[10px] font-black rounded-xl border border-slate-900 shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Phone 9:16</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
