# CHECK_YOUR_OWN_CODE.md

## Purpose

Before any code is committed, the assistant or developer must review the work like a senior engineer.

The goal is to catch bugs, regressions, security issues, poor structure, and incomplete implementation before they become project debt.

## Required Self-Check

For every change, verify:

* Does the game still run?
* Does `npm run build` pass?
* Are there TypeScript errors?
* Are there unused imports?
* Are event listeners cleaned up?
* Is the game loop cleaned up correctly?
* Did the change break movement, shooting, scoring, lives, pause, restart, or high score?
* Did the change introduce unnecessary complexity?
* Did the change affect browser performance?
* Did the change accidentally commit `dist`, `node_modules`, secrets, or API keys?

## Gameplay Review

Check:

* Player movement works
* Shooting works
* Enemy behavior works
* Collision detection works
* Score updates correctly
* High score persists after refresh
* Pause/resume works
* Game over works
* Wave cleared flow works
* Restart flow works

## Architecture Review

Check:

* Game logic is readable
* State transitions are clear
* Constants are not scattered randomly
* Types are explicit
* Rendering logic is understandable
* Future features can be added without rewriting everything

## Security Review

Check:

* No private keys
* No wallet secrets
* No RPC keys
* No `.env` files committed
* No Solana integration added before the game is ready
* Local scores are treated as untrusted for future rewards

## Documentation Review

When code changes behavior, update the matching docs:

* `docs/ARCHITECTURE.md`
* `docs/GAMEPLAY.md`
* `docs/ALGORITHM.md`
* `docs/STATE_MACHINE.md`
* `docs/TESTING.md`
* `docs/ROADMAP.md`

## Required Commands

Run:

```bash
npm run build
git status
```

Optional:

```bash
git diff
git log --oneline -5
```

## Definition of Done

A change is done only when:

* Build passes
* Game behavior is manually tested
* Git status is clean or intentional
* Docs are updated if behavior changed
* No secrets or generated files are staged
* The change is small enough to understand
