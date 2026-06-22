# NYC 212 Invader — Testing

## Automated Checks

### Build (required before merge)

```bash
npm run build
```

Expect:

- TypeScript compile succeeds (`tsc -b`)
- Vite production bundle succeeds
- Output in `dist/` (not committed)

### Lint (optional)

```bash
npm run lint
```

---

## Manual Gameplay Checklist

Run `npm run dev`, open the local URL, and verify:

### Main Menu

- [ ] Game starts on main menu (not auto-playing)
- [ ] Title and "Press ENTER to start" visible
- [ ] `H` opens high scores
- [ ] `Enter` starts wave 1

### Movement and Shooting

- [ ] `←` `→` / `A` `D` move player
- [ ] Player stays within canvas
- [ ] `Space` fires upward bullets
- [ ] Max 4 player bullets enforced

### Enemies

- [ ] Grid visible (4×10)
- [ ] Formation moves and drops at walls
- [ ] Tier colors distinct (captain / scout / grunt)
- [ ] Destroying enemy adds correct points

### Enemy Bullets

- [ ] Enemies fire downward over time
- [ ] Fire rate increases on later waves
- [ ] Enemy bullet hit reduces life
- [ ] Player flashes when invincible after hit

### Lives and Game Over

- [ ] Start with 3 lives
- [ ] Game over at 0 lives
- [ ] Final score and high score shown
- [ ] `Enter` restarts from wave 1

### Breach

- [ ] Enemies reaching player zone cost a life
- [ ] Formation resets after breach (if lives remain)

### Pause

- [ ] `P` pauses during play
- [ ] Movement and shooting stop
- [ ] `P` resumes
- [ ] `Esc` returns to main menu from pause

### Wave Flow

- [ ] Clearing all enemies shows wave cleared
- [ ] `Enter` advances wave number
- [ ] Enemy speed noticeably higher on wave 2+

### High Score

- [ ] Beat previous best → updates HUD high score
- [ ] Refresh browser → high score persists
- [ ] History visible on high scores screen (`H`)

### Restart and Navigation

- [ ] `Esc` from game over → main menu
- [ ] `Esc` from wave cleared → main menu
- [ ] Touch ◀ ▶ move on mobile viewport
- [ ] Touch FIRE shoots
- [ ] Touch PAUSE / MENU work in game
- [ ] Touch START / OK / SCORES on overlays
- [ ] Canvas scales on narrow screen
- [ ] SFX play on shoot, hit, wave clear (after first tap/key)
- [ ] Explosion particles on enemy kill
- [ ] Screen shake on player hit

---

## Regression Targets

After refactors, re-run:

1. `npm run build`
2. Full manual checklist above
3. One full play: menu → wave 1 clear → wave 2 → game over → high scores

---

## Future Automated Tests

Planned (not in v0.3):

| Area | Tool | Notes |
|---|---|---|
| Collision helpers | Vitest | Pure functions in `collision.ts`, `scoring.ts` |
| State transitions | Vitest | Table-driven transition tests |
| E2E smoke | Playwright | Menu → start → shoot one enemy |
| Score replay | Custom harness | Server-side simulation match |

See [HARNESS.md](./HARNESS.md).
