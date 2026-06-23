# NYC 212 Invader — Cloudflare Pages Deployment

Static Vite build deployed to **Cloudflare Pages**. No server runtime. No secrets in the frontend bundle.

**Repository:** https://github.com/polydeuces32/nyc-212-invader

---

## Deployment model

| Workflow | Trigger | Purpose |
|---|---|---|
| **CI** (`.github/workflows/ci.yml`) | Every push/PR to `main` | `npm ci`, lint, build — no deploy |
| **Deploy Cloudflare Pages** (`.github/workflows/deploy-cloudflare-pages.yml`) | **Manual only** (`workflow_dispatch`) | Build `dist/` and deploy via Wrangler |

CI passing does **not** deploy the game. You must either trigger the deploy workflow manually (after secrets are set) or use Cloudflare Connect Git (alternative below).

---

## One-time setup: GitHub repository secrets

The deploy workflow **requires** two secrets. Without them, Wrangler fails with:

```text
In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable
```

### 1. Get Cloudflare Account ID

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Open **Workers & Pages**
3. Copy **Account ID** from the right sidebar (under Account Home)

Save this value for `CLOUDFLARE_ACCOUNT_ID`.

### 2. Create Cloudflare API token

1. Cloudflare dashboard → profile icon → **My Profile** → **API Tokens**
2. **Create Token**
3. Use template **Edit Cloudflare Workers** (includes Pages deploy permissions), or create a custom token with:

| Permission | Access |
|---|---|
| Account → Cloudflare Pages | Edit |
| Account → Account Settings | Read (optional, for account scoping) |

4. **Account Resources:** include your account
5. Create token and **copy it once** (you will not see it again)

Save this value for `CLOUDFLARE_API_TOKEN`.

**Minimum scope:** token must be allowed to deploy to Cloudflare Pages for project `nyc-212-invader`. If the project does not exist yet, the first successful deploy creates it.

### 3. Add secrets to GitHub

1. Open https://github.com/polydeuces32/nyc-212-invader/settings/secrets/actions
2. **New repository secret** for each:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token from step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from step 1 |

Names must match **exactly** (case-sensitive).

**Never** commit these values to git, `wrangler.toml`, or `.env`.

---

## Manual deployment (GitHub Actions)

### Trigger from GitHub UI

1. **Actions** tab → **Deploy Cloudflare Pages**
2. **Run workflow** → branch `main` → **Run workflow**
3. Open the run → watch **Require Cloudflare secrets**, **build**, **Deploy to Cloudflare Pages**

### Trigger from CLI

```bash
gh workflow run "Deploy Cloudflare Pages"
gh run watch
```

Or watch a specific run:

```bash
gh run list --workflow="Deploy Cloudflare Pages" --limit 1
gh run watch <run-id>
```

### Expected live URL

After a successful deploy:

```text
https://nyc-212-invader.pages.dev
```

Wrangler prints the deployment URL in the workflow log.

---

## Inspect deployment logs

### GitHub Actions

1. Repo → **Actions** → select the deploy run
2. Expand steps:
   - **Require Cloudflare secrets** — fails fast if secrets missing
   - **npm run build** — must produce `dist/`
   - **Verify build output** — checks `dist/index.html`
   - **Deploy to Cloudflare Pages** — Wrangler upload

### Cloudflare dashboard

1. **Workers & Pages** → project **nyc-212-invader**
2. **Deployments** — status, preview URL, rollback

---

## Verify deployed site

1. Open `https://nyc-212-invader.pages.dev` (or URL from logs)
2. Main menu loads (game does not auto-start)
3. Press **Enter** → gameplay works
4. Hard refresh → local high score persists
5. Test on mobile → touch controls visible

Full checklist: [TESTING.md](./TESTING.md)

---

## Build configuration reference

Used by CI, deploy workflow, and local builds:

| Setting | Value |
|---|---|
| Node.js | `22` (`.node-version`) |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist/` |
| Deploy command | `pages deploy dist --project-name=nyc-212-invader` |

### Repo files

| File | Purpose |
|---|---|
| `wrangler.toml` | Project name + `pages_build_output_dir = "dist"` |
| `public/_redirects` | SPA fallback → `index.html` |
| `public/_headers` | Cache headers for hashed assets |
| `.node-version` | Node 22 for CI and deploy |
| `.github/workflows/ci.yml` | Lint + build on push/PR |
| `.github/workflows/deploy-cloudflare-pages.yml` | Manual Cloudflare deploy |

---

## Alternative: Cloudflare Connect Git (Option A)

Deploy automatically on every push without GitHub Actions secrets:

1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select `polydeuces32/nyc-212-invader`, branch `main`
3. Build command: `npm run build` · Output: `dist` · Node: `22`

If you use Connect Git, keep the GitHub deploy workflow **manual-only** (current setup) to avoid double deploys.

---

## Local CLI deploy (optional)

For ad-hoc deploys from your machine (interactive login, no GitHub secrets):

```bash
npm install
npx wrangler login
npm run deploy
```

---

## Rollback

Cloudflare → **Workers & Pages** → **nyc-212-invader** → **Deployments** → previous deployment → **Rollback to this deployment**.

---

## Troubleshooting

### Missing `CLOUDFLARE_API_TOKEN`

**Symptom:** Wrangler error about non-interactive environment / API token.

**Fix:** Add `CLOUDFLARE_API_TOKEN` under GitHub → Settings → Secrets and variables → Actions. Re-run workflow.

The workflow now fails at **Require Cloudflare secrets** with a clear message before Wrangler runs.

### Missing `CLOUDFLARE_ACCOUNT_ID`

**Symptom:** Wrangler authentication or account errors.

**Fix:** Add `CLOUDFLARE_ACCOUNT_ID` from Cloudflare dashboard sidebar. Re-run workflow.

### Wrong Cloudflare project name

**Symptom:** Deploy succeeds but site URL unexpected, or project not found.

**Fix:** Deploy command must match Cloudflare project:

```text
pages deploy dist --project-name=nyc-212-invader
```

Change `wrangler.toml` `name` and workflow `command` together if renaming.

### Wrong build output directory

**Symptom:** Empty site, 404, or “dist/index.html missing” in CI.

**Fix:** Vite outputs to `dist/`. Do not deploy `build/` or `public/`. Run `npm run build` locally and confirm `dist/index.html` exists.

### Workflow never runs on push

**Expected.** Deploy workflow is **manual-only** (`workflow_dispatch`). Pushing to `main` only runs **CI**.

**Fix:** Trigger manually:

```bash
gh workflow run "Deploy Cloudflare Pages"
```

### CI passes but site not updated

**Expected.** CI does not deploy.

**Fix:** Run deploy workflow after CI passes.

### Node deprecation warnings in GitHub Actions

**Symptom:** Yellow warnings about Node version in Actions logs.

**Fix:** Warnings alone are not failures. If `npm run build` succeeds, ignore unless GitHub removes the Node version. This repo pins Node 22 via `.node-version`.

### Blank page after deploy

- Hard refresh (`Cmd+Shift+R`)
- Confirm `dist/_redirects` exists (copied from `public/_redirects`)
- Check browser console for errors

### Token permissions insufficient

**Symptom:** 403 from Cloudflare API during deploy.

**Fix:** Recreate token with **Cloudflare Pages → Edit** on your account.

---

## Security

- No API keys in the game bundle (client-only v0.x)
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` live in **GitHub Secrets only**
- Do not commit `.env` (listed in `.gitignore`)
- Future backend/Solana keys stay server-side, not in this static repo

---

## Security checklist before deploy

- [ ] Secrets added in GitHub (not in source)
- [ ] `npm run build` passes locally
- [ ] CI green on `main`
- [ ] Deploy workflow triggered manually
- [ ] Live URL loads main menu
