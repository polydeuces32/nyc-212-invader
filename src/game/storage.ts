import {
  HIGH_SCORE_HISTORY_KEY,
  HIGH_SCORE_HISTORY_LIMIT,
  HIGH_SCORE_STORAGE_KEY,
} from "./constants";
import type { HighScore } from "./types";

export function loadHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
  const parsed = Number(stored ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function saveHighScore(score: number): void {
  localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
}

export function loadHighScoreHistory(): HighScore[] {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HighScore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordHighScoreEntry(score: number, wave: number): void {
  if (score <= 0) return;

  const currentBest = loadHighScore();
  if (score > currentBest) {
    saveHighScore(score);
  }

  const history = loadHighScoreHistory();
  history.push({
    score,
    wave,
    achievedAt: new Date().toISOString(),
  });

  history.sort((a, b) => b.score - a.score);

  localStorage.setItem(
    HIGH_SCORE_HISTORY_KEY,
    JSON.stringify(history.slice(0, HIGH_SCORE_HISTORY_LIMIT))
  );
}
