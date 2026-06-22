# NYC 212 Invader — Onboarding

Guest-first flow: play immediately, no account, no wallet.

---

## Player Journey (v0.3)

```text
Open URL → Main Menu → Play → Local High Score → (optional) Play Again
```

### Step 1: Open Game

- Local: `npm run dev` → browser URL
- Future: public GitHub Pages / Vercel link (v0.5)

No download. No registration.

### Step 2: Main Menu

- Read controls on page footer
- Press **Enter** to start
- Press **H** to view local high scores

### Step 3: Play

- Move with arrows or A/D
- Shoot with Space
- Pause with P
- Survive waves; score points by destroying enemies

### Step 4: Between Waves

- Clear all enemies → **Wave Cleared**
- Press **Enter** for next wave (harder)
- Press **Esc** to quit to menu

### Step 5: Game Over

- Lives reach zero
- See final score vs high score
- **Enter** — restart
- **H** — high scores
- **Esc** — main menu

### Step 6: High Scores

- Best score and recent runs (local only)
- **Esc** or **Enter** to go back

---

## What We Do Not Ask For

| Item | v0.3 |
|---|---|
| Email | No |
| Password | No |
| Wallet | No |
| Solana | No |
| Payment | No |
| Cookies / tracking | No |

---

## Future: Optional Registration (v0.5+)

Planned guest upgrade path:

1. Play as guest (default)
2. Optional "Save to cloud" with email or OAuth
3. Global leaderboard for validated runs only

Guest play remains fully functional without account.

---

## Future: Optional Wallet (v0.6+)

Planned flow:

1. Play entire game without wallet
2. After server-validated high run, optional **Connect Wallet**
3. Attest score or claim devnet achievement

Wallet never required to shoot, move, or complete waves.

---

## Developer Onboarding

New contributor quick start:

```bash
git clone <repo>
cd nyc-212-invader
npm install
npm run dev
```

Read in order:

1. [README.md](../README.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)
3. [STATE_MACHINE.md](./STATE_MACHINE.md)
4. [ROADMAP.md](./ROADMAP.md)
5. [LOOP.md](./LOOP.md)

Before first PR: `npm run build` + [TESTING.md](./TESTING.md) smoke checklist.

---

## Support Expectations

v0.x is experimental:

- Local scores may reset if browser storage cleared
- Balance may change between versions
- No guaranteed reward for high scores until validation ships
