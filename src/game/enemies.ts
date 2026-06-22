import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ENEMY_COLS,
  ENEMY_DROP_DISTANCE,
  ENEMY_GAP_X,
  ENEMY_GAP_Y,
  ENEMY_HEIGHT,
  ENEMY_ROWS,
  ENEMY_START_X,
  ENEMY_START_Y,
  ENEMY_WALL_PADDING,
  ENEMY_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  PLAYER_Y_OFFSET,
} from "./constants";
import { enemyReachedPlayerZone } from "./collision";
import { pointsForTier } from "./scoring";
import type { Enemy, EnemyTier, GameSession, Player } from "./types";

export function createPlayer(): Player {
  return {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - PLAYER_Y_OFFSET,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
  };
}

export function createEnemyGrid(): Enemy[] {
  const enemies: Enemy[] = [];

  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      const tier: EnemyTier =
        row === 0 ? "captain" : row <= 2 ? "scout" : "grunt";

      enemies.push({
        x: ENEMY_START_X + col * ENEMY_GAP_X,
        y: ENEMY_START_Y + row * ENEMY_GAP_Y,
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
        alive: true,
        tier,
        points: pointsForTier(tier),
      });
    }
  }

  return enemies;
}

export function updateEnemyFormation(session: GameSession): boolean {
  const livingEnemies = session.enemies.filter((enemy) => enemy.alive);
  if (livingEnemies.length === 0) return false;

  const leftMost = Math.min(...livingEnemies.map((enemy) => enemy.x));
  const rightMost = Math.max(
    ...livingEnemies.map((enemy) => enemy.x + enemy.width)
  );

  const shouldTurn =
    (session.enemyDirection === 1 &&
      rightMost >= CANVAS_WIDTH - ENEMY_WALL_PADDING) ||
    (session.enemyDirection === -1 && leftMost <= ENEMY_WALL_PADDING);

  if (shouldTurn) {
    session.enemyDirection *= -1;
    for (const enemy of livingEnemies) {
      enemy.y += ENEMY_DROP_DISTANCE;
    }
  } else {
    for (const enemy of livingEnemies) {
      enemy.x += session.enemyDirection * session.enemySpeed;
    }
  }

  return livingEnemies.some((enemy) =>
    enemyReachedPlayerZone(enemy, session.player)
  );
}

export function pickRandomLivingEnemy(enemies: Enemy[]): Enemy | null {
  const living = enemies.filter((enemy) => enemy.alive);
  if (living.length === 0) return null;
  return living[Math.floor(Math.random() * living.length)];
}
