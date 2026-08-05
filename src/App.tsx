import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { TouchControls } from "./components/TouchControls";
import { createAudioEngine } from "./game/audio";
import {
  spawnEnemyBullet,
  spawnPlayerBullet,
  updateBullets,
} from "./game/bullets";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INVINCIBILITY_FRAMES,
} from "./game/constants";
import { bulletHitsEnemy, bulletHitsPlayer } from "./game/collision";
import {
  applyShake,
  createShakeState,
  createStarfield,
  drawParticles,
  spawnExplosion,
  triggerShake,
  updateParticles,
  type Star,
} from "./game/effects";
import {
  pickRandomLivingEnemy,
  updateEnemyFormation,
} from "./game/enemies";
import {
  drawBackground,
  drawEnemyBullet,
  drawEnemyDrone,
  drawHighScoresScreen,
  drawHud,
  drawOverlay,
  drawPlayerBullet,
  drawPlayerShip,
  setupCanvasDisplay,
} from "./game/render";
import {
  canReturnToMainMenu,
  highScoresReturnState,
} from "./game/navigation";
import {
  createSession,
  prepareNextWave,
  resetForNewGame,
  respawnEnemiesAfterBreach,
  returnToMainMenu,
} from "./game/session";
import { enemyFireIntervalForWave } from "./game/scoring";
import {
  loadHighScore,
  loadHighScoreHistory,
  recordHighScoreEntry,
  saveHighScore,
} from "./game/storage";
import { createTouchInput } from "./game/touch";
import type { GameState, Particle } from "./game/types";

const FIRE_COOLDOWN_FRAMES = 12;
const TIER_EXPLOSION_COLORS = {
  captain: "#ffd166",
  scout: "#ff6b6b",
  grunt: "#e0aaff",
} as const;

type GameActions = {
  start: () => void;
  highScores: () => void;
  confirm: () => void;
  menu: () => void;
  pause: () => void;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const touchInput = useMemo(() => createTouchInput(), []);
  const stateRef = useRef<GameState>("BOOT");
  const actionsRef = useRef<GameActions>({
    start: () => {},
    highScores: () => {},
    confirm: () => {},
    menu: () => {},
    pause: () => {},
  });
  const [uiState, setUiState] = useState<GameState>("MAIN_MENU");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let animationFrameId = 0;
    let bootFrameId = 0;
    let stopGame: (() => void) | null = null;

    bootFrameId = requestAnimationFrame(() => {
      if (disposed) return;

      const initialCtx = setupCanvasDisplay(canvas, container.clientWidth);
      if (!initialCtx) return;

      let ctx: CanvasRenderingContext2D = initialCtx;

      const audio = createAudioEngine();
      const keys = new Set<string>();
      const session = createSession("BOOT");
      const touch = touchInput;
      const shake = createShakeState();
      const stars: Star[] = createStarfield();
      const particles: Particle[] = [];
      let highScore = loadHighScore();
      let returnState: GameState = "MAIN_MENU";
      let frame = 0;
      let fireCooldown = 0;
      let previousState: GameState = "BOOT";

      const transitionTo = (next: GameState) => {
        if (session.state === next) return;
        session.state = next;
        stateRef.current = next;
        setUiState(next);
      };

      const updateHighScore = () => {
        if (session.score > highScore) {
          highScore = session.score;
          saveHighScore(highScore);
        }
      };

      const tryShoot = () => {
        const before = session.playerBullets.length;
        spawnPlayerBullet(session.player, session.playerBullets);
        if (session.playerBullets.length > before) {
          audio.shoot();
        }
      };

      const handlePlayerDeath = () => {
        updateHighScore();
        recordHighScoreEntry(session.score, session.wave);
        triggerShake(shake, 10, 24);
        audio.gameOver();
        transitionTo("GAME_OVER");
      };

      const handleResize = () => {
        const next = setupCanvasDisplay(canvas, container.clientWidth);
        if (next) ctx = next;
      };

      const goToMainMenu = () => {
        returnToMainMenu(session);
        particles.length = 0;
        transitionTo("MAIN_MENU");
      };

      actionsRef.current = {
        start: () => {
          audio.unlock();
          audio.menuConfirm();
          resetForNewGame(session);
          particles.length = 0;
          transitionTo("PLAYING");
        },
        highScores: () => {
          audio.unlock();
          if (
            session.state !== "MAIN_MENU" &&
            session.state !== "GAME_OVER" &&
            session.state !== "WAVE_CLEARED"
          ) {
            return;
          }
          returnState = highScoresReturnState(session.state);
          transitionTo("HIGH_SCORES");
        },
        confirm: () => {
          audio.unlock();
          audio.menuConfirm();
          switch (session.state) {
            case "MAIN_MENU":
              resetForNewGame(session);
              particles.length = 0;
              transitionTo("PLAYING");
              break;
            case "WAVE_CLEARED":
              prepareNextWave(session);
              particles.length = 0;
              transitionTo("PLAYING");
              break;
            case "GAME_OVER":
              resetForNewGame(session);
              particles.length = 0;
              transitionTo("PLAYING");
              break;
            case "HIGH_SCORES":
              transitionTo(returnState);
              break;
          }
        },
        menu: () => {
          audio.unlock();
          if (session.state === "HIGH_SCORES" || canReturnToMainMenu(session.state)) {
            goToMainMenu();
          }
        },
        pause: () => {
          if (session.state === "PLAYING") {
            transitionTo("PAUSED");
          } else if (session.state === "PAUSED") {
            transitionTo("PLAYING");
          }
        },
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        keys.add(event.code);
        audio.unlock();

        switch (session.state) {
          case "BOOT":
            break;

          case "MAIN_MENU":
            if (event.code === "Enter") actionsRef.current.start();
            if (event.code === "KeyH") actionsRef.current.highScores();
            break;

          case "PLAYING":
            if (event.code === "KeyP") transitionTo("PAUSED");
            if (event.code === "Escape") goToMainMenu();
            if (event.code === "Space") {
              event.preventDefault();
            }
            break;

          case "PAUSED":
            if (event.code === "KeyP") transitionTo("PLAYING");
            if (event.code === "Escape") goToMainMenu();
            break;

          case "WAVE_CLEARED":
            if (event.code === "Enter") {
              audio.menuConfirm();
              prepareNextWave(session);
              particles.length = 0;
              transitionTo("PLAYING");
            }
            if (event.code === "Escape") goToMainMenu();
            break;

          case "GAME_OVER":
            if (event.code === "Enter") actionsRef.current.start();
            if (event.code === "KeyH") actionsRef.current.highScores();
            if (event.code === "Escape") goToMainMenu();
            break;

          case "HIGH_SCORES":
            if (event.code === "Escape" || event.code === "Enter") {
              transitionTo(returnState);
            }
            break;
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        keys.delete(event.code);
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("resize", handleResize);

      const updatePlaying = () => {
        if (keys.has("ArrowLeft") || keys.has("KeyA") || touch.moveLeft) {
          session.player.x -= session.player.speed;
        }
        if (keys.has("ArrowRight") || keys.has("KeyD") || touch.moveRight) {
          session.player.x += session.player.speed;
        }

        session.player.x = Math.max(
          0,
          Math.min(CANVAS_WIDTH - session.player.width, session.player.x)
        );

        if (fireCooldown > 0) fireCooldown -= 1;
        if ((keys.has("Space") || touch.fire) && fireCooldown <= 0) {
          const before = session.playerBullets.length;
          tryShoot();
          if (session.playerBullets.length > before) {
            fireCooldown = FIRE_COOLDOWN_FRAMES;
          }
        }

        if (session.invincibleFrames > 0) {
          session.invincibleFrames -= 1;
        }

        updateBullets(session);
        updateParticles(particles);

        for (const bullet of session.playerBullets) {
          let bulletConsumed = false;
          for (const enemy of session.enemies) {
            if (bulletConsumed) break;
            if (bulletHitsEnemy(bullet, enemy)) {
              enemy.alive = false;
              bullet.y = -999;
              bulletConsumed = true;
              session.score += enemy.points;
              updateHighScore();
              audio.enemyHit();
              spawnExplosion(
                particles,
                enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2,
                TIER_EXPLOSION_COLORS[enemy.tier]
              );
            }
          }
        }

        session.playerBullets = session.playerBullets.filter(
          (bullet) => bullet.y > -100
        );

        if (session.enemyFireCooldown > 0) {
          session.enemyFireCooldown -= 1;
        } else {
          const shooter = pickRandomLivingEnemy(session.enemies);
          if (shooter) {
            spawnEnemyBullet(shooter, session.enemyBullets);
          }
          session.enemyFireCooldown = enemyFireIntervalForWave(session.wave);
        }

        if (session.invincibleFrames <= 0) {
          for (const bullet of session.enemyBullets) {
            if (bulletHitsPlayer(bullet, session.player)) {
              bullet.y = 9999;
              session.lives -= 1;
              session.invincibleFrames = INVINCIBILITY_FRAMES;
              session.enemyBullets = session.enemyBullets.filter(
                (b) => b.y < 9990
              );
              triggerShake(shake, 8, 16);
              audio.playerHit();
              spawnExplosion(
                particles,
                session.player.x + session.player.width / 2,
                session.player.y + session.player.height / 2,
                "#33ff99"
              );

              if (session.lives <= 0) {
                handlePlayerDeath();
                return;
              }
              break;
            }
          }
        }

        const breached = updateEnemyFormation(session);
        if (breached) {
          session.lives -= 1;
          triggerShake(shake, 12, 20);
          audio.playerHit();
          if (session.lives <= 0) {
            handlePlayerDeath();
            return;
          }
          respawnEnemiesAfterBreach(session);
        }

        if (session.enemies.every((enemy) => !enemy.alive)) {
          updateHighScore();
          audio.waveClear();
          transitionTo("WAVE_CLEARED");
        }
      };

      const drawEntities = () => {
        drawPlayerShip(ctx, session.player, session.invincibleFrames);

        for (const bullet of session.playerBullets) {
          drawPlayerBullet(ctx, bullet);
        }
        for (const bullet of session.enemyBullets) {
          drawEnemyBullet(ctx, bullet);
        }
        for (const enemy of session.enemies) {
          drawEnemyDrone(ctx, enemy, frame);
        }
        drawParticles(ctx, particles);
      };

      const draw = () => {
        ctx.save();
        applyShake(ctx, shake);

        drawBackground(ctx, stars);

        switch (session.state) {
          case "BOOT":
            break;

          case "MAIN_MENU":
            drawHud(ctx, session, highScore);
            drawOverlay(ctx, "NYC 212 INVADER", [
              "Press ENTER or tap START",
              "Press H or tap SCORES",
            ], 48);
            break;

          case "PLAYING":
            drawHud(ctx, session, highScore);
            drawEntities();
            break;

          case "PAUSED":
            drawHud(ctx, session, highScore);
            drawEntities();
            drawOverlay(ctx, "PAUSED", [
              "Press P or tap PAUSE to resume",
              "Press ESC or MENU for main menu",
            ], 42);
            break;

          case "WAVE_CLEARED":
            drawHud(ctx, session, highScore);
            drawOverlay(ctx, "WAVE CLEARED", [
              `Wave ${session.wave} complete`,
              "Press ENTER or OK for next wave",
              "Press ESC or MENU for main menu",
            ], 36);
            break;

          case "GAME_OVER":
            drawHud(ctx, session, highScore);
            drawOverlay(ctx, "GAME OVER", [
              `Final Score: ${session.score}`,
              `High Score: ${highScore}`,
              "Press ENTER or OK to restart",
              "Press H or SCORES for high scores",
            ], 42);
            break;

          case "HIGH_SCORES":
            drawHighScoresScreen(ctx, highScore, loadHighScoreHistory());
            break;
        }

        ctx.restore();
      };

      const update = () => {
        frame += 1;
        stateRef.current = session.state;

        if (session.state === "BOOT") {
          transitionTo("MAIN_MENU");
          return;
        }

        if (session.state !== previousState) {
          if (session.state === "WAVE_CLEARED" && previousState === "PLAYING") {
            spawnExplosion(particles, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3, "#5dffb7", 16);
          }
          previousState = session.state;
        }

        if (session.state === "PLAYING") {
          updatePlaying();
        } else if (session.state !== "PAUSED") {
          updateParticles(particles);
        }
      };

      const loop = () => {
        update();
        draw();
        animationFrameId = requestAnimationFrame(loop);
      };

      loop();

      stopGame = () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        window.removeEventListener("resize", handleResize);
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(bootFrameId);
      stopGame?.();
    };
  }, [touchInput]);

  const showGameControls = uiState === "PLAYING" || uiState === "PAUSED";
  const showOverlayControls =
    uiState === "MAIN_MENU" ||
    uiState === "WAVE_CLEARED" ||
    uiState === "GAME_OVER" ||
    uiState === "HIGH_SCORES";

  return (
    <main className="app-shell">
      <section className="game-card" ref={containerRef}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
          aria-label="NYC 212 Invader game"
        />
        <TouchControls
          touch={touchInput}
          uiState={uiState}
          mode={
              showGameControls
                ? "game"
                : showOverlayControls
                  ? "overlay"
                  : "hidden"
            }
            onStart={() => actionsRef.current.start()}
            onScores={() => actionsRef.current.highScores()}
            onConfirm={() => actionsRef.current.confirm()}
            onMenu={() => actionsRef.current.menu()}
            onPause={() => actionsRef.current.pause()}
        />
        <div className="controls">
          <p>Move: ← → / A D / touch ◀ ▶</p>
          <p>Shoot: Space / FIRE</p>
          <p>Pause: P</p>
          <p>Start / Next / Restart: Enter</p>
          <p>High Scores: H</p>
          <p>Main Menu: Esc / MENU</p>
        </div>
      </section>
    </main>
  );
}

export default App;
