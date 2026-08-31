# Testing and quality checks

The project uses Vitest for focused unit and migration-contract tests. Test files
are colocated with their source under `lib/`; there is no committed browser E2E
test suite or coverage threshold.

## Commands

```powershell
npm run lint       # ESLint with Next.js core-web-vitals and TypeScript rules
npm run typecheck  # TypeScript without emitting files
npm test           # Vitest run
npm run build      # Optimized Next.js production build
```

Run all four before opening a pull request. CI performs `npm ci` and then runs
the same checks on pull requests and pushes to `master`.

## What is covered

- CSV bounds, parsing, UTF-8 handling, and stored-data limits
- Turnstile verification failure paths
- Dataset/page identifier validation
- Deterministic sampling and statistical semantics
- Migration contracts for retention and row-oriented storage

## Manual verification

Automated checks do not prove cloud configuration or browser behavior. For a
release-affecting change, use safe non-production credentials to verify upload
feedback, owner isolation, expiry behavior, responsive keyboard navigation, and
print output. Follow the controlled cloud guides for migrations, RLS, grants,
quota, cleanup, and production kill-switch checks.
