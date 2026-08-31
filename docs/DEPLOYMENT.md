# Deployment

## Build and runtime

Create the production artifact with:

```powershell
npm run build
```

The project declares Node.js `24.x` and npm `11.x`. The repository's GitHub
Actions workflow uses `.nvmrc`, performs `npm ci`, and runs lint, type-check,
test, and build. The workflow supplies non-secret placeholder values for public
Supabase/Turnstile build-time variables.

Operational documentation and `VERCEL_URL` usage indicate Vercel deployment,
but no Vercel configuration or infrastructure-as-code file is committed.
Organization-specific dashboard steps therefore remain maintainer work.

## Environment configuration

Provide the variables documented in [Setup](SETUP.md) through the deployment
platform's secret/environment management. Public Supabase and Turnstile site
values may be available at build time; server-only Supabase and Turnstile
secrets must remain server-only.

The upload route is disabled unless `UPLOADS_ENABLED=true` exactly. The
repository sample is intentionally false. Confirm the actual deployment scope
and current value in the platform dashboard before any release action.

## Database changes

Apply new migrations only as forward-only reviewed files. Existing production
procedures are intentionally separate from application deployment:

- [Phase 2 Supabase deployment and recovery](../supabase/PHASE_2_DEPLOYMENT.md)
- [Row-oriented storage deployment](../supabase/ROW_STORAGE_DEPLOYMENT.md)

These require backup/recovery preparation and cloud-side verification. Do not
substitute a successful application build for RLS, Auth, quota, cleanup, or
edge-control validation.

## Rollback and incident response

No automated rollback configuration is committed. For an upload/security
incident, disable uploads first using the existing environment control; do not
weaken RLS as a rollback. Database recovery and migration rollback decisions
must follow the provider backup/recovery process and be made by a maintainer.
