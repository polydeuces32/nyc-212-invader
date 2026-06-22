# NYC 212 Invader — Algorithms

## Scoring

### Per-Enemy Points

```text
captain → 300
scout   → 200
grunt   → 100
```

Implemented in `pointsForTier()` (`src/game/scoring.ts`).

### On Kill

1. `bulletHitsEnemy(bullet, enemy)` returns true
2. Set `enemy.alive = false`
3. Remove bullet (move off-screen)
4. `session.score += enemy.points`
5. If `score > highScore`, persist to `localStorage`

### Game Over Recording

On final life lost:

1. Update high score if needed
2. Append entry to history: `{ score, wave, achievedAt }`
3. Sort descending, keep top 10

---

## High Score

| Key | Value |
|---|---|
| `nyc212-high-score` | number (best score) |
| `nyc212-high-score-history` | JSON array of `HighScore` |

Load on game init. Write on beat and on game over.

**Trust:** local only — trivially editable in DevTools. Future rewards require server validation.

---

## Collision Detection

AABB overlap (`src/game/collision.ts`):

```text
overlap = a.x < b.x + b.width
      AND a.x + a.width > b.x
      AND a.y < b.y + b.height
      AND a.y + a.height > b.y
```

| Function | Use |
|---|---|
| `bulletHitsEnemy` | Player bullet vs living enemy |
| `bulletHitsPlayer` | Enemy bullet vs player |
| `enemyReachedPlayerZone` | Enemy Y vs player Y (breach) |

Player damage from bullets is skipped when `invincibleFrames > 0`.

---

## Enemy Firing

Each playing frame:

1. Decrement `enemyFireCooldown`
2. When cooldown ≤ 0:
   - Pick random living enemy (`pickRandomLivingEnemy`)
   - If enemy bullets < `MAX_ENEMY_BULLETS`, spawn bullet at enemy bottom center
   - Reset cooldown: `enemyFireIntervalForWave(wave)`

### Fire Interval Formula

```text
interval = max(28, 90 - (wave - 1) * 5)   // frames at ~60 FPS
```

Wave 1 ≈ 1.5 s between shots; later waves approach ~0.47 s minimum.

---

## Difficulty Scaling

### Enemy Speed

```text
speed = min(0.7 + wave * 0.18, 2.8)
```

Applied on new game and each wave via `applyWaveDifficulty()`.

### Formation Movement

1. Find min X and max X of living enemies
2. If right edge ≥ canvas − padding (moving right) or left edge ≤ padding (moving left):
   - Flip `enemyDirection`
   - Drop all living enemies by `ENEMY_DROP_DISTANCE`
3. Else: translate all living enemies by `direction × speed`
4. If any enemy Y + height ≥ player Y → breach (life loss)

---

## Wave Progression

### Clear Condition

`enemies.every(e => !e.alive)` → transition to `WAVE_CLEARED`.

### Next Wave (`prepareNextWave`)

1. `wave += 1`
2. Reset player position
3. `createEnemyGrid()`
4. Clear all bullets
5. Recalculate speed and fire interval

### Breach Recovery (`respawnEnemiesAfterBreach`)

1. New enemy grid
2. Clear bullets
3. Grant invincibility frames
4. Same wave number (no wave increment)

---

## Pause Behavior

- State → `PAUSED`
- `updatePlaying()` not called
- `draw()` still renders scene + overlay
- No movement, firing, or collision updates

Resume: `PAUSED` → `PLAYING`.

---

## Bullet Limits

| Owner | Max on screen |
|---|---|
| Player | 4 |
| Enemy | 10 |

Prevents spam and keeps collision loops bounded.

---

## Invincibility

- Duration: `INVINCIBILITY_FRAMES` (90 frames ≈ 1.5 s at 60 FPS)
- Visual: player hidden every other flash interval while invincible
- Blocks enemy bullet damage only (breach still applies on formation logic)

---

## Future: Score Validation

Planned server-side replay:

1. Client submits input log + seed + final score
2. Server replays simulation with fixed timestep
3. Accept if replay score matches within tolerance
4. Only validated scores eligible for leaderboard / Solana attestation

Not implemented in v0.3.
