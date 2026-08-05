import { describe, expect, it } from "vitest";
import { highScoresReturnState, canReturnToMainMenu } from "./navigation";

describe("highScoresReturnState", () => {
  it("returns to GAME_OVER when opened from game over", () => {
    expect(highScoresReturnState("GAME_OVER")).toBe("GAME_OVER");
  });

  it("returns to MAIN_MENU when opened from main menu", () => {
    expect(highScoresReturnState("MAIN_MENU")).toBe("MAIN_MENU");
  });

  it("returns to WAVE_CLEARED when opened from wave cleared", () => {
    expect(highScoresReturnState("WAVE_CLEARED")).toBe("WAVE_CLEARED");
  });

  it("falls back to MAIN_MENU for other states", () => {
    expect(highScoresReturnState("PLAYING")).toBe("MAIN_MENU");
    expect(highScoresReturnState("PAUSED")).toBe("MAIN_MENU");
    expect(highScoresReturnState("HIGH_SCORES")).toBe("MAIN_MENU");
    expect(highScoresReturnState("BOOT")).toBe("MAIN_MENU");
  });
});

describe("canReturnToMainMenu", () => {
  it("allows abandoning play, pause, wave cleared, and game over", () => {
    expect(canReturnToMainMenu("PLAYING")).toBe(true);
    expect(canReturnToMainMenu("PAUSED")).toBe(true);
    expect(canReturnToMainMenu("WAVE_CLEARED")).toBe(true);
    expect(canReturnToMainMenu("GAME_OVER")).toBe(true);
  });

  it("rejects menu/boot/high-score states that use other exits", () => {
    expect(canReturnToMainMenu("MAIN_MENU")).toBe(false);
    expect(canReturnToMainMenu("HIGH_SCORES")).toBe(false);
    expect(canReturnToMainMenu("BOOT")).toBe(false);
  });
});
