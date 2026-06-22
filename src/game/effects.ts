import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import type { Particle } from "./types";

export type ShakeState = {
  frames: number;
  intensity: number;
};

export function createShakeState(): ShakeState {
  return { frames: 0, intensity: 0 };
}

export function triggerShake(state: ShakeState, intensity: number, frames: number): void {
  state.intensity = intensity;
  state.frames = Math.max(state.frames, frames);
}

export function applyShake(ctx: CanvasRenderingContext2D, state: ShakeState): void {
  if (state.frames <= 0) return;
  const dx = (Math.random() - 0.5) * state.intensity;
  const dy = (Math.random() - 0.5) * state.intensity;
  ctx.translate(dx, dy);
  state.frames -= 1;
}

export function spawnExplosion(
  particles: Particle[],
  x: number,
  y: number,
  color: string,
  count = 10
): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 18 + Math.floor(Math.random() * 12),
      color,
    });
  }
}

export function updateParticles(particles: Particle[]): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= 1;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    ctx.globalAlpha = Math.min(1, p.life / 20);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}

export type Star = { x: number; y: number; size: number; alpha: number };

export function createStarfield(count = 80): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() > 0.85 ? 2 : 1,
      alpha: 0.2 + Math.random() * 0.6,
    });
  }
  return stars;
}

export function drawStarfield(ctx: CanvasRenderingContext2D, stars: Star[]): void {
  for (const star of stars) {
    ctx.fillStyle = `rgba(180, 210, 255, ${star.alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
}
