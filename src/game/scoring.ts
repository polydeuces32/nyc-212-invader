import type { EnemyTier } from "./types";
import {
  BASE_ENEMY_FIRE_INTERVAL,
  BASE_ENEMY_SPEED,
  ENEMY_FIRE_INTERVAL_REDUCTION,
  ENEMY_SPEED_PER_WAVE,
  MAX_ENEMY_SPEED,
  MIN_ENEMY_FIRE_INTERVAL,
} from "./constants";

export function pointsForTier(tier: EnemyTier): number {
  switch (tier) {
    case "captain":
      return 300;
    case "scout":
      return 200;
    case "grunt":
      return 100;
  }
}

export function enemySpeedForWave(wave: number): number {
  return Math.min(BASE_ENEMY_SPEED + wave * ENEMY_SPEED_PER_WAVE, MAX_ENEMY_SPEED);
}

export function enemyFireIntervalForWave(wave: number): number {
  return Math.max(
    MIN_ENEMY_FIRE_INTERVAL,
    BASE_ENEMY_FIRE_INTERVAL - (wave - 1) * ENEMY_FIRE_INTERVAL_REDUCTION
  );
}
