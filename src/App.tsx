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

type EnemyTier = "grunt" | "scout" | "captain";

type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  tier: EnemyTier;
  points: number;
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const PLAYER_START_LIVES = 3;
const HIGH_SCORE_STORAGE_KEY = "nyc212-high-score";

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
    let highScore = Number(localStorage.getItem(HIGH_SCORE_STORAGE_KEY) ?? "0");
    let lives = PLAYER_START_LIVES;
    let wave = 1;
    let gameOver = false;
    let waveCleared = false;
    let paused = false;
    let enemyDirection = 1;
    let enemySpeed = 0.7;
    let enemyDropDistance = 18;
    let animationFrameId = 0;

    const updateHighScore = () => {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(highScore));
      }
    };

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
          const tier: EnemyTier =
            row === 0 ? "captain" : row <= 2 ? "scout" : "grunt";

          const points =
            tier === "captain" ? 300 : tier === "scout" ? 200 : 100;

          enemies.push({
            x: startX + col * gapX,
            y: startY + row * gapY,
            width: 38,
            height: 26,
            alive: true,
            tier,
            points,
          });
        }
      }
    };

    const resetGame = () => {
      score = 0;
      lives = PLAYER_START_LIVES;
      wave = 1;
      gameOver = false;
      waveCleared = false;
      enemyDirection = 1;
      enemySpeed = 0.7;
      bullets = [];
      player.x = CANVAS_WIDTH / 2 - player.width / 2;
      createEnemies();
    };

    const nextWave = () => {
      wave += 1;
      waveCleared = false;
      enemyDirection = 1;
      enemySpeed = Math.min(0.7 + wave * 0.18, 2.8);
      bullets = [];
      player.x = CANVAS_WIDTH / 2 - player.width / 2;
      createEnemies();
    };

    createEnemies();

    const shoot = () => {
      if (bullets.length >= 4) return;

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

      if (event.code === "KeyP" && !gameOver && !waveCleared) {
        paused = !paused;
      }

      if (event.code === "Space" && !gameOver && !waveCleared && !paused) {
        event.preventDefault();
        shoot();
      }

      if (event.code === "Enter" && waveCleared) {
        nextWave();
      }

      if (event.code === "Enter" && gameOver) {
        resetGame();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const updateEnemies = () => {
      const livingEnemies = enemies.filter((enemy) => enemy.alive);
      if (livingEnemies.length === 0) return;

      const leftMost = Math.min(...livingEnemies.map((enemy) => enemy.x));
      const rightMost = Math.max(
        ...livingEnemies.map((enemy) => enemy.x + enemy.width)
      );

      const shouldTurn =
        (enemyDirection === 1 && rightMost >= CANVAS_WIDTH - 20) ||
        (enemyDirection === -1 && leftMost <= 20);

      if (shouldTurn) {
        enemyDirection *= -1;

        for (const enemy of livingEnemies) {
          enemy.y += enemyDropDistance;
        }
      } else {
        for (const enemy of livingEnemies) {
          enemy.x += enemyDirection * enemySpeed;
        }
      }

      const reachedPlayerZone = livingEnemies.some(
        (enemy) => enemy.y + enemy.height >= player.y
      );

      if (reachedPlayerZone) {
        lives -= 1;
        bullets = [];

        if (lives <= 0) {
          gameOver = true;
          updateHighScore();
          return;
        }

        enemyDirection = 1;
        createEnemies();
      }
    };

    const update = () => {
      if (gameOver || waveCleared || paused) return;

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
            score += enemy.points;
            updateHighScore();
          }
        }
      }

      bullets = bullets.filter((bullet) => bullet.y > -100);

      updateEnemies();

      if (enemies.every((enemy) => !enemy.alive)) {
        waveCleared = true;
        updateHighScore();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px monospace";
      ctx.fillText("NYC 212 INVADER", 24, 32);
      ctx.fillText(`Score: ${score}`, 24, 62);
      ctx.fillText(`High Score: ${highScore}`, 24, 92);
      ctx.fillText(`Lives: ${lives}`, 300, 62);
      ctx.fillText(`Wave: ${wave}`, 440, 62);

      if (paused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.font = "42px monospace";
        ctx.fillText("PAUSED", CANVAS_WIDTH / 2 - 75, CANVAS_HEIGHT / 2);

        ctx.font = "18px monospace";
        ctx.fillText(
          "Press P to resume",
          CANVAS_WIDTH / 2 - 90,
          CANVAS_HEIGHT / 2 + 42
        );

        return;
      }

      ctx.fillStyle = "#33ff99";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = "#00ccff";
      for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }

      for (const enemy of enemies) {
        if (enemy.alive) {
          ctx.fillStyle =
            enemy.tier === "captain"
              ? "#ffcc00"
              : enemy.tier === "scout"
                ? "#ff3355"
                : "#ff66cc";

          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      }

      if (waveCleared) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.font = "36px monospace";
        ctx.fillText("WAVE CLEARED", CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT / 2);

        ctx.font = "18px monospace";
        ctx.fillText(
          "Press ENTER for next wave",
          CANVAS_WIDTH / 2 - 135,
          CANVAS_HEIGHT / 2 + 42
        );
      }

      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = "#ffffff";
        ctx.font = "42px monospace";
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2 - 115, CANVAS_HEIGHT / 2);

        ctx.font = "18px monospace";
        ctx.fillText(
          `Final Score: ${score}`,
          CANVAS_WIDTH / 2 - 85,
          CANVAS_HEIGHT / 2 + 42
        );
        ctx.fillText(
          `High Score: ${highScore}`,
          CANVAS_WIDTH / 2 - 90,
          CANVAS_HEIGHT / 2 + 74
        );
        ctx.fillText(
          "Press ENTER to restart",
          CANVAS_WIDTH / 2 - 120,
          CANVAS_HEIGHT / 2 + 106
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
          <p>Pause: P</p>
          <p>Next wave / Restart: Enter</p>
        </div>
      </section>
    </main>
  );
}

export default App;
