export type CharacterType =
  | 'SNOOPY'
  | 'CHARLIE_BROWN'
  | 'LINUS'
  | 'LUCY'
  | 'SCHROEDER'
  | 'WOODSTOCK';

export type GameState =
  | 'TITLE_MENU'
  | 'STORY_MODE'
  | 'LEVEL_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_CLEAR'
  | 'GAME_OVER'
  | 'UPGRADES_SHOP'
  | 'SNOW_GLOBE'
  | 'LEADERBOARD'
  | 'AD_REWARDS';

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  type: 'snowball' | 'peppermint_star' | 'music_wave' | 'blanket_whip';
  life: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'zombie_snowman' | 'blizzard_ghoul' | 'frost_bat';
  state: 'patrol' | 'chase' | 'hurt' | 'defeated';
  facing: 'left' | 'right';
  patrolMinX: number;
  patrolMaxX: number;
  expReward: number;
  cookieReward: number;
}

export interface ColdCookie {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  exp: number;
  floatOffset: number;
}

export interface PlayerStats {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  warmth: number; // 0 - 100
  maxWarmth: number;
  level: number;
  exp: number;
  expNext: number;
  isGrounded: boolean;
  isGliding: boolean;
  isDashing: boolean;
  facing: 'left' | 'right';
  jumpCount: number;
  dashCooldown: number;
  dashTimer: number;
  flutterTimer: number;
  invulnerableTimer: number;
  shootCooldown: number;
  frame: number;
  isDancing: boolean;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'bone' | 'candy' | 'star' | 'goldfish_card';
  value: number;
  collected: boolean;
  floatOffset: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'snow' | 'ice' | 'wood' | 'doghouse' | 'branch' | 'piano' | 'booth' | 'campfire';
  isSpring?: boolean;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'snowman' | 'snowball' | 'icicle';
  vx?: number;
  initialX?: number;
  range?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'sparkle' | 'music_note' | 'cookie' | 'text';
  text?: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  theme: 'backyard' | 'skating_pond' | 'neighborhood' | 'tree_lot' | 'grand_pageant' | 'blizzard_peak';
  targetCoins: number;
  targetZombies: number;
  description: string;
  width: number;
  height: number;
  spawnX: number;
  spawnY: number;
  goalX: number;
  goalY: number;
  platforms: Platform[];
  coins: Coin[];
  obstacles: Obstacle[];
  enemies: Enemy[];
  cookies: ColdCookie[];
  specialFeature?: string;
  snowDensity: number;
  iceMultiplier: number;
  blizzardColdRate: number; // warmth drain per second
  ambientColor: string;
}

export interface UpgradeItem {
  id: string;
  category: 'mitts' | 'hat' | 'sweater';
  tier: number; // 0, 1, 2, 3
  name: string;
  description: string;
  benefit: string;
  cost: number;
  icon: string;
  color: string;
  stats: {
    magnetRadius?: number;
    bonusSpeed?: number;
    extraJumps?: number;
    coinMultiplier?: number;
    dashDuration?: number;
    iceGrip?: boolean;
    holidayShield?: boolean;
    warmthPreserve?: number; // % reduction in cold drain
    snowballDamage?: number;
  };
}

export interface StoryChapter {
  id: number;
  title: string;
  cutscene: string[];
  speaker: string;
  speakerMood: 'worried' | 'determined' | 'happy' | 'heroic';
  rewardCoins: number;
  rewardExp: number;
  unlockedCharacter?: CharacterType;
}

export interface FriendOnline {
  id: string;
  name: string;
  avatar: string;
  status: 'playing' | 'idle' | 'cleared';
  currentLevel: string;
  score: number;
  character: CharacterType;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  level: number;
  zombiesSmashed: number;
  character: CharacterType;
  badge: string;
  isPlayer?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewardCoins: number;
}

export interface GameProgress {
  totalCoins: number;
  totalCookies: number;
  playerLevel: number;
  playerExp: number;
  unlockedLevels: number[];
  unlockedCharacters: CharacterType[];
  highScores: Record<number, number>;
  starsEarned: Record<number, number>;
  storyChapter: number;
  zombiesDefeated: number;
  equipped: {
    character: CharacterType;
    mitts: string;
    hat: string;
    sweater: string;
  };
  purchasedUpgrades: string[];
  unlockedRewards: string[];
}
