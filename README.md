# EDA Platform

A bounded, anonymous CSV exploratory-data-analysis demo. It computes summary
statistics, data-quality signals, correlations, and charts without sending
dataset content to an AI provider.

Each visitor receives a temporary Supabase anonymous identity after completing
Cloudflare Turnstile. Data is owner-isolated by Row Level Security, expires
after 24 hours, and is cleaned up by a scheduled database job.

## Stack

- Next.js 16.2, React 19.2, TypeScript, and Tailwind CSS 3.4
- Supabase Auth and PostgreSQL
- Cloudflare Turnstile
- Papa Parse, Recharts, and browser print output
- Node.js 24.x and npm 11.x

Use npm only. The supported versions are declared in [`.nvmrc`](.nvmrc) and
[`package.json`](package.json).

## Quick start

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Set the required values in `.env.local`, then open <http://localhost:3000>.
The complete instructions, including safe local upload testing, are in
[Setup](docs/SETUP.md).

## Commands

```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs a clean install followed by linting, type-checking, tests,
and the production build on pull requests and `master`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Setup](docs/SETUP.md)
- [Development workflow](docs/DEVELOPMENT.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Security notes](docs/SECURITY_NOTES.md)
- [Project structure](docs/PROJECT_STRUCTURE.md)
- [Contributing](.github/CONTRIBUTING.md)
- [Security reporting](.github/SECURITY.md)

The root also retains project records that are part of the active development
workflow: [`PROJECT_TASKS.md`](PROJECT_TASKS.md),
[`MODERNIZATION_WORKLOG.md`](MODERNIZATION_WORKLOG.md),
[`DECISION.md`](DECISION.md), and
[`AI_DEVELOPMENT_WORKFLOW_V2.md`](AI_DEVELOPMENT_WORKFLOW_V2.md).

## Release safety

The checked-in environment sample keeps `UPLOADS_ENABLED=false`; the route only
accepts uploads when the deployed value is exactly `true`. Confirm the actual
Vercel environment scope and the cloud checklist before changing that value.
Migrations and controlled cloud checks are documented in
[`supabase/PHASE_2_DEPLOYMENT.md`](supabase/PHASE_2_DEPLOYMENT.md) and
[`supabase/ROW_STORAGE_DEPLOYMENT.md`](supabase/ROW_STORAGE_DEPLOYMENT.md).

## License

No license file is currently included. Do not assume permission to reuse or
redistribute the project until the owner adds one.
