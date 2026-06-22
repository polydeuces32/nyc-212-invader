# NYC 212 Invader — Architecture

## Overview

NYC 212 Invader is a browser-first arcade shooter built with **Vite + React + TypeScript** and rendered on an **HTML Canvas**. Gameplay runs entirely client-side with no wallet, no backend, and no blockchain dependencies in v0.x.

The architecture prioritizes:

1. Fast local play in any modern browser
2. Clear separation between rendering shell (React) and game logic (Canvas loop)
3. A explicit state machine for all player-facing screens
4. Modular game helpers that can later connect to a backend or Solana layer without rewriting core gameplay

## Frontend Stack

| Layer | Technology | Role |
|---|---|---|
| Build | Vite 8 | Dev server, HMR, production bundling |
| UI shell | React 19 | Mounts canvas, provides page layout |
| Language | TypeScript | Type-safe game and UI code |
| Rendering | Canvas 2D | All gameplay visuals and overlays |
| Persistence | `localStorage` | Local high score and run history |

## Directory Layout

```
src/
├── App.tsx              # React entry, canvas ref, game loop, input, draw
├── App.css              # Page shell styling
├── index.css            # Global styles
├── main.tsx             # React bootstrap
└── game/
    ├── constants.ts     # Tunable gameplay numbers
    ├── types.ts         # GameSession, entities, GameState
    ├── collision.ts     # AABB overlap helpers
    ├── storage.ts       # localStorage read/write
    ├── scoring.ts       # Points and difficulty curves
    ├── enemies.ts       # Grid spawn, formation movement
    ├── bullets.ts       # Spawn, move, cap bullets
    ├── session.ts       # New game, next wave, menu return
    ├── render.ts        # Sprites, HUD, overlays, canvas scale
    ├── audio.ts         # Procedural Web Audio SFX
    ├── effects.ts       # Particles, screen shake, starfield
    └── touch.ts         # Touch input state
```

React owns the DOM and touch overlay buttons. The game loop lives inside a single `useEffect` in `App.tsx`.

## Canvas Game Loop

Each animation frame:

1. **Update** — only when `state === PLAYING`
   - Read held keys for movement
   - Move player bullets and enemy bullets
   - Resolve player-bullet vs enemy collisions
   - Tick enemy fire cooldown and spawn enemy bullets
   - Resolve enemy-bullet vs player collisions (with invincibility)
   - Move enemy formation; detect breach into player zone
   - Detect wave clear or game over
2. **Draw** — always runs
   - Clear canvas
   - Render HUD, entities, and state-specific overlays

Cleanup on unmount:

- `cancelAnimationFrame`
- Remove `keydown` / `keyup` listeners

This prevents duplicate listeners and runaway frames when React remounts.

## State Machine

Game flow is driven by `GameState` in `src/game/types.ts`:

| State | Purpose |
|---|---|
| `BOOT` | One-frame init; transitions to main menu |
| `MAIN_MENU` | Title screen; game does not auto-start |
| `PLAYING` | Active gameplay |
| `PAUSED` | Frozen updates; overlay shown |
| `WAVE_CLEARED` | Between waves; wait for Enter |
| `GAME_OVER` | Lives exhausted |
| `HIGH_SCORES` | Local score history view |

See [STATE_MACHINE.md](./STATE_MACHINE.md) for allowed transitions.

Input is handled in one `keydown` handler keyed off `session.state`. Movement and shooting only apply while `PLAYING`.

## Collision Design

Collision is AABB (axis-aligned bounding box) overlap:

- `bulletHitsEnemy` — player shots destroy enemies
- `bulletHitsPlayer` — enemy shots damage player when not invincible
- `enemyReachedPlayerZone` — formation breach costs a life

Helpers live in `src/game/collision.ts` so future unit tests can import them without mounting React.

## Persistence

Current (v0.3):

- `nyc212-high-score` — best score integer
- `nyc212-high-score-history` — JSON array of recent runs (score, wave, timestamp)

Implemented in `src/game/storage.ts`. Scores are **local hints only** — not trusted for rewards.

## Future Backend (Not Implemented)

A future API layer may provide:

- Guest and registered player accounts
- Server-validated score submission
- Global leaderboards
- Anti-cheat replay validation
- Tournament brackets

Gameplay simulation should remain client-side for responsiveness. The backend validates outcomes; it does not run the frame loop.

## Future Solana Layer (Not Implemented)

Solana is an **optional enhancement** for v0.6+:

- Verified score attestations
- Achievement NFTs or badges
- Tournament prize settlement

Rules for later integration:

- Wallet is never required to play v0.x
- No private keys or RPC secrets in the frontend
- On-chain actions only after server validation
- Gameplay stays off-chain

## Why Gameplay Stays Off-Chain

| Reason | Detail |
|---|---|
| Latency | 60 FPS canvas loop cannot wait on RPC |
| Accessibility | Browser play without wallet install |
| Cost | No per-shot transaction fees |
| Trust model | Server replay validation beats client-signed scores |
| Product order | Free playable game ships before crypto features |

## Build and Deploy

- Dev: `npm run dev`
- Production: `npm run build` → static assets in `dist/`
- Target: GitHub Pages or any static host (v0.5)

No server runtime is required for the current version.
