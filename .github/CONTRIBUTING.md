# Contributing

## Before you start

Follow the [setup guide](../docs/SETUP.md), create a focused branch, and keep
the working tree free of credentials and generated local files.

## Making a change

- Keep changes narrow and describe the user/developer impact clearly.
- Preserve the anonymous-auth, RLS, quota, expiry, and upload kill-switch
  boundaries. Do not mix cloud configuration changes into an ordinary UI PR.
- Use the existing App Router, TypeScript alias, Tailwind, and shared-component
  patterns.
- Add or update tests when changing analysis, validation, security, or data
  behavior. Update documentation when setup, environment variables, architecture,
  or operations change.

## Required checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Pull requests

Explain what changed, why it is safe, how it was tested, and any manual cloud or
browser validation still required. Do not include secrets, private URLs, upload
samples containing private data, or unreviewed migration/dashboard changes.

Security, migration, and release-control changes need explicit maintainer review
and should reference the applicable procedure in `supabase/`.
