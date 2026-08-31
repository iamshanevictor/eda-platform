# Troubleshooting

## The data page fails locally with missing Supabase configuration

**Symptoms:** A server error mentions the Supabase URL or browser key.

**Cause:** Server-rendered data reads require `NEXT_PUBLIC_SUPABASE_URL` and a
Supabase publishable/anon key.

**Solution:** Copy `.env.example` to `.env.local`, set the public Supabase
variables from the appropriate project, then restart `npm run dev`.

## The upload button stays disabled

**Symptoms:** The upload form reports that upload security is not configured, or
the submit button cannot be used.

**Cause:** The Turnstile site key is missing, the challenge has not completed,
or no CSV is selected.

**Solution:** Configure `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for the local hostname,
restart the dev server, select a valid CSV, and complete the challenge. Use
provider test keys only in a safe development environment.

## Upload returns HTTP 503

**Symptoms:** The API reports that uploads are temporarily disabled.

**Cause:** `UPLOADS_ENABLED` is not exactly `true`.

**Solution:** For safe local testing only, set it to `true` in `.env.local` and
restart the server. For deployed environments, verify the scope and obtain the
required release authorization before changing it.

## Upload fails after configuration

**Symptoms:** A generic upload error, rejected security challenge, or quota
response appears.

**Cause:** Common causes are a hostname/action mismatch, absent server-only
secret, invalid CSV envelope, or the rolling upload/active-dataset limits.

**Solution:** Confirm the Turnstile hostname and action, server-only Supabase
and Turnstile keys, and the limits in `lib/security/upload-limits.ts`. Do not
log challenge tokens or provider secrets while investigating.

## Supabase migration or CLI problems

**Symptoms:** A migration cannot apply, a linked project is missing, or a role
permission error is returned.

**Cause:** Cloud schema changes require provider permissions and a linked local
project. The ignored `supabase/.temp/` directory is regenerated locally and is
not shared through Git.

**Solution:** Re-link with the Supabase CLI using maintainer-approved access,
then follow the controlled migration guide. Do not work around role/permission
errors by editing production policies or applying partial SQL.

## Lint, type-check, or build fails unexpectedly

**Symptoms:** One of the quality commands fails after a dependency or generated
file change.

**Solution:** Confirm Node/npm versions, run `npm ci`, remove only ignored local
build artifacts if necessary, then rerun the failed command. Do not delete the
lockfile or applied migrations as a cleanup shortcut.
