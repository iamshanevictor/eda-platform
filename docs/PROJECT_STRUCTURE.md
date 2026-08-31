# Project structure

```text
app/                         App Router pages, route handlers, server actions, and global styles
  api/                       Upload and bounded dataset-data endpoints
  actions/                   Server actions for reads, deletion, and report data
  data/ and upload/          User-facing routes
components/                  Page UI, charts, reports, navigation, and shared UI primitives
lib/
  analysis/                  Deterministic analysis and sampling logic with unit tests
  security/                  Validation, identifiers, Turnstile checks, and migration tests
  supabase/                  Browser, server, admin, and proxy client helpers
supabase/
  migrations/                Versioned PostgreSQL schema/security migrations
  *_DEPLOYMENT.md            Controlled cloud deployment instructions
.github/workflows/           CI quality workflow
docs/                        Developer handoff documentation
```

## Placement rules

- Put an App Router route, route handler, or server action in `app/`. Keep
  database access behind the existing Supabase helpers and authorization rules.
- Put reusable view code in `components/`; use `components/ui/` for low-level
  primitives. Do not place database operations in ordinary client components.
- Put pure analysis, security validation, and provider helpers in `lib/`, with
  colocated unit tests for logic that can run without the browser.
- Add any database change as a new forward-only file in `supabase/migrations/`.
  Never edit an applied migration or replace RLS from the dashboard without a
  reviewed migration.
- Keep operational procedures next to Supabase resources; keep onboarding and
  contributor documentation in `docs/` and `.github/`.

## Root records retained intentionally

`PROJECT_TASKS.md`, `MODERNIZATION_WORKLOG.md`, `DECISION.md`, and
`AI_DEVELOPMENT_WORKFLOW_V2.md` remain at the root because they are live project
workflow and decision records. They are not temporary notes.
