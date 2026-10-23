import React, { useRef, useEffect, useState } from 'react';
import { Gauge, Zap, Trophy, Play, RotateCcw, Volume2, ArrowLeft } from 'lucide-react';
import { sound } from '../game/audio';
import { CharacterType } from '../game/types';

interface SnowAtvRacingProps {
  onClose: () => void;
  character: CharacterType;
  onCoinsEarned: (coins: number) => void;
}

export const SnowAtvRacing: React.FC<SnowAtvRacingProps> = ({
  onClose,
  character,
  onCoinsEarned,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'READY' | 'RACING' | 'FINISHED'>('READY');
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [lapTime, setLapTime] = useState(0);
  const [rank, setRank] = useState(1);
  const [coinsCollected, setCoinsCollected] = useState(0);

  // Racing Game state refs for 60fps loop
  const raceRef = useRef({
    playerX: 0, // -1 to 1 across road
    playerSpeed: 0,
    maxSpeed: 85,
    distance: 0,
    totalTrack: 15000,
    nitro: 100,
    coinsCollected: 0,
    opponents: [
      { name: 'Charlie Brown', x: -0.4, dist: 200, speed: 68, color: '#FBBF24', char: '👦' },
      { name: 'Linus', x: 0.3, dist: 400, speed: 64, color: '#38BDF8', char: '🧣' },
      { name: 'Lucy', x: 0.5, dist: 100, speed: 72, color: '#EC4899', char: '🎀' },
    ],
    obstacles: [] as Array<{ x: number; dist: number; type: 'tree' | 'snowman' | 'ice' }>,
    trackCoins: [] as Array<{ x: number; dist: number; collected: boolean }>,
    keys: { left: false, right: false, up: false, down: false, boost: false },
    lastTime: performance.now(),
    animationFrameId: 0,
  });

  // Initialize track obstacles and coins
  useEffect(() => {
    const r = raceRef.current;
    r.obstacles = [];
    r.trackCoins = [];
    for (let d = 500; d < r.totalTrack - 1000; d += 280) {
      const x = (Math.random() - 0.5) * 1.6;
      const type = Math.random() > 0.5 ? 'snowman' : 'tree';
      r.obstacles.push({ x, dist: d, type });
    }
    for (let d = 300; d < r.totalTrack - 500; d += 140) {
      const x = (Math.random() - 0.5) * 1.4;
      r.trackCoins.push({ x, dist: d, collected: false });
    }
  }, []);

  // Controls handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = raceRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = true;
      if (e.key === ' ' || e.key === 'Shift') k.boost = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = raceRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = false;
      if (e.key === ' ' || e.key === 'Shift') k.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60fps Game Loop
  useEffect(() => {
    if (gameState !== 'RACING') return;

    let startTime = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (now: number) => {
      const r = raceRef.current;
      const dt = Math.min((now - r.lastTime) / 1000, 0.1);
      r.lastTime = now;

      // Timer
      setLapTime((now - startTime) / 1000);

      // Player Steering & Acceleration
      let targetSpeed = 0;
      if (r.keys.up) targetSpeed = r.maxSpeed;
      if (r.keys.down) targetSpeed = 20;
      if (!r.keys.up && !r.keys.down) targetSpeed = 35; // gentle idle coast

      // Nitro boost
      if (r.keys.boost && r.nitro > 0 && r.keys.up) {
        targetSpeed = 125;
        r.nitro = Math.max(0, r.nitro - dt * 25);
        if (Math.random() > 0.7) sound.playDash();
      } else {
        r.nitro = Math.min(100, r.nitro + dt * 10);
      }
      setNitro(Math.round(r.nitro));

      r.playerSpeed += (targetSpeed - r.playerSpeed) * dt * 2.5;
      setSpeed(Math.round(r.playerSpeed));

      // Turning
      if (r.keys.left) r.playerX = Math.max(-0.95, r.playerX - dt * 1.5 * (r.playerSpeed / 50));
      if (r.keys.right) r.playerX = Math.min(0.95, r.playerX + dt * 1.5 * (r.playerSpeed / 50));

      // Advance track distance
      r.distance += r.playerSpeed * dt * 12;
      setDistance(Math.round(r.distance));

      // Opponents AI
      let playerRank = 1;
      r.opponents.forEach((opp) => {
        opp.dist += opp.speed * dt * 12;
        if (opp.dist > r.distance) playerRank++;
      });
      setRank(playerRank);

      // Check coin pickups
      r.trackCoins.forEach((c) => {
        if (!c.collected && Math.abs(c.dist - r.distance) < 80 && Math.abs(c.x - r.playerX) < 0.25) {
          c.collected = true;
          r.coinsCollected += 2;
          setCoinsCollected(r.coinsCollected);
          sound.playCoin();
        }
      });

      // Check obstacle collisions
      r.obstacles.forEach((o) => {
        if (Math.abs(o.dist - r.distance) < 60 && Math.abs(o.x - r.playerX) < 0.2) {
          r.playerSpeed = Math.max(10, r.playerSpeed * 0.4);
          sound.playGameOver();
          o.dist = -9999; // cleared
        }
      });

      // Finish Line Check
      if (r.distance >= r.totalTrack) {
        setGameState('FINISHED');
        sound.playVictory();
        onCoinsEarned(r.coinsCollected + 50);
        return;
      }

      // RENDER
      renderRace(ctx, canvas.width, canvas.height, r);

      r.animationFrameId = requestAnimationFrame(loop);
    };

    raceRef.current.lastTime = performance.now();
    raceRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raceRef.current.animationFrameId);
    };
  }, [gameState]);

  // Render 3D Perspective Snow Trail & ATVs
  const renderRace = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    r: typeof raceRef.current
  ) => {
    // 1. Sky & Snowy Night with Glowing Moon & Stars
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    skyGrad.addColorStop(0, '#040714'); // Midnight Peanuts blue-black
    skyGrad.addColorStop(0.65, '#0B152B'); // Deep twilight indigo
    skyGrad.addColorStop(1, '#1E294B');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.5);

    // Glowing Holiday Moon & Halo
    const atvMoonX = width - 110;
    const atvMoonY = 48;
    const atvMoonR = 26;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
    ctx.beginPath();
    ctx.arc(atvMoonX, atvMoonY, atvMoonR * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(atvMoonX, atvMoonY, atvMoonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Twinkling Cartoon Stars
    for (let i = 0; i < 48; i++) {
      const sx = (i * 47) % width;
      const sy = (i * 29) % (height * 0.38);
      const twinkle = Math.sin(performance.now() * 0.003 + i) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(254, 240, 138, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(sx, sy, i % 4 === 0 ? 2 : 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Snowy Mountains
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width * 0.2, height * 0.25);
    ctx.lineTo(width * 0.45, height * 0.45);
    ctx.lineTo(width * 0.7, height * 0.22);
    ctx.lineTo(width, height * 0.5);
    ctx.closePath();
    ctx.fill();

    // 2. Snow Trail Ground (Perspective)
    const horizonY = height * 0.45;
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    groundGrad.addColorStop(0, '#CBD5E1');
    groundGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // Track Borders with Christmas Lights!
    const trackWidthBottom = width * 0.85;
    const trackWidthTop = width * 0.12;
    const cx = width / 2;

    ctx.fillStyle = '#E2E8F0'; // Main snowy road
    ctx.beginPath();
    ctx.moveTo(cx - trackWidthTop / 2, horizonY);
    ctx.lineTo(cx + trackWidthTop / 2, horizonY);
    ctx.lineTo(cx + trackWidthBottom / 2, height);
    ctx.lineTo(cx - trackWidthBottom / 2, height);
    ctx.closePath();
    ctx.fill();

    // Tire Sled Tracks in snow
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, height);
    ctx.lineTo(cx - 5, horizonY);
    ctx.moveTo(cx + 30, height);
    ctx.lineTo(cx + 5, horizonY);
    ctx.stroke();

    // Render Track Coins in perspective
    r.trackCoins.forEach((c) => {
      if (c.collected) return;
      const relDist = c.dist - r.distance;
      if (relDist > 0 && relDist < 1800) {
        const p = 1 - relDist / 1800;
        const py = horizonY + (height - horizonY) * p;
        const curW = trackWidthTop + (trackWidthBottom - trackWidthTop) * p;
        const px = cx + (c.x * curW) / 2;
        const size = Math.max(4, 18 * p);

        ctx.fillStyle = '#FBBF24';
        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // Render Opponents in perspective
    r.opponents.forEach((opp) => {
      const relDist = opp.dist - r.distance;
      if (relDist > -300 && relDist < 1800) {
        const p = 1 - relDist / 1800;
        const py = horizonY + (height - horizonY) * p;
        const curW = trackWidthTop + (trackWidthBottom - trackWidthTop) * p;
        const px = cx + (opp.x * curW) / 2;
        const size = Math.max(12, 50 * p);

        // Snow ATV Sled
        ctx.fillStyle = opp.color;
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 2;
        ctx.fillRect(px - size / 2, py - size * 0.4, size, size * 0.5);
        ctx.strokeRect(px - size / 2, py - size * 0.4, size, size * 0.5);

        // Character Emoji Head
        ctx.font = `${Math.round(size * 0.6)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(opp.char, px, py - size * 0.3);
      }
    });

    // 3. Player Snow ATV in Foreground!
    const playerScreenX = cx + (r.playerX * trackWidthBottom) / 2;
    const playerScreenY = height - 90;

    ctx.save();
    ctx.translate(playerScreenX, playerScreenY);

    // Snow spray behind ATV
    if (r.playerSpeed > 20) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let s = 0; s < 5; s++) {
        ctx.beginPath();
        ctx.arc(-25 + Math.random() * 50, 45 + Math.random() * 20, 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Snow ATV Body (Red Holiday Machine with Skis)
    ctx.fillStyle = '#DC2626';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 4;

    // Dual front snow skis
    ctx.fillStyle = '#334155';
    ctx.fillRect(-45, 30, 20, 10);
    ctx.fillRect(25, 30, 20, 10);

    // ATV Chassis
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(-40, 0, 80, 40, 8);
    ctx.fill();
    ctx.stroke();

    // Windshield & Headlights
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(-25, -12, 50, 14);
    ctx.strokeRect(-25, -12, 50, 14);

    // Glowing yellow headlights
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(-22, 18, 6, 0, Math.PI * 2);
    ctx.arc(22, 18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Driver: Snoopy or Selected Character!
    const charEmoji =
      character === 'SNOOPY'
        ? '🐶'
        : character === 'CHARLIE_BROWN'
        ? '👦'
        : character === 'LINUS'
        ? '🧣'
        : '🎀';

    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(charEmoji, 0, -14);

    // Woodstock riding on handlebars!
    ctx.font = '24px sans-serif';
    ctx.fillText('🐥', 28, -6);

    ctx.restore();
  };

  const handleStartRace = () => {
    sound.playJump();
    setGameState('RACING');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-amber-50 border-4 border-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header HUD */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-black tracking-tight flex items-center gap-2">
                <span>🛷</span> Snoopy & Friends Snow ATV Winter Racing
              </h2>
              <p className="text-[10px] text-amber-400 font-bold">Google Mini-Game Board · Charlie Brown Holiday Rally</p>
            </div>
          </div>

          {/* Real-time Dash HUD */}
          <div className="flex items-center gap-4 text-xs font-black">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rank: #{rank} / 4</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span className="tabular-nums">{speed} MPH</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="tabular-nums">Nitro: {nitro}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl border border-slate-900">
              <span>🪙 {coinsCollected}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas Area */}
        <div className="relative w-full aspect-[16/9] bg-slate-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-contain"
          />

          {/* Ready Overlay */}
          {gameState === 'READY' && (
            <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-2">🛷🐶🏁</div>
              <h3 className="text-2xl font-black text-amber-400">Snow ATV Holiday Grand Prix!</h3>
              <p className="text-xs text-white max-w-md font-medium mt-1 mb-4">
                Race Snoopy's motorized Snowmobile against Charlie Brown, Linus & Lucy!
                Steer with <span className="font-bold text-amber-300">Arrow Keys / WASD</span> and hit{' '}
                <span className="font-bold text-amber-300">Spacebar or Shift</span> for Nitro Boost!
              </p>
              <button
                onClick={handleStartRace}
                className="px-8 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm rounded-2xl border-4 border-slate-900 shadow-xl flex items-center gap-2 transition-all"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>START SNOW RACE!</span>
              </button>
            </div>
          )}

          {/* Finished Overlay */}
          {gameState === 'FINISHED' && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-2">🏆🏁✨</div>
              <h3 className="text-3xl font-black text-amber-400">
                {rank === 1 ? '1ST PLACE VICTORY!' : `FINISHED IN #${rank} PLACE!`}
              </h3>
              <p className="text-sm font-bold text-white mt-1">
                Time: {lapTime.toFixed(1)}s · Bonus Coins Earned: +{coinsCollected + 50} 🪙
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleStartRace}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl border-2 border-slate-900 shadow flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Race Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow transition-all"
                >
                  Back to Board
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile / Touch Sled Controls */}
        <div className="bg-amber-100 p-3 border-t-2 border-slate-900 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onMouseDown={() => (raceRef.current.keys.left = true)}
              onMouseUp={() => (raceRef.current.keys.left = false)}
              onTouchStart={() => (raceRef.current.keys.left = true)}
              onTouchEnd={() => (raceRef.current.keys.left = false)}
              className="w-12 h-10 bg-white border-2 border-slate-900 rounded-xl font-black text-sm flex items-center justify-center active:bg-amber-300"
            >
              ◀
            </button>
            <button
              onMouseDown={() => (raceRef.current.keys.right = true)}
              onMouseUp={() => (raceRef.current.keys.right = false)}
              onTouchStart={() => (raceRef.current.keys.right = true)}
              onTouchEnd={() => (raceRef.current.keys.right = false)}
              className="w-12 h-10 bg-white border-2 border-slate-900 rounded-xl font-black text-sm flex items-center justify-center active:bg-amber-300"
            >
              ▶
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onMouseDown={() => (raceRef.current.keys.boost = true)}
              onMouseUp={() => (raceRef.current.keys.boost = false)}
              onTouchStart={() => (raceRef.current.keys.boost = true)}
              onTouchEnd={() => (raceRef.current.keys.boost = false)}
              className="px-4 h-10 bg-yellow-400 border-2 border-slate-900 rounded-xl font-black text-xs flex items-center gap-1 active:bg-yellow-300 shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>NITRO</span>
            </button>
            <button
              onMouseDown={() => (raceRef.current.keys.up = true)}
              onMouseUp={() => (raceRef.current.keys.up = false)}
              onTouchStart={() => (raceRef.current.keys.up = true)}
              onTouchEnd={() => (raceRef.current.keys.up = false)}
              className="px-5 h-10 bg-emerald-500 text-white border-2 border-slate-900 rounded-xl font-black text-xs flex items-center gap-1 active:bg-emerald-600 shadow"
            >
              GAS (ACCEL)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
