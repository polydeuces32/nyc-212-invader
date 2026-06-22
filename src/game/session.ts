import { INVINCIBILITY_FRAMES, PLAYER_START_LIVES } from "./constants";
import { enemyFireIntervalForWave, enemySpeedForWave } from "./scoring";
import { createEnemyGrid, createPlayer } from "./enemies";
import { clearAllBullets } from "./bullets";
import type { GameSession, GameState } from "./types";

export function createSession(state: GameState = "BOOT"): GameSession {
  const wave = 1;
  return {
    state,
    score: 0,
    lives: PLAYER_START_LIVES,
    wave,
    player: createPlayer(),
    playerBullets: [],
    enemyBullets: [],
    enemies: createEnemyGrid(),
    enemyDirection: 1,
    enemySpeed: enemySpeedForWave(wave),
    invincibleFrames: 0,
    enemyFireCooldown: enemyFireIntervalForWave(wave),
  };
}

export function applyWaveDifficulty(session: GameSession): void {
  session.enemySpeed = enemySpeedForWave(session.wave);
  session.enemyFireCooldown = enemyFireIntervalForWave(session.wave);
}

export function resetForNewGame(session: GameSession): void {
  session.score = 0;
  session.lives = PLAYER_START_LIVES;
  session.wave = 1;
  session.player = createPlayer();
  session.enemies = createEnemyGrid();
  session.enemyDirection = 1;
  session.invincibleFrames = 0;
  clearAllBullets(session);
  applyWaveDifficulty(session);
}

export function prepareNextWave(session: GameSession): void {
  session.wave += 1;
  session.player = createPlayer();
  session.enemies = createEnemyGrid();
  session.enemyDirection = 1;
  session.invincibleFrames = 0;
  clearAllBullets(session);
  applyWaveDifficulty(session);
}

export function respawnEnemiesAfterBreach(session: GameSession): void {
  session.enemies = createEnemyGrid();
  session.enemyDirection = 1;
  session.invincibleFrames = INVINCIBILITY_FRAMES;
  clearAllBullets(session);
}

export function returnToMainMenu(session: GameSession): void {
  resetForNewGame(session);
}
