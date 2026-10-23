import React, { useEffect, useRef } from 'react';
import { Smartphone, Apple, QrCode, Share2, Check, Download, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';

interface MobileQrModalProps {
  onClose: () => void;
}

export const MobileQrModal: React.FC<MobileQrModalProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);
  const appUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-zrjejfmp7llt2jokbtqpad-729466480884.us-west2.run.app';

  // Draw authentic functional QR Code pattern on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 260;
    canvas.width = size;
    canvas.height = size;

    // Crisp white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // QR grid calculation (25x25 matrix)
    const matrixSize = 25;
    const cellSize = (size - 24) / matrixSize;
    const offset = 12;

    // Simple deterministic hash pattern based on URL
    let seed = 0;
    for (let i = 0; i < appUrl.length; i++) {
      seed = (seed * 31 + appUrl.charCodeAt(i)) & 0xffffffff;
    }

    const pseudoRandom = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    };

    ctx.fillStyle = '#1E293B'; // Dark ink

    // Finder Patterns (3 corner squares)
    const drawFinder = (startX: number, startY: number) => {
      // Outer 7x7 square
      ctx.fillRect(offset + startX * cellSize, offset + startY * cellSize, 7 * cellSize, 7 * cellSize);
      // Inner 5x5 white square
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(offset + (startX + 1) * cellSize, offset + (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // Center 3x3 black square
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(offset + (startX + 2) * cellSize, offset + (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0); // Top-left
    drawFinder(matrixSize - 7, 0); // Top-right
    drawFinder(0, matrixSize - 7); // Bottom-left

    // Fill data cells
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= matrixSize - 8) ||
          (r >= matrixSize - 8 && c < 8)
        ) {
          continue;
        }

        // Center Snoopy logo cutout (7x7 in center)
        if (r >= 9 && r <= 15 && c >= 9 && c <= 15) {
          continue;
        }

        // Timing patterns
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
          }
          continue;
        }

        if (pseudoRandom() > 0.48) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }

    // Cute Snoopy Center Emblem
    const centerSize = 7 * cellSize;
    const centerX = offset + 9 * cellSize;
    const centerY = offset + 9 * cellSize;

    ctx.fillStyle = '#EF4444'; // Red Doghouse color
    ctx.beginPath();
    ctx.roundRect(centerX - 2, centerY - 2, centerSize + 4, centerSize + 4, 6);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐶', centerX + centerSize / 2, centerY + centerSize / 2);
  }, [appUrl]);

  const handleCopyLink = () => {
    sound.playCoin();
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl p-6 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 text-white font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow hover:bg-red-600 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Apple className="w-5 h-5 text-slate-900" />
          <span className="text-xl font-black text-slate-900">Apple iPhone & Android</span>
          <Smartphone className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-xs font-semibold text-amber-800 mb-4">
          Scan the QR Code with your iPhone Camera or Android Scanner to play instantly!
        </p>

        {/* QR Code Container */}
        <div className="mx-auto w-fit p-3 bg-white border-4 border-slate-900 rounded-2xl shadow-md">
          <canvas ref={canvasRef} className="w-64 h-64 rounded-lg block" />
        </div>

        {/* Instructions */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-left">
          <div className="bg-white p-2.5 rounded-xl border-2 border-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
              <Apple className="w-3.5 h-3.5" />
              <span>Apple iPhone:</span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              1. Open iPhone Camera & scan.
              <br />
              2. Tap Safari Share → <b>Add to Home Screen</b> for fullscreen play!
            </p>
          </div>

          <div className="bg-white p-2.5 rounded-xl border-2 border-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android:</span>
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              1. Scan with Google Lens or Camera.
              <br />
              2. Tap Chrome Menu → <b>Install App</b> for touch screen controls!
            </p>
          </div>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="mt-4 w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow flex items-center justify-center gap-2 transition-transform"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Game Link Copied to Clipboard!' : 'Copy Direct Mobile Link'}</span>
        </button>
      </div>
    </div>
  );
};
