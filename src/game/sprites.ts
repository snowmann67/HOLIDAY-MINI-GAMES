import { CharacterType, Platform, Coin, Obstacle, Enemy, ColdCookie, Projectile } from './types';

// Draw Snoopy with customized mittens, hat, and sweater
export function drawSnoopy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  frame: number,
  isGrounded: boolean,
  isDancing: boolean,
  equipped: { mitts: string; hat: string; sweater: string },
  invulnerableTimer: number = 0
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  if (invulnerableTimer > 0 && Math.floor(invulnerableTimer / 4) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  const danceOffset = isDancing ? Math.sin(frame * 0.4) * 8 : 0;
  const legOffset = isGrounded ? Math.sin(frame * 0.3) * 6 : 0;
  const earAngle = isDancing
    ? Math.sin(frame * 0.5) * 0.4
    : !isGrounded
    ? -0.5 + Math.sin(frame * 0.4) * 0.2
    : 0.1;

  ctx.translate(0, danceOffset);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  let sweaterColor = '#FFFFFF';
  let hasZigzag = false;
  let hasLights = false;

  if (equipped.sweater.includes('sweater_0')) {
    sweaterColor = '#EAB308';
    hasZigzag = true;
  } else if (equipped.sweater.includes('sweater_1')) {
    sweaterColor = '#10B981';
  } else if (equipped.sweater.includes('sweater_2')) {
    sweaterColor = '#991B1B';
  } else if (equipped.sweater.includes('sweater_3')) {
    sweaterColor = '#7C3AED';
    hasLights = true;
  }

  // Draw Body / Sweater
  ctx.fillStyle = sweaterColor;
  ctx.beginPath();
  ctx.ellipse(0, 4, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (hasZigzag) {
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(-12, 4);
    ctx.lineTo(-6, -1);
    ctx.lineTo(0, 4);
    ctx.lineTo(6, -1);
    ctx.lineTo(12, 4);
    ctx.lineTo(10, 8);
    ctx.lineTo(6, 4);
    ctx.lineTo(0, 9);
    ctx.lineTo(-6, 4);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();
  } else if (hasLights) {
    const colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colors[(i + Math.floor(frame / 10)) % colors.length];
      ctx.beginPath();
      ctx.arc(-8 + i * 5, 2 + (i % 2) * 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Aviator Scarf tails if Flying Ace
  if (equipped.sweater.includes('sweater_2')) {
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(-6, -8);
    const flutter = Math.sin(frame * 0.4) * 6;
    ctx.lineTo(-24, -12 + flutter);
    ctx.lineTo(-22, -4 + flutter);
    ctx.lineTo(-4, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Red Collar
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.roundRect(-10, -9, 20, 4, 2);
  ctx.fill();
  ctx.stroke();

  // Head & Snout
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(2, -18, 15, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(14, -15, 10, 7, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(8, -16, 7, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.ellipse(23, -17, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2.5;
  if (isDancing) {
    ctx.beginPath();
    ctx.arc(4, -20, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(4, -20, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smile
  ctx.beginPath();
  ctx.arc(10, -13, 5, 0.1, Math.PI * 0.6);
  ctx.stroke();

  // Floppy Black Ear
  ctx.save();
  ctx.translate(-2, -19);
  ctx.rotate(earAngle);
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.ellipse(-4, 10, 6, 13, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Holiday Hat
  drawHolidayHat(ctx, equipped.hat, frame);

  // Feet & Mittens
  drawFeetAndMitts(ctx, legOffset, isDancing, equipped.mitts);

  ctx.restore();
}

// Draw Charlie Brown
export function drawCharlieBrown(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  frame: number,
  isGrounded: boolean,
  isDancing: boolean,
  equipped: { mitts: string; hat: string; sweater: string },
  invulnerableTimer: number = 0
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  if (invulnerableTimer > 0 && Math.floor(invulnerableTimer / 4) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const legOffset = isGrounded ? Math.sin(frame * 0.3) * 6 : 0;

  let shirtColor = '#EAB308';
  if (equipped.sweater.includes('sweater_1')) shirtColor = '#10B981';
  if (equipped.sweater.includes('sweater_2')) shirtColor = '#991B1B';
  if (equipped.sweater.includes('sweater_3')) shirtColor = '#7C3AED';

  ctx.fillStyle = shirtColor;
  ctx.beginPath();
  ctx.roundRect(-14, -4, 28, 24, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.moveTo(-14, 8);
  ctx.lineTo(-7, 2);
  ctx.lineTo(0, 8);
  ctx.lineTo(7, 2);
  ctx.lineTo(14, 8);
  ctx.lineTo(14, 14);
  ctx.lineTo(7, 8);
  ctx.lineTo(0, 14);
  ctx.lineTo(-7, 8);
  ctx.lineTo(-14, 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(0, -20, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -32, 3, 0.4, Math.PI * 1.4);
  ctx.stroke();

  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(-15, -20, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-3, -22, 2, 0, Math.PI * 2);
  ctx.arc(5, -22, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, -26);
  ctx.lineTo(-1, -25);
  ctx.moveTo(3, -25);
  ctx.lineTo(8, -26);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(1, -19, 2.5, 0.2, Math.PI * 0.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(1, -15, 4, 0.2, Math.PI * 0.8);
  ctx.stroke();

  drawHolidayHat(ctx, equipped.hat, frame);
  drawFeetAndMitts(ctx, legOffset, isDancing, equipped.mitts);

  ctx.restore();
}

// Draw Linus with blue blanket
export function drawLinus(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  frame: number,
  isGrounded: boolean,
  isDancing: boolean,
  equipped: { mitts: string; hat: string; sweater: string },
  invulnerableTimer: number = 0
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') ctx.scale(-1, 1);

  if (invulnerableTimer > 0 && Math.floor(invulnerableTimer / 4) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';

  // Red & Black Striped Shirt
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.roundRect(-13, -4, 26, 24, 4);
  ctx.fill();
  ctx.stroke();

  // Stripes
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(-13, 2, 26, 4);
  ctx.fillRect(-13, 12, 26, 4);

  // Blue Security Blanket draped over shoulder!
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.ellipse(-10, 4, 8, 16, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(0, -20, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Wild spiky hair strands
  ctx.lineWidth = 2.5;
  for (let h = -10; h <= 10; h += 4) {
    ctx.beginPath();
    ctx.moveTo(h, -32);
    ctx.lineTo(h * 1.2, -38 - Math.abs(h * 0.3));
    ctx.stroke();
  }

  // Face
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-4, -21, 2, 0, Math.PI * 2);
  ctx.arc(4, -21, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -18, 2, 0, Math.PI);
  ctx.stroke();

  drawHolidayHat(ctx, equipped.hat, frame);
  drawFeetAndMitts(ctx, isGrounded ? Math.sin(frame * 0.3) * 6 : 0, isDancing, equipped.mitts);

  ctx.restore();
}

// Draw Lucy Van Pelt
export function drawLucy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  frame: number,
  isGrounded: boolean,
  isDancing: boolean
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') ctx.scale(-1, 1);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const legOffset = isGrounded ? Math.sin(frame * 0.3) * 6 : 0;

  // Royal Blue Winter Coat / Dress
  ctx.fillStyle = '#2563EB';
  ctx.beginPath();
  ctx.moveTo(-12, -2);
  ctx.lineTo(12, -2);
  ctx.lineTo(16, 22);
  ctx.lineTo(-16, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // White collar
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-5, -2, 4, 0, Math.PI);
  ctx.arc(5, -2, 4, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(0, -18, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lucy's Iconic Black Curly Bob Hair
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  // Curly buns & hair ridge
  ctx.arc(-14, -20, 7, 0, Math.PI * 2);
  ctx.arc(-12, -28, 7, 0, Math.PI * 2);
  ctx.arc(-4, -33, 7, 0, Math.PI * 2);
  ctx.arc(6, -33, 7, 0, Math.PI * 2);
  ctx.arc(13, -28, 7, 0, Math.PI * 2);
  ctx.arc(14, -20, 7, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-3, -19, 2, 0, Math.PI * 2);
  ctx.arc(5, -19, 2, 0, Math.PI * 2);
  ctx.fill();

  // Determined mouth
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(1, -14, 3.5, 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Warm pink winter mittens
  ctx.fillStyle = '#F472B6';
  ctx.beginPath();
  ctx.ellipse(12, 10, 5, 6, 0.2, 0, Math.PI * 2);
  ctx.ellipse(-12, 10, 5, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Boots
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-5, 25 + legOffset, 5, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(5, 25 - legOffset, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw Schroeder
export function drawSchroeder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facing: 'left' | 'right',
  frame: number,
  isGrounded: boolean,
  isDancing: boolean
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') ctx.scale(-1, 1);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const legOffset = isGrounded ? Math.sin(frame * 0.3) * 6 : 0;

  // Purple & Black Striped Sweater
  ctx.fillStyle = '#7C3AED';
  ctx.beginPath();
  ctx.roundRect(-13, -3, 26, 23, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1E293B';
  ctx.fillRect(-13, 3, 26, 4);
  ctx.fillRect(-13, 12, 26, 4);

  // Head
  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(0, -18, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Blonde Swept Hair
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(0, -26, 11, Math.PI * 0.9, Math.PI * 2.1);
  ctx.quadraticCurveTo(8, -32, -6, -34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Face
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(-3, -19, 2, 0, Math.PI * 2);
  ctx.arc(5, -19, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(1, -15, 3, 0.2, Math.PI * 0.8);
  ctx.stroke();

  // Boots
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(-6, 24 + legOffset, 6, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 24 - legOffset, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw Woodstock and his flock of tiny yellow bird friends!
export function drawWoodstockFlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
) {
  // Lead Woodstock
  drawWoodstock(ctx, x, y, frame);
  // Bird Friend 1 (Bill) - trailing top-left with blue earmuffs
  ctx.save();
  ctx.translate(x - 24, y - 16 + Math.sin(frame * 0.16 + 1) * 5);
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38BDF8'; // Blue earmuffs
  ctx.beginPath();
  ctx.arc(4, -4, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Bird Friend 2 (Conrad) - trailing top-right with green scarf
  ctx.save();
  ctx.translate(x - 14, y + 18 + Math.sin(frame * 0.14 + 2) * 4);
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 4, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10B981'; // Green scarf
  ctx.fillRect(1, -1, 5, 2);
  ctx.restore();
}

// Draw authentic Peanuts comic speech bubble
export function drawPeanutsSpeechBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  targetX: number,
  targetY: number,
  color: string = '#FFFFFF'
) {
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  const metrics = ctx.measureText(text);
  const bubbleWidth = metrics.width + 16;
  const bubbleHeight = 24;
  const bubbleX = targetX - bubbleWidth / 2;
  const bubbleY = targetY - bubbleHeight - 14;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1E293B';
  ctx.fillStyle = color;

  // Bubble Box
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 6);
  ctx.fill();
  ctx.stroke();

  // Bubble Tail pointing to character
  ctx.beginPath();
  ctx.moveTo(targetX - 4, bubbleY + bubbleHeight);
  ctx.lineTo(targetX, bubbleY + bubbleHeight + 8);
  ctx.lineTo(targetX + 6, bubbleY + bubbleHeight);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text inside bubble
  ctx.fillStyle = '#1E293B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, targetX, bubbleY + bubbleHeight / 2);

  ctx.restore();
}

function drawHolidayHat(ctx: CanvasRenderingContext2D, hatId: string, frame: number) {
  if (hatId.includes('hat_1')) {
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(0, -32, 14, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(-15, -34, 30, 6, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, -47, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (hatId.includes('hat_2')) {
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(-15, -32);
    ctx.quadraticCurveTo(8, -48, 18, -34);
    ctx.lineTo(12, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(-16, -34, 32, 6, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(20, -32, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (hatId.includes('hat_3')) {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(-14, -32);
    ctx.lineTo(-12, -45);
    ctx.lineTo(-6, -38);
    ctx.lineTo(0, -48);
    ctx.lineTo(6, -38);
    ctx.lineTo(12, -45);
    ctx.lineTo(14, -32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const colors = ['#EF4444', '#10B981', '#3B82F6'];
    colors.forEach((col, idx) => {
      ctx.fillStyle = colors[(idx + Math.floor(frame / 8)) % colors.length];
      ctx.beginPath();
      ctx.arc(-8 + idx * 8, -36, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function drawFeetAndMitts(
  ctx: CanvasRenderingContext2D,
  legOffset: number,
  isDancing: boolean,
  mittsId: string
) {
  let mittColor = '#CBD5E1';
  if (mittsId.includes('mitts_1')) mittColor = '#EF4444';
  if (mittsId.includes('mitts_2')) mittColor = '#3B82F6';
  if (mittsId.includes('mitts_3')) mittColor = '#F59E0B';

  ctx.fillStyle = mittColor;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#1E293B';

  const armFlap = isDancing ? Math.sin(legOffset) * 8 : 0;

  ctx.beginPath();
  ctx.ellipse(12, 10 + armFlap, 6, 7, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(16, 8 + armFlap, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(-10, 10 - armFlap, 5, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(-6, 24 + legOffset, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(6, 24 - legOffset, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

// Woodstock flying alongside
export function drawWoodstock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number
) {
  ctx.save();
  ctx.translate(x, y + Math.sin(frame * 0.15) * 4);

  const wingFlap = Math.sin(frame * 0.4) * 0.6;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1E293B';
  ctx.fillStyle = '#FACC15';

  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(5, -4, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(9, -4);
  ctx.lineTo(13, -3);
  ctx.lineTo(8, -1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(6, -5, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(3, -8);
  ctx.lineTo(3, -11);
  ctx.moveTo(5, -8);
  ctx.lineTo(6, -12);
  ctx.moveTo(7, -8);
  ctx.lineTo(9, -11);
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.roundRect(1, -2, 6, 2.5, 1);
  ctx.fill();

  ctx.save();
  ctx.translate(-2, -1);
  ctx.rotate(wingFlap);
  ctx.fillStyle = '#EAB308';
  ctx.beginPath();
  ctx.ellipse(0, -3, 3, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// Draw Zombie Snowman Enemy
export function drawZombieSnowman(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number
) {
  const { x, y, width, height, facing, hp, maxHp } = enemy;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') ctx.scale(-1, 1);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';

  // Icy pale greenish-blue snow tint for Zombie Snowman!
  ctx.fillStyle = '#E0F2FE';
  if (enemy.state === 'hurt') ctx.fillStyle = '#FCA5A5';

  // Bottom body
  ctx.beginPath();
  ctx.arc(0, 12, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(0, -14, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Zombie Eyes (Neon Yellow / Red)
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(4, -16, 3, 0, Math.PI * 2);
  ctx.arc(10, -16, 2, 0, Math.PI * 2);
  ctx.fill();

  // Twisted crooked carrot nose
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(6, -12);
  ctx.lineTo(24, -9);
  ctx.lineTo(6, -7);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Jagged creepy stitched mouth
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, -4);
  ctx.lineTo(6, -2);
  ctx.lineTo(10, -5);
  ctx.lineTo(14, -2);
  ctx.stroke();

  // Tree twig arms raised menacingly!
  const armFlap = Math.sin(time * 0.008) * 4;
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(12, 4);
  ctx.lineTo(24, -8 + armFlap);
  ctx.lineTo(30, -6 + armFlap);
  ctx.stroke();

  // Tattered black top hat
  ctx.fillStyle = '#334155';
  ctx.fillRect(-12, -28, 24, 4);
  ctx.fillRect(-8, -38, 16, 10);
  ctx.strokeRect(-8, -38, 16, 10);

  // Health Bar above enemy
  ctx.restore();
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x, y - 14, width, 5);
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(x, y - 14, (width * Math.max(0, hp)) / maxHp, 5);
  ctx.restore();
}

// Draw Blizzard Ghoul Enemy
export function drawBlizzardGhoul(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number
) {
  const { x, y, width, height, facing, hp, maxHp } = enemy;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  if (facing === 'left') ctx.scale(-1, 1);

  const hover = Math.sin(time * 0.006) * 6;
  ctx.translate(0, hover);

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#1E293B';
  ctx.fillStyle = '#BFDBFE';

  // Wispy ghost body
  ctx.beginPath();
  ctx.moveTo(-16, -16);
  ctx.quadraticCurveTo(0, -28, 16, -16);
  ctx.lineTo(16, 10);
  ctx.quadraticCurveTo(8, 24, 0, 16);
  ctx.quadraticCurveTo(-8, 24, -16, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Menacing glowing ice eyes
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.arc(4, -10, 4, 0, Math.PI * 2);
  ctx.arc(12, -10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Frost breath
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(18, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Health Bar
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x, y - 14, width, 5);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(x, y - 14, (width * Math.max(0, hp)) / maxHp, 5);
  ctx.restore();
}

// Draw Frost Bat
export function drawFrostBat(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number
) {
  const { x, y, width, height, hp, maxHp } = enemy;
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);

  const wingFlap = Math.sin(time * 0.012) * 12;

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#1E293B';
  ctx.fillStyle = '#64748B';

  // Bat body
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing eyes
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(-2, -2, 1.5, 0, Math.PI * 2);
  ctx.arc(2, -2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Spiky icy wings
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(-6, 0);
  ctx.lineTo(-20, -10 + wingFlap);
  ctx.lineTo(-14, 4 + wingFlap * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(20, -10 + wingFlap);
  ctx.lineTo(14, 4 + wingFlap * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Health bar
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x, y - 10, width, 4);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(x, y - 10, (width * Math.max(0, hp)) / maxHp, 4);
  ctx.restore();
}

// Draw Snowball / Projectile
export function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.type === 'snowball') {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1E293B';
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snow sparkle
    ctx.fillStyle = '#BAE6FD';
    ctx.beginPath();
    ctx.arc(-2, -2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.type === 'peppermint_star') {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Draw Cold Sugar Cookie (Dropped by zombies or found on board)
export function drawColdCookie(ctx: CanvasRenderingContext2D, c: ColdCookie, time: number) {
  if (c.collected) return;
  const floatY = Math.sin(time * 0.005 + c.floatOffset) * 4;
  ctx.save();
  ctx.translate(c.x, c.y + floatY);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#78350F';
  // Golden baked sugar cookie with white winter frosting!
  ctx.fillStyle = '#FDE68A';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White snowflake frosting
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  // Blue / red sprinkles
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(-3, -3, 2, 2);
  ctx.fillRect(2, 2, 2, 2);
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(2, -3, 2, 2);
  ctx.fillRect(-3, 2, 2, 2);

  ctx.restore();
}

// Draw Campfire Platform
export function drawCampfire(ctx: CanvasRenderingContext2D, p: Platform, time: number) {
  const { x, y, width, height } = p;
  ctx.save();

  // Wooden logs
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#1E293B';
  ctx.fillStyle = '#78350F';

  ctx.fillRect(x + 10, y + height - 14, width - 20, 8);
  ctx.strokeRect(x + 10, y + height - 14, width - 20, 8);

  // Warm campfire stones
  ctx.fillStyle = '#64748B';
  for (let s = x + 6; s <= x + width - 6; s += 10) {
    ctx.beginPath();
    ctx.arc(s, y + height - 6, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Animated Dancing Flame!
  const flicker = Math.sin(time * 0.015) * 4;
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.moveTo(x + 14, y + height - 12);
  ctx.quadraticCurveTo(x + width / 2, y + flicker, x + width - 14, y + height - 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.moveTo(x + 18, y + height - 12);
  ctx.quadraticCurveTo(x + width / 2, y + 8 + flicker, x + width - 18, y + height - 12);
  ctx.closePath();
  ctx.fill();

  // Warmth Aura Glow!
  ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, 45, 0, Math.PI * 2);
  ctx.fill();

  // "WARMTH +100%" sign
  ctx.fillStyle = '#B45309';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HOT COCOA & WARMTH', x + width / 2, y - 6);

  ctx.restore();
}

// Draw Snoopy's Decorated Red Doghouse
export function drawDoghouse(
  ctx: CanvasRenderingContext2D,
  platform: Platform,
  time: number
) {
  const { x, y, width, height } = platform;

  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';
  ctx.lineJoin = 'round';

  ctx.fillStyle = '#DC2626';
  ctx.fillRect(x + 10, y + 30, width - 20, height - 30);
  ctx.strokeRect(x + 10, y + 30, width - 20, height - 30);

  ctx.strokeStyle = '#B91C1C';
  ctx.lineWidth = 2;
  for (let py = y + 55; py < y + height - 10; py += 25) {
    ctx.beginPath();
    ctx.moveTo(x + 12, py);
    ctx.lineTo(x + width - 12, py);
    ctx.stroke();
  }

  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height - 25, 20, Math.PI, 0);
  ctx.lineTo(x + width / 2 + 20, y + height);
  ctx.lineTo(x + width / 2 - 20, y + height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#EF4444';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 32);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width, y + 32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 32);
  ctx.lineTo(x + width / 2, y - 4);
  ctx.lineTo(x + width + 4, y + 32);
  ctx.quadraticCurveTo(x + width - 10, y + 36, x + width / 2, y + 8);
  ctx.quadraticCurveTo(x + 10, y + 36, x - 4, y + 32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const bulbColors = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'];
  const bulbCount = 8;
  const tSec = time * 0.003;

  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 36);
  ctx.quadraticCurveTo(x + width / 2, y + 46, x + width - 4, y + 36);
  ctx.stroke();

  for (let i = 0; i < bulbCount; i++) {
    const ratio = (i + 0.5) / bulbCount;
    const bx = x + 10 + ratio * (width - 20);
    const by = y + 36 + Math.sin(ratio * Math.PI) * 8;
    const colorIndex = (i + Math.floor(tSec * 2)) % bulbColors.length;

    ctx.fillStyle = bulbColors[colorIndex];
    ctx.beginPath();
    ctx.ellipse(bx, by, 3.5, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(bx - 1, by - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw Schroeder's Piano
export function drawPiano(ctx: CanvasRenderingContext2D, p: Platform, time: number) {
  const { x, y, width, height } = p;
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';

  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.roundRect(x, y + 10, width, height - 10, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 10, y + 12, width - 20, 16);
  ctx.strokeRect(x + 10, y + 12, width - 20, 16);

  ctx.fillStyle = '#1E293B';
  const keyWidth = 10;
  for (let kx = x + 18; kx < x + width - 20; kx += keyWidth * 1.5) {
    ctx.fillRect(kx, y + 12, 6, 10);
  }

  const noteOffset = Math.sin(time * 0.004) * 6;
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('♫', x + width / 2 - 12, y - 4 + noteOffset);
  ctx.fillText('♪', x + width / 2 + 8, y - 8 - noteOffset);

  ctx.restore();
}

// Draw Lucy's Booth
export function drawBooth(ctx: CanvasRenderingContext2D, p: Platform) {
  const { x, y, width, height } = p;
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E293B';

  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(x, y + 30, width, height - 30);
  ctx.strokeRect(x, y + 30, width, height - 30);

  ctx.fillStyle = '#B45309';
  ctx.fillRect(x - 5, y + 20, width + 10, 14);
  ctx.strokeRect(x - 5, y + 20, width + 10, 14);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 10, y, width - 20, 24);
  ctx.strokeRect(x + 10, y, width - 20, 24);

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PSYCHIATRIC HELP', x + width / 2, y + 11);
  ctx.fillText('5¢ · THE DOCTOR IS IN', x + width / 2, y + 21);

  ctx.restore();
}

// Draw Charlie Brown's Legendary Little Christmas Tree
export function drawCharlieTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#78350F';

  // Thin drooping trunk
  ctx.beginPath();
  ctx.moveTo(x, y + 60);
  ctx.lineTo(x + 2, y + 30);
  ctx.quadraticCurveTo(x + 8, y + 15, x + 24, y + 22);
  ctx.stroke();

  // Drooping side twigs
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 42);
  ctx.lineTo(x - 14, y + 34);
  ctx.moveTo(x + 2, y + 35);
  ctx.lineTo(x + 16, y + 30);
  ctx.stroke();

  // Sparse green pine needles
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 14, y + 34);
  ctx.lineTo(x - 22, y + 32);
  ctx.moveTo(x + 16, y + 30);
  ctx.lineTo(x + 24, y + 28);
  ctx.moveTo(x + 24, y + 22);
  ctx.lineTo(x + 28, y + 24);
  ctx.stroke();

  // The Iconic Single Red Shiny Bulb that makes the tree droop!
  ctx.fillStyle = '#DC2626';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 24, y + 32, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Specular shine on bulb
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + 22, y + 30, 2, 0, Math.PI * 2);
  ctx.fill();

  // Blue blanket wrap around base (Linus' blanket!)
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.ellipse(x, y + 62, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Draw Coins and Collectibles
export function drawCoin(ctx: CanvasRenderingContext2D, coin: Coin, time: number) {
  if (coin.collected) return;

  const floatY = Math.sin(time * 0.005 + coin.floatOffset) * 5;
  const x = coin.x;
  const y = coin.y + floatY;

  ctx.save();
  ctx.translate(x, y);

  if (coin.type === 'coin') {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#92400E';
    ctx.fillStyle = '#FBBF24';

    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 0, 0.5);

    ctx.fillStyle = '#FFFBEB';
    ctx.beginPath();
    ctx.arc(-3, -3, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (coin.type === 'bone') {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1E293B';
    ctx.fillStyle = '#F8FAFC';

    ctx.fillRect(-8, -3, 16, 6);
    ctx.strokeRect(-8, -3, 16, 6);

    ctx.beginPath();
    ctx.arc(-8, -4, 4, 0, Math.PI * 2);
    ctx.arc(-8, 4, 4, 0, Math.PI * 2);
    ctx.arc(8, -4, 4, 0, Math.PI * 2);
    ctx.arc(8, 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (coin.type === 'candy') {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#1E293B';
    ctx.fillStyle = '#FFFFFF';

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#EF4444';
    for (let a = 0; a < 4; a++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 9, a * Math.PI * 0.5, a * Math.PI * 0.5 + 0.4);
      ctx.closePath();
      ctx.fill();
    }
  } else if (coin.type === 'star') {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#B45309';
    ctx.fillStyle = '#F59E0B';

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerA = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const innerA = outerA + (2 * Math.PI) / 10;
      if (i === 0) ctx.moveTo(Math.cos(outerA) * 14, Math.sin(outerA) * 14);
      else ctx.lineTo(Math.cos(outerA) * 14, Math.sin(outerA) * 14);
      ctx.lineTo(Math.cos(innerA) * 6, Math.sin(innerA) * 6);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
