# NYC 212 Invader — Roadmap

Phased delivery plan. Solana and wallet features are explicitly deferred until the browser game is complete and deployable.

---

## v0.1 — Gray-Box Prototype ✅

**Goal:** Prove canvas shooter loop in Vite + React.

- [x] React + TypeScript + Vite initialized
- [x] Canvas game screen
- [x] Player movement
- [x] Shooting
- [x] Enemy grid
- [x] Bullet/enemy collision
- [x] Score system
- [x] Production build passes

---

## v0.2 — Local Score and Gameplay Polish ✅

**Goal:** Arcade feel with lives, waves, and persistence.

- [x] Enemy formation movement (sideways + drop)
- [x] Enemy tiers and variable scoring
- [x] Lives and game over
- [x] Local high score (`localStorage`)
- [x] Pause / resume (`P`)
- [x] Wave clear → next wave flow
- [x] Difficulty ramp per wave (enemy speed)

---

## v0.3 — Game States and Enemy Bullets ✅ (current)

**Goal:** Complete browser game foundation before assets or blockchain.

- [x] Clean game state machine (`BOOT` → `MAIN_MENU` → …)
- [x] Main menu (no auto-start)
- [x] Playing, paused, wave cleared, game over, high scores screens
- [x] Enemy projectiles
- [x] Player damage with invincibility frames
- [x] Bullet caps (player and enemy)
- [x] Collision helpers in `src/game/`
- [x] High score history screen
- [x] Full engineering documentation
- [x] README update

---

## v0.4 — Assets, Sound, and Mobile ✅ (current)

**Goal:** Production feel on desktop and phone.

- [x] Original canvas sprite art (NYC 212 Invader IP — procedural pixel ships/drones)
- [x] Procedural SFX via Web Audio (no external audio files)
- [x] Touch controls (move, fire, pause, menu, overlay buttons)
- [x] Responsive canvas scaling (DPR-aware, container-fit)
- [x] Screen shake and explosion particles on hit/kill
- [ ] Optional boss wave prototype (deferred)

---

## v0.5 — Cloudflare Pages Deployment

**Goal:** Public free play URL on Cloudflare.

- [x] `wrangler.toml` + deploy script
- [x] SPA `_redirects` and asset `_headers`
- [x] GitHub Actions CI (build + lint)
- [x] GitHub Actions Cloudflare Pages deploy workflow
- [x] [DEPLOY.md](./DEPLOY.md) documentation
- [ ] Connect GitHub repo in Cloudflare dashboard (or run first CLI deploy)
- [ ] Add live URL to README
- [ ] Optional custom domain

---

## v0.6 — Optional Solana Devnet

**Goal:** Prove verified score flow without requiring wallet to play.

- [ ] Backend score validation API
- [ ] Guest play remains default
- [ ] Optional wallet connect for score attestation
- [ ] Devnet-only rewards / achievements
- [ ] No mainnet, no real money

---

## v1.0 — Production Browser Game

**Goal:** Shippable public arcade title.

- [ ] Polished assets and audio
- [ ] Stable deployed URL
- [ ] Leaderboard (backend-validated)
- [ ] Mobile-friendly controls
- [ ] Documented onboarding for new players
- [ ] Optional wallet layer clearly labeled optional

---

## Explicitly Out of Scope (Until v0.6+)

- Solana mainnet integration
- Wallet required to start game
- Real-money tournaments
- Space Invaders branding, sprites, or audio
- Spiral or alternate formations (until clean formation-mode flag exists)
