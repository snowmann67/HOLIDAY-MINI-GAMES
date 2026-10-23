import React, { useRef, useEffect, useState } from 'react';
import {
  CharacterType,
  LevelConfig,
  PlayerStats,
  Projectile,
  Particle,
  Enemy,
  ColdCookie,
} from './types';
import {
  drawSnoopy,
  drawCharlieBrown,
  drawLinus,
  drawWoodstock,
  drawDoghouse,
  drawPiano,
  drawBooth,
  drawCharlieTree,
  drawCoin,
  drawZombieSnowman,
  drawBlizzardGhoul,
  drawFrostBat,
  drawProjectile,
  drawColdCookie,
  drawCampfire,
  drawLucy,
  drawSchroeder,
  drawWoodstockFlock,
  drawPeanutsSpeechBubble,
} from './sprites';
import { sound } from './audio';
import { getUpgradeById } from './upgrades';
import { Zap, Heart, Flame, Shield, ArrowUpCircle } from 'lucide-react';

interface GameCanvasProps {
  level: LevelConfig;
  character: CharacterType;
  equipped: { mitts: string; hat: string; sweater: string };
  playerLevel: number;
  nightTheme: boolean;
  onLevelComplete: (score: number, coins: number, cookies: number, zombies: number) => void;
  onGameOver: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  character,
  equipped,
  playerLevel,
  nightTheme,
  onLevelComplete,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HUD stats for React state
  const [hudCoins, setHudCoins] = useState(0);
  const [hudHp, setHudHp] = useState(100);
  const [hudWarmth, setHudWarmth] = useState(100);
  const [hudZombies, setHudZombies] = useState(0);

  // Active game physics loop refs
  const gameRef = useRef({
    player: {
      x: level.spawnX,
      y: level.spawnY,
      vx: 0,
      vy: 0,
      width: 44,
      height: 48,
      hp: 100 + (playerLevel - 1) * 20,
      maxHp: 100 + (playerLevel - 1) * 20,
      warmth: 100,
      maxWarmth: 100,
      level: playerLevel,
      exp: 0,
      expNext: 100,
      isGrounded: false,
      isGliding: false,
      isDashing: false,
      facing: 'right' as 'left' | 'right',
      jumpCount: 0,
      dashCooldown: 0,
      dashTimer: 0,
      flutterTimer: 0,
      invulnerableTimer: 0,
      shootCooldown: 0,
      frame: 0,
      isDancing: false,
    } as PlayerStats,
    coins: JSON.parse(JSON.stringify(level.coins)),
    enemies: JSON.parse(JSON.stringify(level.enemies)),
    cookies: JSON.parse(JSON.stringify(level.cookies)),
    projectiles: [] as Projectile[],
    particles: [] as Particle[],
    snowflakes: [] as Array<{
      x: number;
      y: number;
      r: number;
      speed: number;
      drift: number;
      layer: number;
      alpha: number;
      wobblePhase: number;
      wobbleSpeed: number;
      type: 'soft' | 'crystal' | 'streak';
    }>,
    cameraX: 0,
    cameraY: 0,
    collectedCoins: 0,
    collectedCookies: 0,
    zombiesDefeated: 0,
    score: 0,
    isCompleted: false,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      dash: false,
      shoot: false,
    },
    lastTime: performance.now(),
    animationFrameId: 0,
  });

  // Initialize snowflakes intensified by board difficulty level
  useEffect(() => {
    const difficulty = level.id; // 1 to 5
    const flakes = [];

    // Scale snowflake count by board difficulty
    const countByLevel: Record<number, number> = {
      1: 85,
      2: 150,
      3: 230,
      4: 320,
      5: 440,
    };
    const totalFlakes = countByLevel[difficulty] || (80 + difficulty * 60);

    for (let i = 0; i < totalFlakes; i++) {
      // 3 Depth layers: 0 (background), 1 (midground), 2 (foreground)
      const layer = i % 3;
      let r = 1 + Math.random() * 2.5;
      let baseSpeed = 35 + Math.random() * 45;
      let baseDrift = -15 + Math.random() * 30;
      let alpha = 0.6 + Math.random() * 0.4;
      let type: 'soft' | 'crystal' | 'streak' = 'soft';

      if (layer === 0) {
        r = 0.8 + Math.random() * 1.5;
        baseSpeed *= 0.65;
        alpha = 0.35 + Math.random() * 0.3;
      } else if (layer === 2) {
        r = 2.5 + Math.random() * 3.0; // Big fluffy foreground flakes
        baseSpeed *= 1.35;
        alpha = 0.75 + Math.random() * 0.25;
      }

      // Intensify with difficulty
      if (difficulty === 2) {
        baseSpeed *= 1.25;
        baseDrift = 20 + Math.random() * 40; // Wind blowing from left
      } else if (difficulty === 3) {
        baseSpeed *= 1.55;
        baseDrift = 45 + Math.random() * 65;
        if (Math.random() > 0.6) type = 'crystal';
      } else if (difficulty === 4) {
        baseSpeed *= 1.9;
        baseDrift = 75 + Math.random() * 95;
        if (Math.random() > 0.4) type = 'crystal';
      } else if (difficulty >= 5) {
        // Extreme Blizzard Peak
        baseSpeed *= 2.4;
        baseDrift = 120 + Math.random() * 140; // High speed driving blizzard
        type = Math.random() > 0.5 ? 'streak' : 'crystal';
      }

      flakes.push({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        r,
        speed: baseSpeed,
        drift: baseDrift,
        layer,
        alpha,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 1 + Math.random() * 3,
        type,
      });
    }

    gameRef.current.snowflakes = flakes;
    gameRef.current.coins = JSON.parse(JSON.stringify(level.coins));
    gameRef.current.enemies = JSON.parse(JSON.stringify(level.enemies));
    gameRef.current.cookies = JSON.parse(JSON.stringify(level.cookies));
    gameRef.current.player.x = level.spawnX;
    gameRef.current.player.y = level.spawnY;
    gameRef.current.isCompleted = false;
  }, [level]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = gameRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        k.up = true;
        handleJumpPress();
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = true;
      if (e.key === 'Shift') k.dash = true;
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
        k.shoot = true;
        handleShootPress();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = gameRef.current.keys;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') k.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') k.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') k.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') k.down = false;
      if (e.key === 'Shift') k.dash = false;
      if (e.key === ' ' || e.key === 'f' || e.key === 'F') k.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [equipped]);

  // Jump Action
  const handleJumpPress = () => {
    const p = gameRef.current.player;
    const hat = getUpgradeById(equipped.hat);
    const maxJumps = 1 + (hat?.stats.extraJumps || 0);

    if (p.isGrounded) {
      p.vy = -540;
      p.isGrounded = false;
      p.jumpCount = 1;
      sound.playJump();
    } else if (p.jumpCount < maxJumps) {
      p.vy = -480;
      p.jumpCount++;
      sound.playFlutter();
      // Woodstock flap sparkle
      gameRef.current.particles.push({
        x: p.x + p.width / 2,
        y: p.y + p.height,
        vx: 0,
        vy: 50,
        size: 5,
        color: '#FACC15',
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
        shape: 'sparkle',
      });
    }
  };

  // Shoot Snowball Action
  const handleShootPress = () => {
    const p = gameRef.current.player;
    if (p.shootCooldown > 0) return;

    p.shootCooldown = 0.28; // Rapid toss
    const mitts = getUpgradeById(equipped.mitts);
    const damage = (mitts?.stats.snowballDamage || 15) + (playerLevel - 1) * 8;
    const dir = p.facing === 'right' ? 1 : -1;

    sound.playDash();

    gameRef.current.projectiles.push({
      id: `proj_${Date.now()}_${Math.random()}`,
      x: p.x + (p.facing === 'right' ? p.width : 0),
      y: p.y + p.height * 0.45,
      vx: dir * 650,
      vy: -60,
      radius: 6,
      damage,
      type: mitts?.id === 'mitts_3' ? 'peppermint_star' : 'snowball',
      life: 1.2,
    });
  };

  // Main 60fps Loop
  useEffect(() => {
    let animId = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;

    const tick = (now: number) => {
      const dt = Math.min((now - game.lastTime) / 1000, 0.08);
      game.lastTime = now;

      const p = game.player;
      p.frame++;

      // Stats Upgrades modifiers
      const sweater = getUpgradeById(equipped.sweater);
      const mitts = getUpgradeById(equipped.mitts);
      const hat = getUpgradeById(equipped.hat);

      const speedMultiplier = 1 + (sweater?.stats.bonusSpeed || 0) * 0.25;
      const moveSpeed = 340 * speedMultiplier;
      const magnetRadius = mitts?.stats.magnetRadius || 50;

      // Decrement timers
      if (p.shootCooldown > 0) p.shootCooldown -= dt;
      if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
      if (p.dashCooldown > 0) p.dashCooldown -= dt;

      // 1. Player Horizontal Physics
      if (game.keys.left) {
        p.vx = -moveSpeed;
        p.facing = 'left';
      } else if (game.keys.right) {
        p.vx = moveSpeed;
        p.facing = 'right';
      } else {
        // Ice vs Snow friction
        const friction = level.iceMultiplier < 0.5 ? 0.94 : 0.78;
        p.vx *= friction;
      }

      // Dash action
      if (game.keys.dash && p.dashCooldown <= 0) {
        p.vx = (p.facing === 'right' ? 1 : -1) * 750;
        p.dashCooldown = 1.0;
        sound.playDash();
      }

      // 2. Vertical Gravity
      p.vy += 1200 * dt; // Gravity
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Boundary limits
      p.x = Math.max(0, Math.min(level.width - p.width, p.x));

      // 3. Platform Collision
      p.isGrounded = false;
      let nearCampfire = false;

      level.platforms.forEach((plat) => {
        // Campfire proximity warmth check
        if (plat.type === 'campfire') {
          const distToFire = Math.hypot(p.x + p.width / 2 - (plat.x + plat.width / 2), p.y + p.height / 2 - (plat.y + plat.height / 2));
          if (distToFire < 120) {
            nearCampfire = true;
          }
        }

        // Top edge collision
        if (
          p.x + p.width * 0.7 > plat.x &&
          p.x + p.width * 0.3 < plat.x + plat.width &&
          p.y + p.height >= plat.y &&
          p.y + p.height <= plat.y + 24 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
          p.jumpCount = 0;

          // Spring Schroeder Piano Platform!
          if (plat.isSpring) {
            p.vy = -720; // High bounce!
            sound.playPianoBounce();
          }
        }
      });

      // 4. Blizzard Warmth & Cold Drain
      const warmthPreserve =
        (sweater?.stats.warmthPreserve || 0) +
        (mitts?.stats.warmthPreserve || 0) +
        (hat?.stats.warmthPreserve || 0);

      if (nearCampfire) {
        p.warmth = Math.min(100, p.warmth + dt * 45); // Rapid warm recovery!
      } else {
        const effectiveColdDrain = level.blizzardColdRate * (1 - Math.min(0.85, warmthPreserve / 100));
        p.warmth = Math.max(0, p.warmth - dt * effectiveColdDrain * 3);
      }
      setHudWarmth(Math.round(p.warmth));

      // Freezing damage if warmth hits 0
      if (p.warmth <= 0 && p.invulnerableTimer <= 0) {
        p.hp -= dt * 10;
        p.invulnerableTimer = 0.5;
        setHudHp(Math.round(p.hp));
        if (p.hp <= 0) {
          onGameOver();
          return;
        }
      }

      // 5. Coin Attraction Magnet (Winter Mitts Upgrade!)
      game.coins.forEach((c: any) => {
        if (c.collected) return;
        const dx = p.x + p.width / 2 - c.x;
        const dy = p.y + p.height / 2 - c.y;
        const dist = Math.hypot(dx, dy);

        if (dist < magnetRadius) {
          c.x += (dx / dist) * 350 * dt;
          c.y += (dy / dist) * 350 * dt;
        }

        if (dist < 26) {
          c.collected = true;
          const mult = hat?.stats.coinMultiplier || 1;
          game.collectedCoins += Math.round(c.value * mult);
          game.score += c.value * 50;
          setHudCoins(game.collectedCoins);
          if (c.type === 'star') sound.playStar();
          else if (c.type === 'bone') sound.playBone();
          else sound.playCoin();
        }
      });

      // 6. Cold Sugar Cookies Collection
      game.cookies.forEach((ck: any) => {
        if (ck.collected) return;
        const dist = Math.hypot(p.x + p.width / 2 - ck.x, p.y + p.height / 2 - ck.y);
        if (dist < 30) {
          ck.collected = true;
          game.collectedCookies += 1;
          game.score += 150;
          sound.playStar();
        }
      });

      // 7. Projectiles Update & Zombie Enemy Hits
      for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const proj = game.projectiles[i];
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;
        proj.life -= dt;

        let hit = false;
        game.enemies.forEach((enemy: Enemy) => {
          if (enemy.hp <= 0) return;
          if (
            proj.x > enemy.x &&
            proj.x < enemy.x + enemy.width &&
            proj.y > enemy.y &&
            proj.y < enemy.y + enemy.height
          ) {
            hit = true;
            enemy.hp -= proj.damage;
            enemy.state = 'hurt';
            sound.playBone();

            // Spawn damage particle
            game.particles.push({
              x: enemy.x + enemy.width / 2,
              y: enemy.y,
              vx: 0,
              vy: -40,
              size: 14,
              color: '#FBBF24',
              alpha: 1,
              life: 0.6,
              maxLife: 0.6,
              shape: 'text',
              text: `-${proj.damage}`,
            });

            // Zombie Defeated!
            if (enemy.hp <= 0) {
              game.zombiesDefeated++;
              setHudZombies(game.zombiesDefeated);
              sound.playStar();
              // Drop Cold Cookie!
              game.cookies.push({
                id: `drop_ck_${Date.now()}`,
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height - 10,
                collected: false,
                exp: enemy.expReward,
                floatOffset: 0,
              });
            }
          }
        });

        if (hit || proj.life <= 0) {
          game.projectiles.splice(i, 1);
        }
      }

      // 8. Enemy Movement
      game.enemies.forEach((e: Enemy) => {
        if (e.hp <= 0) return;
        e.x += e.vx * dt * 45;
        if (e.x < e.patrolMinX) {
          e.x = e.patrolMinX;
          e.vx = Math.abs(e.vx);
          e.facing = 'right';
        } else if (e.x > e.patrolMaxX) {
          e.x = e.patrolMaxX;
          e.vx = -Math.abs(e.vx);
          e.facing = 'left';
        }

        // Enemy collision with player
        const dist = Math.hypot(p.x + p.width / 2 - (e.x + e.width / 2), p.y + p.height / 2 - (e.y + e.height / 2));
        if (dist < 32 && p.invulnerableTimer <= 0) {
          // If player lands on top of zombie -> stomp!
          if (p.vy > 100 && p.y + p.height < e.y + 25) {
            e.hp -= 40;
            p.vy = -450; // Stomp bounce!
            sound.playJump();
          } else {
            // Player takes hit
            p.hp -= 20;
            p.invulnerableTimer = 1.0;
            p.vx = (p.facing === 'right' ? -1 : 1) * 300;
            p.vy = -200;
            sound.playGameOver();
            setHudHp(Math.max(0, Math.round(p.hp)));
            if (p.hp <= 0) {
              onGameOver();
              return;
            }
          }
        }
      });

      // 9. Goal Reached Check (Red Doghouse at end of board)
      const distToGoal = Math.hypot(p.x + p.width / 2 - level.goalX, p.y + p.height / 2 - level.goalY);
      if (distToGoal < 70 && !game.isCompleted) {
        game.isCompleted = true;
        p.isDancing = true;
        sound.playVictory();
        setTimeout(() => {
          onLevelComplete(
            game.score + game.collectedCoins * 100,
            game.collectedCoins,
            game.collectedCookies,
            game.zombiesDefeated
          );
        }, 1800);
      }

      // 10. Camera Follow Smoothly
      const targetCamX = p.x - canvas.width * 0.4;
      game.cameraX += (targetCamX - game.cameraX) * dt * 4.5;
      game.cameraX = Math.max(0, Math.min(level.width - canvas.width, game.cameraX));

      // 11. RENDER CANVAS
      renderScene(ctx, canvas.width, canvas.height, game);

      animId = requestAnimationFrame(tick);
    };

    gameRef.current.lastTime = performance.now();
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [level, equipped, character, nightTheme]);

  // Canvas Render
  const renderScene = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    g: typeof gameRef.current
  ) => {
    const camX = g.cameraX;
    const now = performance.now();

    // 1. Background Sky (Classic Cartoon Movie Night Theme vs Day)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (nightTheme) {
      skyGrad.addColorStop(0, '#0F172A'); // Deep Peanuts indigo night
      skyGrad.addColorStop(0.65, '#1E293B');
      skyGrad.addColorStop(1, '#334155');
    } else {
      skyGrad.addColorStop(0, '#1E293B');
      skyGrad.addColorStop(0.5, '#3B82F6');
      skyGrad.addColorStop(1, '#E2E8F0');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Holiday Moon in Cartoon Night Mode with Snoopy Doghouse Flight Silhouette!
    if (nightTheme) {
      // 1a. Twinkling Night Stars in Cartoon Sky
      ctx.fillStyle = '#FFFFFF';
      const starOffsets = [
        { x: 0.12, y: 0.15, r: 1.5 },
        { x: 0.28, y: 0.08, r: 2.0 },
        { x: 0.45, y: 0.18, r: 1.2 },
        { x: 0.62, y: 0.09, r: 1.8 },
        { x: 0.78, y: 0.22, r: 1.4 },
        { x: 0.88, y: 0.12, r: 2.2 },
        { x: 0.35, y: 0.26, r: 1.3 },
      ];
      starOffsets.forEach((st, idx) => {
        const twinkle = 0.5 + Math.sin(now * 0.003 + idx) * 0.45;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(st.x * width, st.y * height, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 1b. Moon Halo
      ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
      ctx.beginPath();
      ctx.arc(width - 120, 85, 84, 0, Math.PI * 2);
      ctx.fill();

      // 1c. Luminous Full Moon
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(width - 120, 85, 46, 0, Math.PI * 2);
      ctx.fill();

      // 1d. Soft Moon Craters
      ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
      ctx.beginPath();
      ctx.arc(width - 135, 75, 9, 0, Math.PI * 2);
      ctx.arc(width - 108, 92, 11, 0, Math.PI * 2);
      ctx.arc(width - 125, 102, 6, 0, Math.PI * 2);
      ctx.fill();

      // 1e. Snoopy Doghouse "Flying Ace" Soaring Across Night Sky & Moon!
      // Periodic flight across the sky every 18 seconds
      const flightPeriod = 18000;
      const progress = (now % flightPeriod) / flightPeriod;
      const doghouseFlightX = width + 60 - progress * (width + 200);
      const doghouseFlightY = 70 + Math.sin(now * 0.002) * 12;

      ctx.save();
      ctx.translate(doghouseFlightX, doghouseFlightY);

      // Red Doghouse Silhouette
      ctx.fillStyle = '#DC2626';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(16, 8);
      ctx.lineTo(16, -2);
      ctx.lineTo(0, -14);
      ctx.lineTo(-16, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Snoopy on top of doghouse in aviator helmet
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(-2, -16, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Black Ear / Goggles
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(-6, -17, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Red Aviator Scarf Fluttering Behind
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(3, -15);
      const scarfWave = Math.sin(now * 0.015) * 4;
      ctx.lineTo(14, -16 + scarfWave);
      ctx.lineTo(20, -14 - scarfWave);
      ctx.stroke();

      ctx.restore();
    }

    ctx.save();
    ctx.translate(-camX, 0);

    // 2. Parallax Distant Pine Trees
    ctx.fillStyle = nightTheme ? '#142032' : '#15803D';
    for (let tx = 40; tx < level.width; tx += 180) {
      ctx.beginPath();
      ctx.moveTo(tx, 620);
      ctx.lineTo(tx + 40, 450);
      ctx.lineTo(tx + 80, 620);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Platforms
    level.platforms.forEach((plat) => {
      if (plat.type === 'snow') {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
      } else if (plat.type === 'ice') {
        ctx.fillStyle = '#BAE6FD';
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2.5;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
        // Specular glint
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(plat.x + 10, plat.y + 4, plat.width - 20, 4);
      } else if (plat.type === 'wood') {
        ctx.fillStyle = '#B45309';
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
      } else if (plat.type === 'doghouse') {
        drawDoghouse(ctx, plat, now);
      } else if (plat.type === 'piano') {
        drawPiano(ctx, plat, now);
        // Schroeder playing his red toy piano!
        drawSchroeder(ctx, plat.x + 20, plat.y - 32, 40, 45, 'right', g.player.frame, true, false);
        if (Math.abs(g.player.x - plat.x) < 220) {
          drawPeanutsSpeechBubble(ctx, "♫ Beethoven Carol!", plat.x + 40, plat.y - 48, '#FEF08A');
        }
      } else if (plat.type === 'booth') {
        drawBooth(ctx, plat);
        // Lucy standing at her 5¢ Advice & Hot Cocoa Booth!
        drawLucy(ctx, plat.x + plat.width / 2 - 20, plat.y - 25, 40, 45, 'right', g.player.frame, true, false);
        if (Math.abs(g.player.x - plat.x) < 240) {
          drawPeanutsSpeechBubble(ctx, "5¢ Advice & Hot Cocoa!", plat.x + plat.width / 2, plat.y - 48, '#FEF08A');
        }
      } else if (plat.type === 'campfire') {
        drawCampfire(ctx, plat, now);
        // Linus sitting warm by the campfire with his blue security blanket!
        drawLinus(ctx, plat.x - 36, plat.y + plat.height - 48, 40, 45, 'right', g.player.frame, true, false, equipped, 0);
        if (Math.abs(g.player.x - plat.x) < 200) {
          drawPeanutsSpeechBubble(ctx, "Stay toasty by the fire!", plat.x - 16, plat.y - 22, '#FEF08A');
        }
      }
    });

    // 4. Little Charlie Brown Tree if tree lot level
    if (level.theme === 'tree_lot') {
      drawCharlieTree(ctx, 3080, 440);
    }

    // 5. Coins & Collectibles
    g.coins.forEach((c: any) => drawCoin(ctx, c, now));

    // 6. Cold Sugar Cookies
    g.cookies.forEach((ck: any) => drawColdCookie(ctx, ck, now));

    // 7. Zombie Enemies
    g.enemies.forEach((enemy: Enemy) => {
      if (enemy.hp <= 0) return;
      if (enemy.type === 'zombie_snowman') drawZombieSnowman(ctx, enemy, now);
      else if (enemy.type === 'blizzard_ghoul') drawBlizzardGhoul(ctx, enemy, now);
      else drawFrostBat(ctx, enemy, now);
    });

    // 8. Snowballs / Projectiles
    g.projectiles.forEach((p) => drawProjectile(ctx, p));

    // 9. Woodstock and his tiny yellow bird flock fluttering alongside!
    drawWoodstockFlock(
      ctx,
      g.player.x + (g.player.facing === 'right' ? -22 : 62),
      g.player.y - 18,
      g.player.frame
    );

    // 10. Player Character & Faithful Peanuts Companion (Snoopy + Charlie Brown Dynamic Duo!)
    if (character === 'SNOOPY') {
      // Companion Charlie Brown running alongside Snoopy!
      const companionX = g.player.x - (g.player.facing === 'right' ? 44 : -44);
      const companionY = g.player.isGrounded ? g.player.y : g.player.y + 10;
      drawCharlieBrown(
        ctx,
        companionX,
        companionY,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        0
      );

      // Main Player Snoopy
      drawSnoopy(
        ctx,
        g.player.x,
        g.player.y,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        g.player.invulnerableTimer
      );

      // Comic Dialogue Bubbles in blizzard or action
      if (level.id >= 3 && Math.floor(now / 3500) % 2 === 0 && !g.isCompleted) {
        drawPeanutsSpeechBubble(ctx, "Good grief! What a blizzard!", companionX + 20, companionY - 24);
      } else if (g.player.isDancing) {
        drawPeanutsSpeechBubble(ctx, "Awooo! (Happy dance!)", g.player.x + 20, g.player.y - 28);
      }
    } else if (character === 'CHARLIE_BROWN') {
      // Companion Snoopy trotting cheerfully alongside Charlie Brown!
      const companionX = g.player.x + (g.player.facing === 'right' ? 44 : -44);
      drawSnoopy(
        ctx,
        companionX,
        g.player.y,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        0
      );

      // Main Player Charlie Brown
      drawCharlieBrown(
        ctx,
        g.player.x,
        g.player.y,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        g.player.invulnerableTimer
      );

      if (level.id >= 3 && Math.floor(now / 3500) % 2 === 0 && !g.isCompleted) {
        drawPeanutsSpeechBubble(ctx, "Stay warm, Snoopy!", g.player.x + 20, g.player.y - 24);
      }
    } else {
      // Linus accompanied by Snoopy
      const companionX = g.player.x + (g.player.facing === 'right' ? 44 : -44);
      drawSnoopy(
        ctx,
        companionX,
        g.player.y,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        0
      );

      drawLinus(
        ctx,
        g.player.x,
        g.player.y,
        g.player.width,
        g.player.height,
        g.player.facing,
        g.player.frame,
        g.player.isGrounded,
        g.player.isDancing,
        equipped,
        g.player.invulnerableTimer
      );
    }

    // 11. End-of-Level Peanuts Gang Holiday Chorus Celebration at the Goal!
    if (g.isCompleted) {
      const gx = level.goalX;
      const gy = level.goalY;
      // All friends singing around the decorated doghouse!
      drawCharlieBrown(ctx, gx - 70, gy - 10, 44, 48, 'right', g.player.frame, true, true, equipped, 0);
      drawLinus(ctx, gx - 35, gy - 8, 44, 48, 'right', g.player.frame, true, true, equipped, 0);
      drawLucy(ctx, gx + 40, gy - 8, 44, 48, 'left', g.player.frame, true, true);
      drawSchroeder(ctx, gx + 75, gy - 10, 44, 48, 'left', g.player.frame, true, true);

      drawPeanutsSpeechBubble(
        ctx,
        "♫ Hark! The Herald Angels Sing ♫",
        gx,
        gy - 75,
        '#FEF08A'
      );
    }

    // 11. Floating Damage / Text Particles
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const pt = g.particles[i];
      pt.x += pt.vx * 0.016;
      pt.y += pt.vy * 0.016;
      pt.life -= 0.016;

      if (pt.shape === 'text' && pt.text) {
        ctx.fillStyle = pt.color;
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(pt.text, pt.x, pt.y);
      }

      if (pt.life <= 0) g.particles.splice(i, 1);
    }

    ctx.restore();

    // 12. Dynamic Falling Snowflakes & Weather Effects (Intensified by Board Difficulty)
    const difficulty = level.id; // 1 to 5
    const gust =
      Math.sin(now * 0.0009 * difficulty) * (difficulty * 28) +
      Math.cos(now * 0.0022) * (difficulty * 12);

    // Ground Snow Dust / Wind Mist on higher difficulties (Difficulty >= 2)
    if (difficulty >= 2) {
      const mistOffset = (now * 0.04 * difficulty) % width;
      ctx.fillStyle = nightTheme ? 'rgba(224, 242, 254, 0.06)' : 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.ellipse(mistOffset, height - 35, 180 + difficulty * 40, 25, 0, 0, Math.PI * 2);
      ctx.ellipse((mistOffset + width * 0.5) % width, height - 55, 220 + difficulty * 30, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // High Difficulty Blizzard Wind Streaks (Difficulty >= 4)
    if (difficulty >= 4) {
      ctx.strokeStyle = nightTheme ? 'rgba(224, 242, 254, 0.14)' : 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1.8;
      const windOffset = (now * 0.6 * difficulty) % (width + 300);
      for (let w = 0; w < 4; w++) {
        const wy = 80 + w * 110 + Math.sin(now * 0.003 + w) * 20;
        ctx.beginPath();
        ctx.moveTo(windOffset - 300 + w * 70, wy);
        ctx.lineTo(windOffset - 100 + w * 70, wy + (difficulty * 6));
        ctx.stroke();
      }
    }

    // Draw multi-layered snowflakes
    g.snowflakes.forEach((s) => {
      // Natural air turbulence wobble
      const wobble = Math.sin(now * 0.003 * s.wobbleSpeed + s.wobblePhase) * (14 / (s.layer + 1));
      const totalDrift = s.drift + gust + wobble;

      s.y += s.speed * 0.016;
      s.x += totalDrift * 0.016;

      // Wrap around screen boundaries with margin
      if (s.y > height + 10) {
        s.y = -12;
        s.x = Math.random() * (width + 100) - 50;
      }
      if (s.x > width + 40) s.x = -30;
      if (s.x < -40) s.x = width + 30;

      ctx.save();

      if (s.type === 'streak' && difficulty >= 4) {
        // Fast Blizzard Motion Streak
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.9})`;
        ctx.lineWidth = Math.max(1.2, s.r * 0.6);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - (totalDrift * 0.045), s.y - (s.speed * 0.035));
        ctx.stroke();
      } else if (s.type === 'crystal') {
        // Sparkling 4-pointed Winter Star Crystal
        ctx.strokeStyle = `rgba(240, 249, 255, ${s.alpha})`;
        ctx.lineWidth = 1.4;
        const arm = s.r * 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x - arm, s.y);
        ctx.lineTo(s.x + arm, s.y);
        ctx.moveTo(s.x, s.y - arm);
        ctx.lineTo(s.x, s.y + arm);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft round snowflake with layer depth alpha
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft glow on large foreground flakes
        if (s.layer === 2) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    });

    // Blizzard Frosty Vignette on Extreme Level 5
    if (difficulty >= 5) {
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.32,
        width / 2,
        height / 2,
        width * 0.68
      );
      vignette.addColorStop(0, 'rgba(224, 242, 254, 0)');
      vignette.addColorStop(1, 'rgba(224, 242, 254, 0.22)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }
  };

  // Weather description based on board difficulty
  const getWeatherInfo = (levelId: number) => {
    switch (levelId) {
      case 1:
        return { label: 'Gentle Flurry', speed: 'Calm', icon: '❄️' };
      case 2:
        return { label: 'Brisk Wind', speed: '15 MPH', icon: '🌬️' };
      case 3:
        return { label: 'Snow Squall', speed: '25 MPH', icon: '🌨️' };
      case 4:
        return { label: 'Gale Snowstorm', speed: '40 MPH', icon: '❄️' };
      case 5:
        return { label: 'Arctic Blizzard', speed: '60 MPH', icon: '🌪️' };
      default:
        return { label: 'Winter Snow', speed: '20 MPH', icon: '❄️' };
    }
  };

  const weather = getWeatherInfo(level.id);

  return (
    <div className="relative w-full aspect-[16/9] max-h-[72vh] bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-2xl flex flex-col justify-between">
      {/* Top HUD Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Health & Warmth Bars */}
        <div className="flex items-center gap-2.5">
          {/* Health */}
          <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl border-2 border-slate-900 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <div className="w-24 bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-200"
                style={{ width: `${Math.max(0, hudHp)}%` }}
              />
            </div>
          </div>

          {/* Warmth Meter in Blizzard! */}
          <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl border-2 border-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="w-24 bg-slate-800 rounded-full h-3 border border-slate-700 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-200"
                style={{ width: `${Math.max(0, hudWarmth)}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-amber-300 tabular-nums">{hudWarmth}%</span>
          </div>

          {/* Dynamic Weather & Wind Speed Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl border-2 border-slate-900 text-[10px] font-black text-sky-200">
            <span>{weather.icon}</span>
            <span className="text-white">{weather.label}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-300">{weather.speed}</span>
          </div>
        </div>

        {/* Coins & Zombies Defeated */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 border-2 border-slate-900 px-3 py-1.5 rounded-2xl font-black text-xs text-slate-950 shadow-sm flex items-center gap-1.5">
            <span>🪙 {hudCoins} / {level.targetCoins}</span>
          </div>
          <div className="bg-slate-900/90 border-2 border-slate-900 px-3 py-1.5 rounded-2xl font-black text-xs text-white shadow-sm flex items-center gap-1.5">
            <span>🧟 {hudZombies} Smashed</span>
          </div>
        </div>
      </div>

      {/* Main Game Canvas */}
      <canvas ref={canvasRef} width={960} height={540} className="w-full h-full object-contain block" />

      {/* Touch Screen & On-Screen Action Controls for iPhone & Android */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Directional Pad */}
        <div className="flex gap-2">
          <button
            onMouseDown={() => (gameRef.current.keys.left = true)}
            onMouseUp={() => (gameRef.current.keys.left = false)}
            onTouchStart={() => (gameRef.current.keys.left = true)}
            onTouchEnd={() => (gameRef.current.keys.left = false)}
            className="w-13 h-12 rounded-2xl bg-white/90 hover:bg-amber-300 text-slate-900 font-black text-lg border-2 border-slate-900 shadow-md flex items-center justify-center select-none active:scale-95"
          >
            ◀
          </button>
          <button
            onMouseDown={() => (gameRef.current.keys.right = true)}
            onMouseUp={() => (gameRef.current.keys.right = false)}
            onTouchStart={() => (gameRef.current.keys.right = true)}
            onTouchEnd={() => (gameRef.current.keys.right = false)}
            className="w-13 h-12 rounded-2xl bg-white/90 hover:bg-amber-300 text-slate-900 font-black text-lg border-2 border-slate-900 shadow-md flex items-center justify-center select-none active:scale-95"
          >
            ▶
          </button>
        </div>

        {/* Action Buttons: Throw Snowball, Dash, Jump */}
        <div className="flex gap-2">
          <button
            onClick={handleShootPress}
            className="px-4 h-12 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs border-2 border-slate-900 shadow-md flex items-center gap-1 select-none active:scale-95"
          >
            <span>❄️ THROW</span>
          </button>
          <button
            onClick={() => {
              gameRef.current.keys.dash = true;
              setTimeout(() => (gameRef.current.keys.dash = false), 200);
            }}
            className="px-3.5 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs border-2 border-slate-900 shadow-md flex items-center gap-1 select-none active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>DASH</span>
          </button>
          <button
            onClick={handleJumpPress}
            className="px-5 h-12 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-sm border-2 border-slate-900 shadow-md flex items-center justify-center select-none active:scale-95"
          >
            JUMP ⇧
          </button>
        </div>
      </div>
    </div>
  );
};
