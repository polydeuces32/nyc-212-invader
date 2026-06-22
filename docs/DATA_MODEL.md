# NYC 212 Invader — Data Model

## Current (Local-Only, v0.3)

All runtime data lives in memory inside the Canvas game loop. Persistence uses `localStorage` only.

### GameSession

Top-level mutable session object for one playthrough.

```typescript
type GameSession = {
  state: GameState;
  score: number;
  lives: number;
  wave: number;
  player: Player;
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  enemyDirection: number;      // 1 or -1
  enemySpeed: number;
  invincibleFrames: number;
  enemyFireCooldown: number;
};
```

Created by `createSession()` in `src/game/session.ts`.

### PlayerState

Subset of player-related fields (useful for future APIs):

```typescript
type Player = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

type PlayerState = {
  x: number;
  y: number;
  lives: number;
  invincibleFrames: number;
};
```

### Enemy

```typescript
type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  tier: "grunt" | "scout" | "captain";
  points: number;
};
```

Grid spawned by `createEnemyGrid()`. Points derived from tier at spawn.

### Bullet

```typescript
type Bullet = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  owner: "player" | "enemy";
};
```

Separate arrays: `playerBullets`, `enemyBullets`.

### HighScore

Persisted entry:

```typescript
type HighScore = {
  score: number;
  wave: number;
  achievedAt: string;   // ISO 8601
};
```

Storage keys:

- `nyc212-high-score` — single best score (number string)
- `nyc212-high-score-history` — `HighScore[]` JSON (max 10)

---

## Future Backend Models (Not Implemented)

### GuestPlayer

```typescript
type GuestPlayer = {
  guestId: string;           // opaque UUID from server
  createdAt: string;
  displayName?: string;
};
```

Anonymous play without wallet. Session cookie or device token.

### RegisteredPlayer

```typescript
type RegisteredPlayer = {
  playerId: string;
  email?: string;
  walletAddress?: string;    // optional, v0.6+
  createdAt: string;
};
```

### LeaderboardEntry

```typescript
type LeaderboardEntry = {
  rank: number;
  playerId: string;
  displayName: string;
  score: number;
  wave: number;
  validatedAt: string;
  submissionId: string;
};
```

Only server-validated submissions appear.

### RewardClaim

```typescript
type RewardClaim = {
  claimId: string;
  playerId: string;
  submissionId: string;
  rewardType: "achievement" | "tournament" | "token";
  status: "pending" | "confirmed" | "failed";
  txSignature?: string;      // Solana, devnet/mainnet
};
```

Requires validated score + optional wallet.

---

## Data Flow (Current)

```text
Player input → GameSession (memory) → Canvas draw
                    ↓
              localStorage (high score only)
```

## Data Flow (Future)

```text
Player input → GameSession → Input log
                    ↓
              Submit to API → Replay validation
                    ↓
              Leaderboard / optional Solana attestation
```

Local `localStorage` scores remain for casual play; they do not gate rewards.
