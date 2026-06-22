import { useEffect, useRef } from "react";
import "./App.css";

type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

type Bullet = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const keys = new Set<string>();

    const player: Player = {
      x: CANVAS_WIDTH / 2 - 25,
      y: CANVAS_HEIGHT - 60,
      width: 50,
      height: 24,
      speed: 6,
    };

    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let score = 0;
    let gameOver = false;
    let animationFrameId = 0;

    const createEnemies = () => {
      enemies = [];
      const rows = 4;
      const cols = 10;
      const startX = 110;
      const startY = 70;
      const gapX = 65;
      const gapY = 45;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          enemies.push({
            x: startX + col * gapX,
            y: startY + row * gapY,
            width: 38,
            height: 26,
            alive: true,
          });
        }
      }
    };

    createEnemies();

    const shoot = () => {
      bullets.push({
        x: player.x + player.width / 2 - 3,
        y: player.y,
        width: 6,
        height: 14,
        speed: 8,
      });
    };

    const isColliding = (a: Bullet, b: Enemy) => {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      keys.add(event.code);

      if (event.code === "Space" && !gameOver) {
        event.preventDefault();
        shoot();
      }

      if (event.code === "Enter" && gameOver) {
        score = 0;
        gameOver = false;
        bullets = [];
        player.x = CANVAS_WIDTH / 2 - 25;
        createEnemies();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const update = () => {
      if (gameOver) return;

      if (keys.has("ArrowLeft") || keys.has("KeyA")) {
        player.x -= player.speed;
      }

      if (keys.has("ArrowRight") || keys.has("KeyD")) {
        player.x += player.speed;
      }

      player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));

      bullets = bullets
        .map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed }))
        .filter((bullet) => bullet.y + bullet.height > 0);

      for (const bullet of bullets) {
        for (const enemy of enemies) {
          if (enemy.alive && isColliding(bullet, enemy)) {
            enemy.alive = false;
            bullet.y = -999;
            score += 100;
          }
        }
      }

      bullets = bullets.filter((bullet) => bullet.y > -100);

      if (enemies.every((enemy) => !enemy.alive)) {
        gameOver = true;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px monospace";
      ctx.fillText(`NYC 212 INVADER`, 24, 32);
      ctx.fillText(`Score: ${score}`, 24, 62);

      ctx.fillStyle = "#33ff99";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = "#00ccff";
      for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }

      ctx.fillStyle = "#ff3355";
      for (const enemy of enemies) {
        if (enemy.alive) {
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.font = "36px monospace";
        ctx.fillText("WAVE CLEARED", CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2);

        ctx.font = "18px monospace";
        ctx.fillText(
          "Press ENTER to restart",
          CANVAS_WIDTH / 2 - 120,
          CANVAS_HEIGHT / 2 + 42
        );
      }
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="game-card">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />
        <div className="controls">
          <p>Move: ← → / A D</p>
          <p>Shoot: Space</p>
          <p>Restart after clear: Enter</p>
        </div>
      </section>
    </main>
  );
}

export default App;
