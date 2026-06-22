# NYC 212 Invader Algorithms

## Score Algorithm

Enemy tiers determine score value:

| Enemy Tier | Position | Points |
|---|---:|---:|
| Captain | Top row | 300 |
| Scout | Middle rows | 200 |
| Grunt | Bottom row | 100 |

When a bullet collides with a living enemy:

1. Mark enemy as destroyed.
2. Add enemy point value to score.
3. Update local high score if current score is greater.

## High Score Algorithm

Storage key:

localStorage["nyc212-high-score"]

Rules:

- High score is loaded on game start.
- High score updates immediately when score exceeds previous value.
- High score survives browser refresh.
- High score is local only in v0.2.

## Wave Algorithm

When all enemies are destroyed:

1. Mark wave as cleared.
2. Wait for player to press Enter.
3. Increment wave.
4. Increase enemy speed.
5. Recreate enemy grid.

## Pause Algorithm

When player presses P:

- Toggle paused state.
- Stop game updates.
- Continue rendering pause overlay.
- Prevent shooting while paused.
