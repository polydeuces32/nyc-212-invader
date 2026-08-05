# NYC 212 Invader — Learning Log

Format for recording bugs, decisions, fixes, and lessons. Add new entries at the top.

---

## Entry Template

```markdown
### YYYY-MM-DD — Short title

**Context:** What were we doing?
**Issue:** What went wrong or what did we learn?
**Fix / Decision:** What changed?
**Lesson:** What to do next time?
```

---

## 2026-08-04 — Outstanding navigation and input bugs

**Context:** Sweep of outstanding gameplay bugs after v0.4 polish.

**Issue:**

- High scores opened from `GAME_OVER` always stored `returnState = MAIN_MENU`, violating the state machine and leaving stale score/lives on the menu HUD
- Touch overlay promised MENU on wave cleared / game over but had no MENU control
- Holding Space used OS key-repeat with no fire cooldown (unlike touch FIRE)
- Esc from wave cleared / game over did not clear particles

**Fix / Decision:**

- Added `highScoresReturnState()` / `canReturnToMainMenu()` helpers with Vitest coverage
- Unified Space + touch fire through `FIRE_COOLDOWN_FRAMES`
- Overlay MENU on wave cleared, game over, and high scores; `goToMainMenu()` clears particles

**Lesson:** Keep `returnState` tied to the opening screen; give touch the same exits keyboard has.

---

## 2026-06-22 — v0.3 state machine and enemy bullets

**Context:** Completing browser foundation before Solana.

**Issue:** Monolithic `App.tsx` mixed types, collision, storage, and loop logic. Game auto-started with no main menu. No enemy return fire.

**Fix / Decision:**

- Extracted `src/game/*` modules (constants, types, collision, storage, scoring, enemies, bullets, session)
- Added explicit `GameState` with main menu entry point
- Enemy bullets with cooldown scaling per wave
- Player invincibility frames after hit
- High score history in `localStorage`

**Lesson:** Keep React thin; put testable logic in pure modules. Ship menu-first UX before wallet or backend.

---

## 2026-06-22 — Pre-commit self-check fixes

**Context:** `CHECK_YOUR_OWN_CODE.md` review before commit.

**Issue:** One player bullet could destroy multiple enemies in a single frame; `Esc` to main menu left stale score/lives in HUD; `BOOT` transition ran inside `draw()`.

**Fix / Decision:** Break after first enemy hit per bullet; `returnToMainMenu()` resets session on all `Esc` paths; `BOOT` → `MAIN_MENU` in `update()`.

**Lesson:** Run collision and state-transition reviews before marking v0.3 done.

---

## 2026-06-22 — v0.2 local persistence

**Context:** Arcade polish pass.

**Issue:** Needed lives, pause, waves, and score retention without a server.

**Fix / Decision:** `localStorage` key `nyc212-high-score`; pause toggles update skip; wave clear waits for Enter.

**Lesson:** Local storage is fine for personal bests; document untrusted nature early for future rewards.

---

## 2026-06-22 — v0.1 prototype

**Context:** Initial Vite + Canvas shooter.

**Issue:** Prove stack before feature creep.

**Fix / Decision:** Single canvas in React `useEffect`; grid enemies; rectangle placeholders.

**Lesson:** Gray-box gameplay validates fun before art pipeline.

---

## Open Questions

- Boss wave timing (every 5 waves?)
- Touch control layout for mobile
- Input log format for replay validator

Add answers here as they are resolved.
