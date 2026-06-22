# NYC 212 Invader — Development Loop

Repeatable cycle for shipping safe, documented increments.

---

## The Loop

```text
Observe → Test → Identify weakness → Fix → Build → Commit → Document → Repeat
```

---

## 1. Observe

- Play the build locally (`npm run dev`)
- Watch FPS, input feel, difficulty curve
- Read player feedback or issue list
- Compare behavior to [GAMEPLAY.md](./GAMEPLAY.md)

---

## 2. Test

- Run `npm run build`
- Execute [TESTING.md](./TESTING.md) checklist for touched areas
- After state/input changes, test all transitions in [STATE_MACHINE.md](./STATE_MACHINE.md)

---

## 3. Identify Weakness

Examples:

- Enemy fire too harsh on wave 2
- Pause does not block shooting
- High score not persisting
- Type errors in game modules
- Missing docs for new behavior

Log significant findings in [LEARNING.md](./LEARNING.md).

---

## 4. Fix

- Smallest complete fix
- Match existing patterns in `src/game/`
- No scope creep (no Solana, no art pipeline unless milestone says so)
- Prefer pure functions for testable logic

---

## 5. Build

```bash
npm run build
```

Must pass before commit. Fix TypeScript errors at source, not with `any`.

---

## 6. Commit

- Stage only intentional files
- Never commit `dist/`, `node_modules/`, secrets
- Message: what changed and why (one or two sentences)

---

## 7. Document

Update when behavior or architecture changes:

| Change type | Docs to touch |
|---|---|
| New game state | `STATE_MACHINE.md`, `GAMEPLAY.md` |
| Scoring / collision | `ALGORITHM.md`, `DATA_MODEL.md` |
| New milestone | `ROADMAP.md` |
| Security implication | `SECURITY.md` |
| Major choice | `DECISIONS.md` |
| Bug lesson | `LEARNING.md` |
| User-facing | `README.md` |

---

## 8. Repeat

Pick next item from [ROADMAP.md](./ROADMAP.md) or open issue.

---

## Milestone Exit Criteria

Before closing a version (e.g. v0.3):

- [ ] Roadmap checkboxes accurate
- [ ] `npm run build` green
- [ ] Manual test checklist passed
- [ ] README status updated
- [ ] No wallet/blockchain code unless milestone allows

---

## Anti-Patterns

- Committing without build
- Documenting features not in code
- Adding backend before browser game is fun
- Copying Space Invaders assets (see [IP.md](./IP.md))
