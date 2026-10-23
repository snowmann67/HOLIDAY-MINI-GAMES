import { LevelConfig, Platform, Coin, Obstacle, Enemy, ColdCookie } from './types';

function createBackyardLevel(): LevelConfig {
  const width = 2400;
  const height = 700;

  const platforms: Platform[] = [
    { x: 0, y: 620, width: 2400, height: 80, type: 'snow' },
    { x: 260, y: 520, width: 180, height: 30, type: 'snow' },
    { x: 500, y: 440, width: 200, height: 30, type: 'snow' },
    // Campfire to warm up!
    { x: 740, y: 570, width: 60, height: 50, type: 'campfire' },
    // Snoopy's Doghouse platform
    { x: 840, y: 480, width: 140, height: 140, type: 'doghouse' },
    { x: 1040, y: 420, width: 180, height: 26, type: 'wood' },
    { x: 1260, y: 360, width: 160, height: 26, type: 'wood' },
    // Lucy's 5 cent booth
    { x: 1500, y: 460, width: 150, height: 160, type: 'booth' },
    // Second campfire
    { x: 1700, y: 570, width: 60, height: 50, type: 'campfire' },
    { x: 1820, y: 380, width: 200, height: 30, type: 'snow' },
    { x: 2050, y: 440, width: 180, height: 30, type: 'snow' },
    // Goal doghouse
    { x: 2220, y: 480, width: 150, height: 140, type: 'doghouse' },
  ];

  const coins: Coin[] = [];
  for (let i = 0; i < 6; i++) {
    coins.push({ id: `c_start_${i}`, x: 140 + i * 40, y: 560 - Math.sin((i / 5) * Math.PI) * 50, type: 'coin', value: 1, collected: false, floatOffset: i * 0.4 });
  }
  for (let i = 0; i < 5; i++) {
    coins.push({ id: `c_hill1_${i}`, x: 280 + i * 35, y: 460, type: 'coin', value: 1, collected: false, floatOffset: i * 0.3 });
  }
  coins.push({ id: 'bone_1', x: 910, y: 380, type: 'bone', value: 5, collected: false, floatOffset: 0 });
  coins.push({ id: 'star_1', x: 1340, y: 280, type: 'star', value: 10, collected: false, floatOffset: 0.5 });
  coins.push({ id: 'candy_1', x: 1570, y: 390, type: 'candy', value: 3, collected: false, floatOffset: 0.8 });

  for (let i = 0; i < 7; i++) {
    coins.push({ id: `c_fence_${i}`, x: 1060 + i * 55, y: 360 - Math.sin((i / 6) * Math.PI) * 60, type: 'coin', value: 1, collected: false, floatOffset: i * 0.2 });
  }
  for (let i = 0; i < 6; i++) {
    coins.push({ id: `c_end_${i}`, x: 1840 + i * 40, y: 330, type: 'coin', value: 1, collected: false, floatOffset: i * 0.3 });
  }
  coins.push({ id: 'bone_2', x: 2130, y: 370, type: 'bone', value: 5, collected: false, floatOffset: 0 });
  coins.push({ id: 'star_end', x: 2295, y: 400, type: 'star', value: 10, collected: false, floatOffset: 0.7 });

  const cookies: ColdCookie[] = [
    { id: 'cookie_1', x: 400, y: 580, collected: false, exp: 20, floatOffset: 0.2 },
    { id: 'cookie_2', x: 1140, y: 370, collected: false, exp: 25, floatOffset: 0.7 },
    { id: 'cookie_3', x: 1900, y: 330, collected: false, exp: 30, floatOffset: 0.4 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'zombie_1',
      x: 600,
      y: 560,
      vx: 1.2,
      vy: 0,
      width: 44,
      height: 60,
      hp: 30,
      maxHp: 30,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 450,
      patrolMaxX: 720,
      expReward: 35,
      cookieReward: 1,
    },
    {
      id: 'zombie_2',
      x: 1350,
      y: 560,
      vx: -1.4,
      vy: 0,
      width: 44,
      height: 60,
      hp: 35,
      maxHp: 35,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1200,
      patrolMaxX: 1480,
      expReward: 40,
      cookieReward: 1,
    },
    {
      id: 'zombie_3',
      x: 1950,
      y: 560,
      vx: 1.5,
      vy: 0,
      width: 44,
      height: 60,
      hp: 40,
      maxHp: 40,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 1800,
      patrolMaxX: 2150,
      expReward: 45,
      cookieReward: 2,
    },
  ];

  const obstacles: Obstacle[] = [];

  return {
    id: 1,
    name: "Snoopy's Snowy Backyard",
    subtitle: 'Awaken Snoopy, toss snowballs at Zombie Snowmen & collect Cold Cookies!',
    theme: 'backyard',
    targetCoins: 25,
    targetZombies: 2,
    description: 'A frosty breeze has turned the yard snowmen into funny Zombie Snowmen! Toss snowballs (Space / Throw button) to smash them and gather Cold Cookies to level up!',
    width,
    height,
    spawnX: 80,
    spawnY: 530,
    goalX: 2295,
    goalY: 480,
    platforms,
    coins,
    obstacles,
    enemies,
    cookies,
    specialFeature: "Snoopy's Decorated Doghouse · Warmth Campfires · First Zombie Snowmen",
    snowDensity: 40,
    iceMultiplier: 1.0,
    blizzardColdRate: 0.8, // Gentle cold
    ambientColor: '#E2E8F0',
  };
}

function createSkatingPondLevel(): LevelConfig {
  const width = 2800;
  const height = 700;

  const platforms: Platform[] = [
    { x: 0, y: 620, width: 500, height: 80, type: 'snow' },
    { x: 500, y: 620, width: 900, height: 80, type: 'ice' },
    { x: 1400, y: 620, width: 300, height: 80, type: 'snow' },
    // Campfire at pond shore
    { x: 1480, y: 570, width: 60, height: 50, type: 'campfire' },
    { x: 1700, y: 620, width: 800, height: 80, type: 'ice' },
    { x: 2500, y: 620, width: 300, height: 80, type: 'snow' },

    { x: 380, y: 500, width: 140, height: 25, type: 'ice' },
    { x: 620, y: 420, width: 160, height: 25, type: 'ice' },
    { x: 880, y: 350, width: 180, height: 25, type: 'ice' },

    // Schroeder's Toy Piano platform!
    { x: 1150, y: 440, width: 180, height: 50, type: 'piano', isSpring: true },

    { x: 1680, y: 400, width: 180, height: 25, type: 'ice' },
    { x: 1940, y: 340, width: 170, height: 25, type: 'ice' },
    { x: 2200, y: 420, width: 180, height: 25, type: 'ice' },
    { x: 2600, y: 500, width: 150, height: 120, type: 'doghouse' },
  ];

  const coins: Coin[] = [];
  for (let i = 0; i < 10; i++) {
    coins.push({ id: `pond1_${i}`, x: 550 + i * 80, y: 560, type: 'coin', value: 1, collected: false, floatOffset: i * 0.2 });
  }
  for (let i = 0; i < 4; i++) {
    coins.push({ id: `floe1_${i}`, x: 640 + i * 40, y: 360, type: 'coin', value: 1, collected: false, floatOffset: i * 0.5 });
  }
  coins.push({ id: 'piano_star', x: 1240, y: 280, type: 'star', value: 15, collected: false, floatOffset: 0 });
  coins.push({ id: 'bone_skate', x: 970, y: 290, type: 'bone', value: 5, collected: false, floatOffset: 0.3 });

  for (let i = 0; i < 8; i++) {
    coins.push({ id: `pond2_${i}`, x: 1750 + i * 80, y: 560, type: 'coin', value: 1, collected: false, floatOffset: i * 0.4 });
  }
  for (let i = 0; i < 5; i++) {
    coins.push({ id: `ice_high_${i}`, x: 1960 + i * 50, y: 280 - Math.sin((i / 4) * Math.PI) * 40, type: 'coin', value: 2, collected: false, floatOffset: i * 0.2 });
  }
  coins.push({ id: 'candy_skate', x: 2290, y: 360, type: 'candy', value: 4, collected: false, floatOffset: 0.9 });
  coins.push({ id: 'goal_star_2', x: 2675, y: 420, type: 'star', value: 10, collected: false, floatOffset: 0.1 });

  const cookies: ColdCookie[] = [
    { id: 'cookie_pond_1', x: 800, y: 580, collected: false, exp: 35, floatOffset: 0.3 },
    { id: 'cookie_pond_2', x: 1240, y: 380, collected: false, exp: 45, floatOffset: 0.5 },
    { id: 'cookie_pond_3', x: 2100, y: 580, collected: false, exp: 35, floatOffset: 0.1 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'pond_ghoul_1',
      x: 750,
      y: 560,
      vx: 1.8,
      vy: 0,
      width: 44,
      height: 60,
      hp: 45,
      maxHp: 45,
      type: 'blizzard_ghoul',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 600,
      patrolMaxX: 950,
      expReward: 50,
      cookieReward: 2,
    },
    {
      id: 'pond_bat_1',
      x: 1050,
      y: 320,
      vx: 2.2,
      vy: 0,
      width: 38,
      height: 38,
      hp: 25,
      maxHp: 25,
      type: 'frost_bat',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 950,
      patrolMaxX: 1200,
      expReward: 40,
      cookieReward: 1,
    },
    {
      id: 'pond_ghoul_2',
      x: 1950,
      y: 560,
      vx: -1.6,
      vy: 0,
      width: 44,
      height: 60,
      hp: 50,
      maxHp: 50,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1800,
      patrolMaxX: 2200,
      expReward: 55,
      cookieReward: 2,
    },
  ];

  return {
    id: 2,
    name: 'The Frozen Skating Pond',
    subtitle: 'Slide past Frost Ghouls & bounce on Schroeder’s musical piano!',
    theme: 'skating_pond',
    targetCoins: 35,
    targetZombies: 3,
    description: 'The pond ice is slick and cold! Defeat the Frost Ghouls gliding on skates and warm up by the cozy shore campfire.',
    width,
    height,
    spawnX: 80,
    spawnY: 530,
    goalX: 2675,
    goalY: 500,
    platforms,
    coins,
    obstacles: [],
    enemies,
    cookies,
    specialFeature: 'Super Slippery Ice Mechanics · Schroeder Spring Piano · Frost Ghouls',
    snowDensity: 60,
    iceMultiplier: 0.25,
    blizzardColdRate: 1.2,
    ambientColor: '#DBEAFE',
  };
}

function createNeighborhoodLevel(): LevelConfig {
  const width = 3000;
  const height = 700;

  const platforms: Platform[] = [
    { x: 0, y: 620, width: 3000, height: 80, type: 'snow' },
    { x: 300, y: 480, width: 140, height: 25, type: 'wood' },
    { x: 520, y: 400, width: 160, height: 25, type: 'wood' },
    { x: 760, y: 320, width: 180, height: 25, type: 'wood' },
    // Campfire on rooftop
    { x: 1040, y: 370, width: 60, height: 50, type: 'campfire' },
    { x: 1020, y: 420, width: 220, height: 40, type: 'snow' },
    { x: 1320, y: 360, width: 180, height: 30, type: 'wood' },
    { x: 1580, y: 450, width: 160, height: 30, type: 'snow' },
    { x: 1820, y: 320, width: 200, height: 25, type: 'wood' },
    { x: 2100, y: 260, width: 180, height: 25, type: 'wood' },
    // Campfire near end
    { x: 2380, y: 370, width: 60, height: 50, type: 'campfire' },
    { x: 2360, y: 420, width: 180, height: 30, type: 'snow' },
    { x: 2620, y: 480, width: 180, height: 30, type: 'wood' },
    { x: 2850, y: 500, width: 140, height: 120, type: 'doghouse' },
  ];

  const coins: Coin[] = [];
  for (let i = 0; i < 8; i++) {
    coins.push({ id: `c_neigh_${i}`, x: 100 + i * 50, y: 550, type: 'coin', value: 1, collected: false, floatOffset: i * 0.1 });
  }
  for (let i = 0; i < 5; i++) {
    coins.push({ id: `c_fence3_${i}`, x: 320 + i * 40, y: 420, type: 'coin', value: 1, collected: false, floatOffset: i * 0.3 });
  }
  coins.push({ id: 'bone_roof', x: 1140, y: 350, type: 'bone', value: 5, collected: false, floatOffset: 0 });
  coins.push({ id: 'star_roof', x: 1410, y: 280, type: 'star', value: 12, collected: false, floatOffset: 0.5 });

  for (let i = 0; i < 6; i++) {
    coins.push({ id: `c_wire_${i}`, x: 1840 + i * 35, y: 260, type: 'coin', value: 2, collected: false, floatOffset: i * 0.2 });
  }
  coins.push({ id: 'star_high', x: 2190, y: 190, type: 'star', value: 15, collected: false, floatOffset: 0.8 });
  coins.push({ id: 'candy_neigh', x: 2450, y: 350, type: 'candy', value: 4, collected: false, floatOffset: 0.4 });
  coins.push({ id: 'goal_star_3', x: 2920, y: 420, type: 'star', value: 10, collected: false, floatOffset: 0 });

  const cookies: ColdCookie[] = [
    { id: 'cookie_n1', x: 600, y: 340, collected: false, exp: 40, floatOffset: 0.4 },
    { id: 'cookie_n2', x: 1650, y: 390, collected: false, exp: 50, floatOffset: 0.2 },
    { id: 'cookie_n3', x: 2200, y: 200, collected: false, exp: 60, floatOffset: 0.6 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'zombie_n1',
      x: 900,
      y: 560,
      vx: 1.5,
      vy: 0,
      width: 44,
      height: 60,
      hp: 55,
      maxHp: 55,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 700,
      patrolMaxX: 1100,
      expReward: 60,
      cookieReward: 2,
    },
    {
      id: 'bat_n1',
      x: 1400,
      y: 280,
      vx: 2.0,
      vy: 0,
      width: 38,
      height: 38,
      hp: 30,
      maxHp: 30,
      type: 'frost_bat',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 1300,
      patrolMaxX: 1600,
      expReward: 45,
      cookieReward: 1,
    },
    {
      id: 'zombie_n2',
      x: 2000,
      y: 560,
      vx: -1.7,
      vy: 0,
      width: 44,
      height: 60,
      hp: 65,
      maxHp: 65,
      type: 'blizzard_ghoul',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1800,
      patrolMaxX: 2250,
      expReward: 70,
      cookieReward: 3,
    },
    {
      id: 'zombie_n3',
      x: 2600,
      y: 560,
      vx: 1.8,
      vy: 0,
      width: 44,
      height: 60,
      hp: 60,
      maxHp: 60,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 2450,
      patrolMaxX: 2800,
      expReward: 65,
      cookieReward: 2,
    },
  ];

  return {
    id: 3,
    name: 'Neighborhood Pine Fences',
    subtitle: 'Hop along rooftops & protect Charlie Brown’s friends from the snow invasion!',
    theme: 'neighborhood',
    targetCoins: 45,
    targetZombies: 4,
    description: 'Zombie Snowmen are climbing over the neighborhood fences! Blast them from above and use rooftop chimneys and campfires to stay toasty.',
    width,
    height,
    spawnX: 80,
    spawnY: 530,
    goalX: 2920,
    goalY: 500,
    platforms,
    coins,
    obstacles: [],
    enemies,
    cookies,
    specialFeature: 'Multi-tiered Rooftop Leaps · High Holiday Lights · Flying Frost Bats',
    snowDensity: 55,
    iceMultiplier: 0.8,
    blizzardColdRate: 1.5,
    ambientColor: '#E0E7FF',
  };
}

function createTreeLotLevel(): LevelConfig {
  const width = 3200;
  const height = 700;

  const platforms: Platform[] = [
    { x: 0, y: 620, width: 3200, height: 80, type: 'snow' },
    { x: 300, y: 500, width: 150, height: 30, type: 'branch' },
    { x: 550, y: 420, width: 170, height: 30, type: 'branch' },
    // Campfire
    { x: 740, y: 570, width: 60, height: 50, type: 'campfire' },
    { x: 800, y: 340, width: 190, height: 30, type: 'branch' },
    { x: 1100, y: 440, width: 160, height: 180, type: 'booth' },
    { x: 1350, y: 380, width: 180, height: 30, type: 'wood' },
    { x: 1620, y: 300, width: 190, height: 30, type: 'wood' },
    // Campfire midway
    { x: 1760, y: 570, width: 60, height: 50, type: 'campfire' },
    { x: 1900, y: 400, width: 170, height: 30, type: 'branch' },
    { x: 2160, y: 320, width: 180, height: 30, type: 'branch' },
    { x: 2420, y: 420, width: 200, height: 30, type: 'snow' },
    { x: 2700, y: 360, width: 180, height: 30, type: 'branch' },
    // Charlie Brown's beloved little tree!
    { x: 3000, y: 480, width: 160, height: 140, type: 'doghouse' },
  ];

  const coins: Coin[] = [];
  for (let i = 0; i < 10; i++) {
    coins.push({ id: `tree_ground_${i}`, x: 100 + i * 60, y: 560, type: 'coin', value: 1, collected: false, floatOffset: i * 0.1 });
  }
  for (let i = 0; i < 4; i++) {
    coins.push({ id: `branch1_${i}`, x: 570 + i * 40, y: 360, type: 'coin', value: 2, collected: false, floatOffset: i * 0.4 });
  }
  coins.push({ id: 'star_branch', x: 895, y: 260, type: 'star', value: 15, collected: false, floatOffset: 0 });
  coins.push({ id: 'bone_lot', x: 1180, y: 360, type: 'bone', value: 8, collected: false, floatOffset: 0.6 });

  for (let i = 0; i < 6; i++) {
    coins.push({ id: `alum_${i}`, x: 1640 + i * 35, y: 240, type: 'coin', value: 2, collected: false, floatOffset: i * 0.2 });
  }
  coins.push({ id: 'star_alum', x: 2250, y: 240, type: 'star', value: 20, collected: false, floatOffset: 0.3 });
  coins.push({ id: 'candy_lot', x: 2520, y: 350, type: 'candy', value: 5, collected: false, floatOffset: 0.7 });
  coins.push({ id: 'star_charlie_tree', x: 3080, y: 390, type: 'star', value: 25, collected: false, floatOffset: 0 });

  const cookies: ColdCookie[] = [
    { id: 'cookie_t1', x: 620, y: 370, collected: false, exp: 50, floatOffset: 0.1 },
    { id: 'cookie_t2', x: 1450, y: 330, collected: false, exp: 60, floatOffset: 0.5 },
    { id: 'cookie_t3', x: 2200, y: 270, collected: false, exp: 75, floatOffset: 0.3 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'zombie_t1',
      x: 950,
      y: 560,
      vx: 1.6,
      vy: 0,
      width: 44,
      height: 60,
      hp: 75,
      maxHp: 75,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 820,
      patrolMaxX: 1120,
      expReward: 75,
      cookieReward: 3,
    },
    {
      id: 'ghoul_t1',
      x: 1500,
      y: 560,
      vx: -1.9,
      vy: 0,
      width: 44,
      height: 60,
      hp: 85,
      maxHp: 85,
      type: 'blizzard_ghoul',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1350,
      patrolMaxX: 1700,
      expReward: 85,
      cookieReward: 4,
    },
    {
      id: 'bat_t1',
      x: 2050,
      y: 280,
      vx: 2.2,
      vy: 0,
      width: 38,
      height: 38,
      hp: 35,
      maxHp: 35,
      type: 'frost_bat',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1950,
      patrolMaxX: 2250,
      expReward: 60,
      cookieReward: 2,
    },
    {
      id: 'zombie_t2',
      x: 2600,
      y: 560,
      vx: 2.0,
      vy: 0,
      width: 44,
      height: 60,
      hp: 90,
      maxHp: 90,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 2400,
      patrolMaxX: 2850,
      expReward: 90,
      cookieReward: 4,
    },
  ];

  return {
    id: 4,
    name: "Charlie Brown's Tree Lot",
    subtitle: 'Rescue the little Christmas tree surrounded by Zombie Snowmen!',
    theme: 'tree_lot',
    targetCoins: 55,
    targetZombies: 4,
    description: "Search past the flashing pink aluminum trees to liberate Charlie Brown's humble, wonderful little Christmas tree!",
    width,
    height,
    spawnX: 80,
    spawnY: 530,
    goalX: 3080,
    goalY: 480,
    platforms,
    coins,
    obstacles: [],
    enemies,
    cookies,
    specialFeature: 'The Little Charlie Brown Christmas Tree · Cold Cookies Bonanza',
    snowDensity: 70,
    iceMultiplier: 0.9,
    blizzardColdRate: 2.0,
    ambientColor: '#FEF3C7',
  };
}

function createBlizzardPeakLevel(): LevelConfig {
  const width = 3600;
  const height = 700;

  const platforms: Platform[] = [
    { x: 0, y: 620, width: 3600, height: 80, type: 'snow' },
    { x: 300, y: 480, width: 220, height: 40, type: 'wood' },
    { x: 600, y: 380, width: 200, height: 35, type: 'piano', isSpring: true },
    // Blizzard shelter campfire
    { x: 880, y: 570, width: 60, height: 50, type: 'campfire' },
    { x: 900, y: 300, width: 240, height: 35, type: 'wood' },
    // First Prize Doghouse with 1,000 Lights!
    { x: 1250, y: 420, width: 200, height: 200, type: 'doghouse' },
    { x: 1550, y: 320, width: 200, height: 35, type: 'wood' },
    // Campfire high up
    { x: 1800, y: 190, width: 60, height: 50, type: 'campfire' },
    { x: 1850, y: 240, width: 220, height: 35, type: 'branch' },
    { x: 2180, y: 340, width: 200, height: 35, type: 'piano', isSpring: true },
    { x: 2480, y: 440, width: 220, height: 35, type: 'wood' },
    { x: 2800, y: 360, width: 220, height: 35, type: 'branch' },
    { x: 3100, y: 260, width: 240, height: 35, type: 'wood' },
    // Final Grand Stage
    { x: 3400, y: 450, width: 180, height: 170, type: 'doghouse' },
  ];

  const coins: Coin[] = [];
  for (let i = 0; i < 15; i++) {
    coins.push({ id: `blizz_ground_${i}`, x: 80 + i * 50, y: 560, type: 'coin', value: 2, collected: false, floatOffset: i * 0.1 });
  }
  for (let i = 0; i < 5; i++) {
    coins.push({ id: `b_stage1_${i}`, x: 320 + i * 40, y: 410, type: 'coin', value: 2, collected: false, floatOffset: i * 0.2 });
  }
  coins.push({ id: 'piano_star_5', x: 700, y: 280, type: 'star', value: 20, collected: false, floatOffset: 0 });
  coins.push({ id: 'doghouse_crown_treat', x: 1350, y: 320, type: 'bone', value: 15, collected: false, floatOffset: 0.5 });

  for (let i = 0; i < 7; i++) {
    coins.push({ id: `b_high_st_${i}`, x: 1860 + i * 35, y: 170, type: 'coin', value: 3, collected: false, floatOffset: i * 0.3 });
  }
  coins.push({ id: 'star_pageant_mid', x: 2280, y: 240, type: 'star', value: 25, collected: false, floatOffset: 0 });
  coins.push({ id: 'candy_pageant_1', x: 2560, y: 370, type: 'candy', value: 8, collected: false, floatOffset: 0.6 });
  coins.push({ id: 'star_pageant_high', x: 3220, y: 180, type: 'star', value: 30, collected: false, floatOffset: 0.2 });
  coins.push({ id: 'grand_holiday_star', x: 3490, y: 360, type: 'star', value: 50, collected: false, floatOffset: 0 });

  const cookies: ColdCookie[] = [
    { id: 'cookie_b1', x: 920, y: 250, collected: false, exp: 80, floatOffset: 0.2 },
    { id: 'cookie_b2', x: 1950, y: 190, collected: false, exp: 90, floatOffset: 0.6 },
    { id: 'cookie_b3', x: 2850, y: 310, collected: false, exp: 100, floatOffset: 0.4 },
  ];

  const enemies: Enemy[] = [
    {
      id: 'zombie_boss_1',
      x: 1000,
      y: 560,
      vx: 2.0,
      vy: 0,
      width: 50,
      height: 70,
      hp: 120,
      maxHp: 120,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 850,
      patrolMaxX: 1200,
      expReward: 120,
      cookieReward: 5,
    },
    {
      id: 'ghoul_boss_2',
      x: 1650,
      y: 560,
      vx: -2.2,
      vy: 0,
      width: 48,
      height: 65,
      hp: 130,
      maxHp: 130,
      type: 'blizzard_ghoul',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 1450,
      patrolMaxX: 1850,
      expReward: 140,
      cookieReward: 6,
    },
    {
      id: 'bat_boss_3',
      x: 2300,
      y: 280,
      vx: 2.5,
      vy: 0,
      width: 42,
      height: 42,
      hp: 60,
      maxHp: 60,
      type: 'frost_bat',
      state: 'patrol',
      facing: 'left',
      patrolMinX: 2150,
      patrolMaxX: 2500,
      expReward: 80,
      cookieReward: 3,
    },
    {
      id: 'zombie_boss_final',
      x: 3000,
      y: 560,
      vx: 2.3,
      vy: 0,
      width: 55,
      height: 75,
      hp: 180,
      maxHp: 180,
      type: 'zombie_snowman',
      state: 'patrol',
      facing: 'right',
      patrolMinX: 2800,
      patrolMaxX: 3350,
      expReward: 200,
      cookieReward: 10,
    },
  ];

  return {
    id: 5,
    name: 'Blizzard Peak: Save Snoopy!',
    subtitle: 'The Grand Holiday Pageant & Epic Boss Zombie Snowmen Showdown!',
    theme: 'blizzard_peak',
    targetCoins: 75,
    targetZombies: 4,
    description: "Intense blizzard howling! Keep your warmth high with upgraded Mitts and Sweaters, defeat the Frost Citadel Zombies, and reunite with Snoopy on his First Prize Red Doghouse!",
    width,
    height,
    spawnX: 80,
    spawnY: 530,
    goalX: 3490,
    goalY: 450,
    platforms,
    coins,
    obstacles: [],
    enemies,
    cookies,
    specialFeature: 'Blizzard Cold Storm · Campfire Havens · First Prize Lighted Roof · Boss Zombies',
    snowDensity: 95,
    iceMultiplier: 1.0,
    blizzardColdRate: 2.8, // Heavy cold
    ambientColor: '#F3E8FF',
  };
}

export const GAME_LEVELS: LevelConfig[] = [
  createBackyardLevel(),
  createSkatingPondLevel(),
  createNeighborhoodLevel(),
  createTreeLotLevel(),
  createBlizzardPeakLevel(),
];

export function getLevelById(id: number): LevelConfig {
  const lvl = GAME_LEVELS.find((l) => l.id === id);
  return lvl ? JSON.parse(JSON.stringify(lvl)) : JSON.parse(JSON.stringify(GAME_LEVELS[0]));
}
