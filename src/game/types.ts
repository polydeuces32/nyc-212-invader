export type GameState =
  | "BOOT"
  | "MAIN_MENU"
  | "PLAYING"
  | "PAUSED"
  | "WAVE_CLEARED"
  | "GAME_OVER"
  | "HIGH_SCORES";

export type EnemyTier = "grunt" | "scout" | "captain";

export type BulletOwner = "player" | "enemy";

export type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

export type Bullet = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  owner: BulletOwner;
};

export type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  tier: EnemyTier;
  points: number;
};

export type GameSession = {
  state: GameState;
  score: number;
  lives: number;
  wave: number;
  player: Player;
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  enemyDirection: number;
  enemySpeed: number;
  invincibleFrames: number;
  enemyFireCooldown: number;
};

export type HighScore = {
  score: number;
  wave: number;
  achievedAt: string;
};

export type PlayerState = {
  x: number;
  y: number;
  lives: number;
  invincibleFrames: number;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
};

export type TouchInput = {
  moveLeft: boolean;
  moveRight: boolean;
  fire: boolean;
};
