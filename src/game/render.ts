import { CANVAS_HEIGHT, CANVAS_WIDTH, INVINCIBILITY_FLASH_INTERVAL } from "./constants";
import type { Star } from "./effects";
import { drawStarfield } from "./effects";
import type { Bullet, Enemy, EnemyTier, GameSession, Player } from "./types";

const TIER_COLORS: Record<EnemyTier, { body: string; accent: string }> = {
  captain: { body: "#e6b800", accent: "#fff4a8" },
  scout: { body: "#e63946", accent: "#ff8fa3" },
  grunt: { body: "#c77dff", accent: "#f0c6ff" },
};

export function drawBackground(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, "#0a1628");
  gradient.addColorStop(0.55, "#050816");
  gradient.addColorStop(1, "#120818");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "rgba(255, 200, 80, 0.04)";
  ctx.fillRect(0, CANVAS_HEIGHT - 48, CANVAS_WIDTH, 48);

  drawStarfield(ctx, stars);
}

export function drawHud(
  ctx: CanvasRenderingContext2D,
  session: GameSession,
  highScore: number
): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(12, 10, CANVAS_WIDTH - 24, 88);
  ctx.strokeStyle = "rgba(0, 255, 200, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 10, CANVAS_WIDTH - 24, 88);

  ctx.fillStyle = "#5dffb7";
  ctx.font = "bold 22px ui-monospace, monospace";
  ctx.fillText("NYC 212 INVADER", 28, 38);

  ctx.fillStyle = "#ffffff";
  ctx.font = "18px ui-monospace, monospace";
  ctx.fillText(`SCORE ${session.score}`, 28, 68);
  ctx.fillText(`HI ${highScore}`, 28, 90);
  ctx.fillText(`LIVES ${session.lives}`, 320, 68);
  ctx.fillText(`WAVE ${session.wave}`, 480, 68);
}

export function drawPlayerShip(
  ctx: CanvasRenderingContext2D,
  player: Player,
  invincibleFrames: number
): void {
  const visible =
    invincibleFrames <= 0 ||
    Math.floor(invincibleFrames / INVINCIBILITY_FLASH_INTERVAL) % 2 === 0;

  if (!visible) return;

  const { x, y, width, height } = player;
  const px = x;
  const py = y;

  ctx.fillStyle = "#f5c518";
  ctx.fillRect(px + 8, py + 4, width - 16, height - 8);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(px + 12, py + 10, width - 24, 4);
  ctx.fillStyle = "#ffe566";
  ctx.fillRect(px + width / 2 - 3, py, 6, 8);
  ctx.fillStyle = "#33ff99";
  ctx.fillRect(px + 4, py + height - 6, 8, 4);
  ctx.fillRect(px + width - 12, py + height - 6, 8, 4);
  ctx.fillStyle = "#00ccff";
  ctx.fillRect(px + width / 2 - 2, py - 4, 4, 6);
}

export function drawEnemyDrone(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  frame: number
): void {
  if (!enemy.alive) return;

  const colors = TIER_COLORS[enemy.tier];
  const bob = Math.sin((frame + enemy.x) * 0.08) * (enemy.tier === "grunt" ? 1 : 2);
  const { x, y, width, height } = enemy;
  const py = y + bob;

  ctx.fillStyle = colors.body;
  if (enemy.tier === "captain") {
    ctx.fillRect(x + 6, py + 4, width - 12, height - 8);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x + width / 2 - 2, py, 4, 8);
    ctx.fillRect(x + 4, py + 6, 6, 4);
    ctx.fillRect(x + width - 10, py + 6, 6, 4);
  } else if (enemy.tier === "scout") {
    ctx.fillRect(x + 4, py + 6, width - 8, height - 10);
    ctx.fillRect(x, py + 10, 6, 8);
    ctx.fillRect(x + width - 6, py + 10, 6, 8);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x + width / 2 - 3, py + 2, 6, 4);
  } else {
    ctx.fillRect(x + 8, py + 8, width - 16, height - 12);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x + 10, py + 4, width - 20, 4);
  }

  ctx.fillStyle = "#0ff";
  ctx.fillRect(x + 10, py + height - 6, 6, 3);
  ctx.fillRect(x + width - 16, py + height - 6, 6, 3);
}

export function drawPlayerBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  ctx.fillStyle = "#7df9ff";
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(bullet.x + 1, bullet.y + 2, bullet.width - 2, 2);
}

export function drawEnemyBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  ctx.fillStyle = "#ff6b35";
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(bullet.x + 1, bullet.y + 1, bullet.width - 2, 4);
}

export function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  size: number,
  color = "#ffffff"
): void {
  ctx.fillStyle = color;
  ctx.font = `${size}px ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.fillText(text, CANVAS_WIDTH / 2, y);
  ctx.textAlign = "left";
}

export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  title: string,
  lines: string[],
  titleSize = 42
): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.strokeStyle = "rgba(93, 255, 183, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(CANVAS_WIDTH / 2 - 220, CANVAS_HEIGHT / 2 - 80, 440, 60 + lines.length * 36);

  drawCenteredText(ctx, title, CANVAS_HEIGHT / 2 - 30, titleSize, "#5dffb7");

  lines.forEach((line, index) => {
    drawCenteredText(ctx, line, CANVAS_HEIGHT / 2 + 20 + index * 32, 18, "#e2e8f0");
  });
}

export function drawHighScoresScreen(
  ctx: CanvasRenderingContext2D,
  highScore: number,
  history: { score: number; wave: number; achievedAt: string }[]
): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawCenteredText(ctx, "HIGH SCORES", 80, 36, "#5dffb7");
  drawCenteredText(ctx, `BEST ${highScore}`, 130, 22);

  ctx.font = "18px ui-monospace, monospace";
  ctx.fillStyle = "#e2e8f0";

  if (history.length === 0) {
    drawCenteredText(ctx, "No runs recorded yet.", 200, 18);
  } else {
    history.slice(0, 8).forEach((entry, index) => {
      const date = new Date(entry.achievedAt).toLocaleDateString();
      drawCenteredText(
        ctx,
        `${index + 1}. ${entry.score} pts  wave ${entry.wave}  ${date}`,
        180 + index * 30,
        16
      );
    });
  }

  drawCenteredText(ctx, "Tap OK or press ESC / ENTER", CANVAS_HEIGHT - 40, 16, "#94a3b8");
}

export function resolveDisplayWidth(containerWidth: number): number {
  if (containerWidth > 0) {
    return Math.min(containerWidth, CANVAS_WIDTH);
  }
  if (typeof window !== "undefined") {
    return Math.min(Math.max(window.innerWidth - 32, 320), CANVAS_WIDTH);
  }
  return CANVAS_WIDTH;
}

export function setupCanvasDisplay(
  canvas: HTMLCanvasElement,
  containerWidth: number
): CanvasRenderingContext2D | null {
  const displayWidth = resolveDisplayWidth(containerWidth);
  const displayHeight = displayWidth * (CANVAS_HEIGHT / CANVAS_WIDTH);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = CANVAS_WIDTH * dpr;
  canvas.height = CANVAS_HEIGHT * dpr;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return ctx;
}
