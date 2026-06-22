# NYC 212 Invader

A free, browser-playable arcade shooter set in the NYC 212 universe. Built with Vite, React, TypeScript, and HTML Canvas. No wallet required. No Solana in v0.x.

## Current Status

**v0.4 — Assets, sound, and mobile polish**

- Original pixel-style canvas sprites (player ship, enemy drones)
- Procedural Web Audio SFX (shoot, hit, wave clear, game over)
- Touch controls for mobile (move, fire, pause, menu)
- Responsive canvas scaling with retina support
- Screen shake and particle explosions
- All v0.3 features retained

## Tech Stack

- [Vite](https://vitejs.dev/) 8
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- HTML Canvas 2D (no game engine)

## Features

- Player movement and shooting
- 4×10 enemy grid formation
- Enemy tiers: Captain (300), Scout (200), Grunt (100)
- Enemy bullets with wave-scaled fire rate
- Lives, invincibility frames, game over
- Wave progression with increasing difficulty
- Pause / resume
- Local high score and run history (`localStorage`)

- Screen shake and hit/kill particle effects
- Responsive canvas (scales to screen, retina-aware)
- Touch controls on mobile / coarse pointer devices

## Controls

### Keyboard

| Key | Action |
|---|---|
| `←` `→` or `A` `D` | Move |
| `Space` | Shoot |
| `P` | Pause / resume |
| `Enter` | Start / next wave / restart |
| `H` | High scores |
| `Esc` | Main menu |

### Touch (mobile)

| Control | Action |
|---|---|
| ◀ ▶ | Move |
| FIRE | Shoot (hold) |
| PAUSE | Pause / resume |
| MENU | Return to main menu |
| START / OK / SCORES | Menu overlays |

## Local Install

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

Output is written to `dist/` (gitignored).

Preview production build:

```bash
npm run preview
```

## Deploy (Cloudflare Pages)

See [docs/DEPLOY.md](./docs/DEPLOY.md) for full setup.

**Quick CLI deploy** (after `npx wrangler login`):

```bash
npm run deploy
```

**GitHub auto-deploy:** push to `main` with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in repo secrets.

Live URL format: `https://nyc-212-invader.pages.dev`

## Roadmap

| Version | Focus |
|---|---|
| v0.1 | Prototype ✅ |
| v0.2 | Lives, pause, local score ✅ |
| v0.3 | States, enemy bullets ✅ |
| v0.4 | Assets, sound, mobile ✅ |
| v0.5 | Cloudflare Pages deployment |
| v0.6 | Optional Solana devnet |
| v1.0 | Production browser game |

See [docs/ROADMAP.md](./docs/ROADMAP.md) for detail.

## Documentation

| Doc | Topic |
|---|---|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design |
| [GAMEPLAY.md](./docs/GAMEPLAY.md) | Rules and controls |
| [STATE_MACHINE.md](./docs/STATE_MACHINE.md) | Game states |
| [ONBOARDING.md](./docs/ONBOARDING.md) | Player and dev onboarding |
| [TESTING.md](./docs/TESTING.md) | Manual test checklist |
| [DEPLOY.md](./docs/DEPLOY.md) | Cloudflare Pages deployment |

Full index in `docs/`.

## Wallet / Solana

**Not required for v0.x.** The game is fully playable without installing a wallet or connecting to Solana. Optional blockchain features are planned for v0.6+ as a verified-score enhancement only.

## Intellectual Property

NYC 212 Invader uses **original branding and canvas-drawn pixel art**. Procedural audio is generated in-browser (Web Audio API). It is inspired by classic arcade shooters but does **not** use Space Invaders names, logos, sprites, or sounds. See [docs/IP.md](./docs/IP.md).

## License

See repository license file when published.
