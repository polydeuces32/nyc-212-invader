import {
  CANVAS_HEIGHT,
  ENEMY_BULLET_HEIGHT,
  ENEMY_BULLET_SPEED,
  ENEMY_BULLET_WIDTH,
  MAX_ENEMY_BULLETS,
  MAX_PLAYER_BULLETS,
  PLAYER_BULLET_HEIGHT,
  PLAYER_BULLET_SPEED,
  PLAYER_BULLET_WIDTH,
} from "./constants";
import type { Bullet, Enemy, GameSession, Player } from "./types";

export function spawnPlayerBullet(player: Player, bullets: Bullet[]): void {
  if (bullets.length >= MAX_PLAYER_BULLETS) return;

  bullets.push({
    x: player.x + player.width / 2 - PLAYER_BULLET_WIDTH / 2,
    y: player.y,
    width: PLAYER_BULLET_WIDTH,
    height: PLAYER_BULLET_HEIGHT,
    speed: PLAYER_BULLET_SPEED,
    owner: "player",
  });
}

export function spawnEnemyBullet(enemy: Enemy, bullets: Bullet[]): void {
  if (bullets.length >= MAX_ENEMY_BULLETS) return;

  bullets.push({
    x: enemy.x + enemy.width / 2 - ENEMY_BULLET_WIDTH / 2,
    y: enemy.y + enemy.height,
    width: ENEMY_BULLET_WIDTH,
    height: ENEMY_BULLET_HEIGHT,
    speed: ENEMY_BULLET_SPEED,
    owner: "enemy",
  });
}

export function updateBullets(session: GameSession): void {
  const moveBullet = (bullet: Bullet) => ({
    ...bullet,
    y:
      bullet.owner === "player"
        ? bullet.y - bullet.speed
        : bullet.y + bullet.speed,
  });

  session.playerBullets = session.playerBullets
    .map(moveBullet)
    .filter((bullet) => bullet.y + bullet.height > 0);

  session.enemyBullets = session.enemyBullets
    .map(moveBullet)
    .filter((bullet) => bullet.y < CANVAS_HEIGHT);
}

export function clearAllBullets(session: GameSession): void {
  session.playerBullets = [];
  session.enemyBullets = [];
}
