# NYC 212 Invader — Cloudflare Pages Deployment

Static Vite build deployed to **Cloudflare Pages**. No server runtime. No secrets in the frontend bundle.

---

## Build Settings (Dashboard)

If connecting GitHub in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | `22` (or use `.node-version`) |

Environment variables: **none required** for v0.x.

---

## Option A — GitHub → Cloudflare (Recommended) ✅

Use this path. Cloudflare builds and deploys on every push to `main`.

### Step 1 — Push repo to GitHub

If not on GitHub yet:

```bash
git add .
git commit -m "Prepare Cloudflare Pages deployment"
gh repo create nyc-212-invader --public --source=. --push
```

Or create a repo manually on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/nyc-212-invader.git
git push -u origin main
```

### Step 2 — Connect Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages**
2. **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub and select **nyc-212-invader**
4. **Production branch:** `main`

### Step 3 — Build settings

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

Click **Environment variables** → add (optional but recommended):

| Variable | Value |
|---|---|
| `NODE_VERSION` | `22` |

Cloudflare also reads `.node-version` from the repo.

### Step 4 — Deploy

Click **Save and Deploy**. First build takes ~1–2 minutes.

Your live URL:

```text
https://nyc-212-invader.pages.dev
```

(Or the project name you chose in Cloudflare.)

### Step 5 — Verify

- Main menu loads
- Press Enter → game starts
- Refresh → high score persists
- Test on phone for touch controls

### After setup

Every `git push` to `main` triggers a new production deploy automatically.

Preview URLs are created for other branches if you enable branch previews in project settings.

**Note:** The GitHub Actions deploy workflow in this repo is manual-only (`workflow_dispatch`) so it does not double-deploy with Cloudflare Git integration.

---

## Option B — Manual CLI Deploy

### One-time setup

```bash
npm install
npx wrangler login
```

### Deploy

```bash
npm run build
npm run deploy
```

First deploy creates the Pages project if it does not exist.

---

## Local Production Preview

```bash
npm run build
npm run preview
```

---

## Files

| File | Purpose |
|---|---|
| `wrangler.toml` | Pages project name + output dir |
| `public/_redirects` | SPA fallback to `index.html` |
| `public/_headers` | Cache headers for hashed assets |
| `.node-version` | Node 22 for CI and Cloudflare |
| `.github/workflows/ci.yml` | Build + lint on PR/push |
| `.github/workflows/deploy-cloudflare-pages.yml` | Deploy on push to `main` |

---

## Custom Domain (Optional)

Cloudflare Pages → your project → **Custom domains** → add domain.

Example: `play.yourdomain.com`

No code changes required if the site is served from domain root (`/`).

---

## Rollback

Cloudflare Pages → **Deployments** → select a previous deployment → **Rollback to this deployment**.

---

## Security

- Do not add API keys or RPC URLs to Cloudflare env vars for v0.x (game is client-only).
- `CLOUDFLARE_API_TOKEN` lives in GitHub Secrets only — never commit it.
- Future backend/Solana keys stay server-side, not in this static bundle.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Blank page | Hard refresh; check browser console |
| Old build cached | Purge cache in Cloudflare or redeploy |
| Build fails on Cloudflare | Confirm Node 22 and `npm run build` locally |
| 404 on refresh | Ensure `public/_redirects` is present (copied to `dist/` by Vite) |

---

## Verify After Deploy

1. Main menu loads (no auto-start)
2. Enter starts game
3. High score persists after browser refresh
4. Mobile touch controls work on phone

See [TESTING.md](./TESTING.md) for full checklist.
