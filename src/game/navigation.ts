import type { GameState } from "./types";

/** Where Esc/Enter/OK should return after HIGH_SCORES. */
export function highScoresReturnState(from: GameState): GameState {
  if (from === "GAME_OVER" || from === "WAVE_CLEARED" || from === "MAIN_MENU") {
    return from;
  }
  return "MAIN_MENU";
}

/** States that may abandon the run (or leave overlay) via Esc / MENU. */
export function canReturnToMainMenu(state: GameState): boolean {
  return (
    state === "PLAYING" ||
    state === "PAUSED" ||
    state === "WAVE_CLEARED" ||
    state === "GAME_OVER"
  );
}
