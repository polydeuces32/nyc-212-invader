import type { Bullet, Enemy, Player } from "./types";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function bulletHitsEnemy(bullet: Bullet, enemy: Enemy): boolean {
  if (!enemy.alive) return false;
  return rectsOverlap(bullet, enemy);
}

export function bulletHitsPlayer(bullet: Bullet, player: Player): boolean {
  return rectsOverlap(bullet, player);
}

export function enemyReachedPlayerZone(enemy: Enemy, player: Player): boolean {
  return enemy.alive && enemy.y + enemy.height >= player.y;
}
