# Green Installatie Noord

Frontend for [greeninstallatienoord.nl](https://greeninstallatienoord.nl): a static React site for later Cloudflare Pages deployment.

Verified company facts live in `src/data/business.ts`. Marketing claims stay in `docs/business-verification.md` until approved. Do not invent prices, extra services, ratings or certifications.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/).

## Production build

```bash
npm run build
```

Output: `dist/`. Preview with `npm run preview`.

## Lint

```bash
npm run lint
```

## Cloudflare backend (Worker + D1)

See `docs/cloudflare-architecture.md`, `docs/d1.md`, `docs/email-architecture.md`, `docs/admin-architecture.md`, and `docs/environment-variables.md`.

Local API:

```bash
copy .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev:api
```

Keep `npm run dev` in a second terminal. The Vite proxy forwards `/api` to the Worker. The public site still works if the Worker is not running; forms then stay in preview mode without claiming server receipt.
