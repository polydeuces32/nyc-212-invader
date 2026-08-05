# NYC 212 Invader — Gameplay

## Premise

Defend against waves of invaders in a grid formation. Destroy enemies for points, survive enemy fire, and clear waves to advance. The game is free, browser-based, and requires no wallet.

## Controls

| Input | Action |
|---|---|
| `←` / `→` or `A` / `D` | Move player (playing only) |
| `Space` | Fire player bullet (playing only) |
| `P` | Pause / resume (playing ↔ paused) |
| `Enter` | Start (menu) / next wave (wave cleared) / restart (game over) / exit high scores |
| `H` | High scores (main menu or game over) |
| `Esc` | Return to main menu; resets in-progress run |

### Touch (mobile / coarse pointer)

| Control | Action |
|---|---|
| ◀ ▶ | Move (playing only) |
| FIRE | Shoot — hold to repeat |
| PAUSE | Pause / resume |
| MENU | Abandon run → main menu |
| START | Start / restart game |
| OK | Confirm overlay (next wave, restart, return) |
| SCORES | High scores screen |
| MENU | Return to main menu (wave cleared, game over, high scores, or in-game) |

## Player Behavior

- Starts at bottom center with **3 lives**
- Moves horizontally at fixed speed; cannot leave canvas bounds
- Fires upward bullets; max **4** player bullets on screen
- **Invincibility** for ~1.5 seconds after taking damage (sprite flashes)
- Cannot shoot while paused or on non-playing screens

## Enemy Behavior

### Formation

- **4 rows × 10 columns** grid
- Moves as a block left/right; drops down when hitting side walls
- Speed increases each wave

### Tiers

| Tier | Row | Color (placeholder) | Points |
|---|---|---|---|
| Captain | Top | Gold | 300 |
| Scout | Middle two | Red | 200 |
| Grunt | Bottom | Pink | 100 |

### Enemy Fire

- Random living enemy fires downward on a cooldown
- Fire interval **decreases** as waves increase
- Max **10** enemy bullets on screen
- Enemy bullets are orange (placeholder)

### Breach

If any living enemy reaches the player's vertical zone:

- Player loses **1 life**
- Formation respawns at top
- Brief invincibility granted
- Game over if lives reach 0

## Waves

1. Wave 1 starts when player presses Enter on main menu
2. Clear all enemies → **Wave Cleared** screen
3. Press Enter → next wave with higher difficulty
4. Wave number shown in HUD

## Scoring

- Points awarded per enemy destroyed (tier-based)
- High score updates immediately when current score exceeds best
- High score persists in `localStorage` across sessions
- Run history stored locally (top 10 entries)

## Lives and Win/Loss

| Event | Effect |
|---|---|
| Hit by enemy bullet | −1 life, invincibility |
| Enemy breaches player zone | −1 life, formation reset |
| Lives = 0 | Game over |

There is no traditional "win" — survival and high score are the goals.

## Difficulty Scaling

Per wave increase:

| Parameter | Behavior |
|---|---|
| Enemy horizontal speed | `min(0.7 + wave × 0.18, 2.8)` |
| Enemy fire interval | `max(28, 90 − (wave − 1) × 5)` frames |

Higher waves = faster formation and more frequent enemy shots.

## Pause Behavior

- Press `P` during play to freeze updates
- Entities remain visible under pause overlay
- Shooting and movement disabled while paused
- Press `P` again to resume

## Future: Boss Waves

Planned for v0.4+:

- Boss appears every N waves (e.g. wave 5, 10, 15)
- Unique movement and attack patterns
- Bonus points and optional achievement hooks
- Not implemented in v0.3

## Future: Wallet and Rewards

- Playing remains free without wallet
- Optional on-chain verification may attach to **server-validated** scores only
- Local high score is not proof of achievement for rewards
