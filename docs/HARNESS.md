# NYC 212 Invader — Validation Harness

How to run, verify, and eventually automate quality checks for NYC 212 Invader.

---

## Local Development Server

```bash
npm install
npm run dev
```

1. Open the URL printed by Vite (typically `http://localhost:5173`)
2. Confirm main menu appears
3. Run [TESTING.md](./TESTING.md) manual checklist

---

## Production Build

```bash
npm run build
```

Validates:

- TypeScript types across `src/` and `src/game/`
- Tree-shaken production bundle
- No compile errors

Preview production build locally:

```bash
npm run preview
```

---

## Manual Gameplay Checklist

Use the full checklist in [TESTING.md](./TESTING.md).

Minimum smoke path (~2 minutes):

1. Main menu → Enter
2. Move and shoot
3. Pause → resume
4. Take damage or lose a life
5. Clear wave or die
6. Check high score persists after refresh

---

## Git Pre-Commit Sanity

Before committing gameplay changes:

```bash
npm run build
git status
```

Ensure:

- `dist/` not staged
- `node_modules/` not staged
- No `.env` or secrets

---

## Automated Unit Tests

```bash
npm test
```

Current coverage:

- `src/game/navigation.test.ts` — high-score return state and menu exits

Priority follow-ups:

- `src/game/collision.ts` — overlap edge cases
- `src/game/scoring.ts` — wave formulas
- `src/game/session.ts` — reset and next wave invariants

---

## Future: E2E Tests

**Target:** Playwright against `npm run preview`.

Scenarios:

- Loads main menu
- Enter starts game
- Canvas has expected dimensions
- Keyboard events do not throw

---

## Future: Score Replay Validation

For anti-cheat and Solana attestation:

1. Record compact input log during `PLAYING`
2. Export `{ seed, inputs[], claimedScore, wave }`
3. Headless replay in Node with same constants
4. Pass if `|replayScore - claimedScore| ≤ 0`

Harness location (planned): `tools/replay/` or server worker.

---

## CI Harness (v0.5)

Planned GitHub Actions job:

```yaml
# illustrative
- run: npm ci
- run: npm run build
- run: npm run lint
# - run: npm test   # when added
```

Deploy artifact: `dist/` to GitHub Pages or Vercel.

---

## Performance Spot Check

In browser DevTools:

- Stable ~60 FPS during play
- No growing memory over 5+ minutes (listener leak check)
- `requestAnimationFrame` cancelled on page leave

---

## Harness Ownership

| Phase | Owner action |
|---|---|
| v0.3 | Manual checklist + `npm run build` |
| v0.4 | Add Vitest for collision/scoring |
| v0.5 | CI build on every push |
| v0.6+ | Replay validator for score API |
