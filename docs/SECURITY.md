# NYC 212 Invader — Security

## Current Version (v0.3)

### What We Do

| Rule | Implementation |
|---|---|
| No secrets in repo | No `.env` committed; no API keys in source |
| No wallet required | Game runs without Web3 libraries |
| No private keys | None in frontend or repo |
| No external network calls | Pure client-side; no fetch to third parties during play |
| Static build only | `dist/` gitignored |

### What We Do Not Trust

| Asset | Trust level |
|---|---|
| `localStorage` high score | **Untrusted** — user can edit in DevTools |
| Client-reported score | **Untrusted** for any future reward |
| Wave number in history | **Untrusted** locally |

Local scores are for fun and personal progress only.

### Browser Surface

- Input: keyboard only (no form submissions)
- Storage: `localStorage` for scores
- No cookies, no auth tokens in v0.3

---

## Future Backend Security

When a score API is added:

1. **Validate on server** — replay input log or deterministic simulation
2. **Rate limit** submissions per guest/player
3. **Reject** impossible scores (timing, max enemies, max points)
4. **Sign** validated results server-side
5. **Never** accept raw `localStorage` as proof

### API Keys

- Backend holds database and validation secrets
- Frontend receives only public endpoints
- Solana RPC keys stay on server or edge function — **never** in Vite bundle

---

## Future Solana Security

| Rule | Detail |
|---|---|
| Wallet optional | Connect only for attestation/rewards |
| No seed phrases in app | Use standard wallet adapters |
| Devnet first | v0.6 on devnet only |
| Server gate | On-chain tx only after validated submission |
| RPC keys | Server-side proxy; no exposed mainnet RPC in browser |

### Threat Model (Future)

- Client tampering with score → mitigated by server replay
- Fake wallet signatures → mitigated by wallet adapter + server correlation
- Front-running rewards → mitigated by server-issued claim tokens

---

## Developer Practices

- Run `npm audit` periodically
- Do not commit `node_modules` or `dist`
- Review dependencies before adding Web3 packages
- Keep Solana scope minimal when added (adapter + program IDs only)

---

## Reporting

If you discover a security issue in deployed infrastructure (future), report through the project maintainer channel — not in public issues for exploitable bugs.
