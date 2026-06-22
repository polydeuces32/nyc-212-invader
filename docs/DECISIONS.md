# NYC 212 Invader — Architecture Decision Records

Lightweight ADRs for major product and technical choices.

---

## ADR-001: Browser-First Delivery

**Status:** Accepted

**Context:** Need a playable game before blockchain or backend investment.

**Decision:** Ship a free browser game as the primary product. No install, no wallet.

**Consequences:** Static hosting sufficient for v0.x; all gameplay client-side; Solana deferred.

---

## ADR-002: Canvas over Pygame (or Native)

**Status:** Accepted

**Context:** Goal is GitHub-deployable, link-shareable arcade game.

**Decision:** HTML Canvas inside React (Vite), not Python/Pygame or native builds.

**Consequences:** One codebase for web deploy; keyboard-first; mobile needs extra work in v0.4.

---

## ADR-003: Wallet Optional Later

**Status:** Accepted

**Context:** Crypto features must not block casual players.

**Decision:** Wallet connect only in v0.6+ for optional attestation/rewards.

**Consequences:** No Web3 dependencies in v0.3; onboarding stays guest-first.

---

## ADR-004: Solana Later

**Status:** Accepted

**Context:** Verified scores and tournaments may use Solana.

**Decision:** No Solana code until v0.6 devnet experiment, after deployable browser game.

**Consequences:** Docs describe future layer; no RPC keys or adapters in current repo.

---

## ADR-005: Original IP

**Status:** Accepted

**Context:** Arcade inspiration must not infringe Space Invaders or other protected IP.

**Decision:** NYC 212 Invader branding, original placeholders, no licensed invader assets.

**Consequences:** See [IP.md](./IP.md); art pipeline must track licenses.

---

## ADR-006: Local High Score Before Backend

**Status:** Accepted

**Context:** Need persistence without infra cost.

**Decision:** `localStorage` for high score and history in v0.x.

**Consequences:** Scores are not trusted for rewards; server validation required later.

---

## ADR-007: Grid Formation Before Advanced Formations

**Status:** Accepted

**Context:** Spiral and alternate formations add complexity.

**Decision:** Keep classic grid movement for v0.3; optional formation mode flag later.

**Consequences:** Simpler collision and wave logic; boss waves can use separate spawner later.

---

## ADR-008: Game Logic Modules under `src/game/`

**Status:** Accepted (v0.3)

**Context:** `App.tsx` grew too large for maintainability.

**Decision:** Extract constants, types, collision, storage, scoring, enemies, bullets, session.

**Consequences:** Easier unit tests; React file owns loop and draw only.

---

## Rejected / Deferred

| Proposal | Reason |
|---|---|
| Auto-start game on load | Poor UX; skip tutorial/menu |
| Client-only trusted leaderboard | Trivially cheatable |
| Solana in v0.3 | Violates browser-first milestone |
