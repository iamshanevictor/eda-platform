# Development workflow

## Daily loop

1. Create a focused branch from the intended base.
2. Make a narrow change; avoid mixing UI, migration, and security-policy work.
3. Run the checks relevant to the change, then the complete quality suite before
   requesting review.
4. Update documentation when a command, environment variable, architecture
   boundary, or operational procedure changes.

Use the existing `@/*` TypeScript import alias and follow the surrounding file's
quote style and component patterns. Use a client component only for browser
interaction; keep server actions and route handlers responsible for data access.

## Conventions that protect the application

- Treat `UPLOADS_ENABLED` as a fail-closed operational control. Do not enable it
  in a production environment as a side effect of code work.
- Keep server-only credentials out of client components, public variables, logs,
  examples, and commits.
- Preserve owner/expiry RLS and restricted write RPCs. A database/schema change
  needs a forward-only migration and the controlled validation described in the
  Supabase deployment guides.
- Keep CSV and analysis work within the limits in `lib/security/upload-limits.ts`.
  Any limit change needs profiling and explicit security/capacity review.
- Keep page data bounded: previews paginate, charts sample, and reports do not
  fetch whole row payloads.

## Quality commands

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run dev` starts the local application. The CI workflow runs a clean
`npm ci` followed by the same four checks.

## Change-specific guidance

- **New page:** add an App Router route under `app/`, preserve the shared layout
  and navigation behavior, and provide loading/error/empty states where needed.
- **New component:** keep reusable pieces in `components/`, use existing UI
  primitives where appropriate, and include accessible labels, focus handling,
  and responsive behavior.
- **New data access:** validate identifiers, use the appropriate Supabase helper,
  and rely on RLS for visitor reads/deletes. Do not introduce direct browser
  writes.
- **Analysis changes:** update unit tests and [`DECISION.md`](../DECISION.md)
  when statistical semantics change.

See [Contributing](../.github/CONTRIBUTING.md) for pull-request expectations.
