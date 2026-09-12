# Environment variables

Never put private keys in `VITE_*` variables. Vite inlines those into the browser bundle.

## Concepts

| Name | Where | Public? |
| --- | --- | --- |
| `ENVIRONMENT` | Worker vars | no (not exposed on `/api/health`) |
| `PUBLIC_SITE_URL` | Worker vars | used for CORS + admin links in mail |
| `ADMIN_BASE_PATH` | Worker vars + optional `VITE_ADMIN_BASE_PATH` | path only, not a secret |
| `RESEND_API_KEY` | Worker secret | **secret** |
| `ADMIN_SESSION_SECRET` | Worker secret | **secret** |
| `VITE_API_BASE_URL` | Frontend | empty = same-origin `/api` |
| `VITE_PUBLIC_SITE_URL` | Frontend | optional public origin |

## Files

| File | Commit? |
| --- | --- |
| `.env.example` | yes — placeholders |
| `.dev.vars.example` | yes — placeholders |
| `.env` / `.env.local` | no |
| `.dev.vars` | no — local Wrangler secrets |
| `wrangler.toml` `[vars]` | yes — non-secret defaults |

`.gitignore` ignores `.env*`, `.dev.vars`, and `.wrangler/`.

## Development

1. Copy `.dev.vars.example` → `.dev.vars` and replace secrets with local dummy or real test keys.
2. Optional: copy `.env.example` → `.env` if you need Vite overrides.
3. Run Worker: `npm run dev:api`
4. Run site: `npm run dev` (proxies `/api` → `127.0.0.1:8787`)

## Preview / production (Cloudflare)

Set vars in `wrangler.toml` `[env.preview.vars]` / `[env.production.vars]` (already drafted).

Set secrets (manual, not executed here):

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ADMIN_SESSION_SECRET
```

Repeat with `--env preview` or `--env production` if you deploy those environments.

Generate a long random session secret, for example:

```bash
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

## Frontend API base

Leave `VITE_API_BASE_URL` empty when the Worker is on the same host under `/api`.

Only set it if the API is on another origin (then CORS + cookie `Domain` need extra care). Prefer same-origin.

## Pages vs Worker

`public/_redirects` sends unknown paths to `index.html`. `public/_routes.json` excludes `/api/*` from Pages Functions so HTML is less likely to mask the API. You still must attach the Worker to `/api/*` in the Cloudflare dashboard or Wrangler routes. That attachment is a **manual** step.
