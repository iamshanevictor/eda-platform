# Security notes

This document is an architectural guide, not a substitute for the migrations or
cloud release checklist.

## Boundaries

- Browser clients use only public Supabase and Turnstile site values.
- `SUPABASE_SECRET_KEY` (or its legacy fallback) and `TURNSTILE_SECRET_KEY` are
  server-only. They must never be logged, committed, or given a `NEXT_PUBLIC_`
  prefix.
- `POST /api/uploads` fails closed unless `UPLOADS_ENABLED` is exactly `true`.
  This is the first incident control; never weaken RLS as a workaround.
- Browser writes are intentionally denied. The server reserves quota and calls
  restricted write RPCs only after validation.

## Data handling

Accepted CSVs are bounded before storage and analysis. Dataset rows are
owner-scoped, expire after 24 hours, and are later physically removed by a
scheduled cleanup job. UI preview and chart reads are bounded to avoid turning a
small-file demo into an unbounded data-access path.

## Provider changes

Changes to Supabase Auth, RLS, grants, RPCs, cron, Turnstile hostnames, edge
controls, retention, quotas, or production upload scope require the controlled
procedures in `supabase/` and explicit maintainer review. Repository tests cannot
prove those external settings.

## Credentials

`.env.local`, Vercel configuration, and Supabase CLI linkage metadata are local
state. If a credential is ever committed, remove it from the current tree,
ensure the relevant path is ignored, rotate it with the provider, and consult a
maintainer before considering history remediation.
