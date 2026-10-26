# Setup

## Prerequisites

- Node.js `24.x` (the exact local version is recorded in [`.nvmrc`](../.nvmrc))
- npm `11.x`
- Access to the Supabase and Cloudflare Turnstile configuration used for the
  environment you intend to run

No Docker workflow or separate backend process is configured in this repository.
Next.js serves the frontend, route handlers, and server actions.

## Install and configure

```powershell
git clone https://github.com/iamshanevictor/eda-platform.git
cd eda-platform
npm ci
Copy-Item .env.example .env.local
```

Fill in `.env.local` from the provider dashboards. Do not commit it.

| Variable | Required | Visibility | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | Yes | Public | Current Supabase browser key. |
| `SUPABASE_SECRET_KEY` | Yes for uploads | Server-only | Runs bounded write and quota RPCs after application checks. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes for uploads | Public | Renders the upload challenge. |
| `TURNSTILE_SECRET_KEY` | Yes for uploads | Server-only | Verifies a challenge for an existing anonymous session. |
| `UPLOADS_ENABLED` | Yes | Server-only | Emergency kill switch; only the exact value `true` enables uploads. |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are supported
legacy fallbacks. Use each only when the current equivalent is unavailable; do
not define both keys for the same purpose unless the provider migration requires
it. Never expose server-only keys through a `NEXT_PUBLIC_` name.

For a UI-only local session, leave `UPLOADS_ENABLED=false`. To exercise a real
local upload flow, use a safe development Supabase/Turnstile environment and
set it to `true` locally. Do not use that as authorization to enable production
uploads.

## Run

```powershell
npm run dev
```

Open <http://localhost:3000>. A working upload requires the Supabase URL and
browser key even though the proxy safely skips session refresh when they are
absent.

## Database and Auth

The project uses versioned SQL migrations in [`supabase/migrations`](../supabase/migrations).
Do not paste partial migration fragments into the dashboard SQL editor. Follow
the controlled deployment instructions in
[Phase 2 deployment](../supabase/PHASE_2_DEPLOYMENT.md) and the
[row-storage guide](../supabase/ROW_STORAGE_DEPLOYMENT.md).

The intended Supabase configuration is anonymous-only authentication with
Turnstile CAPTCHA enabled. Browser clients read and delete only their own active
datasets through RLS; server-side writes use a server-only key and restricted
RPCs.

## Confirm setup

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

All four commands should complete successfully before a change is submitted.
