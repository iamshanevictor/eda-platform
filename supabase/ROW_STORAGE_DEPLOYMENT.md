# Row-oriented dataset storage deployment

The forward migration is
`20260824000100_row_oriented_dataset_storage.sql`. Keep `UPLOADS_ENABLED=false`
in Production throughout migration and verification.

## Deploy

1. Take a provider backup or verify point-in-time recovery is available.
2. Apply the migration in a safe environment, then Production.
3. Verify no dataset has a mismatched authoritative count:

   ```sql
   select d.id, d.row_count, count(r.dataset_id)::integer as stored_rows
   from public.datasets d
   left join public.dataset_rows r on r.dataset_id = d.id
   group by d.id, d.row_count
   having d.row_count <> count(r.dataset_id)::integer;
   ```

4. Verify legacy payloads were cleared only after successful backfill:

   ```sql
   select count(*) as nonempty_legacy_payloads
   from public.datasets
   where data <> '[]'::jsonb;
   ```

5. Verify `anon` has no table privileges, `authenticated` has SELECT only, and
   the row policy requires the active owner-scoped parent dataset.
6. Deploy the bounded application readers. Keep Production uploads disabled
   until application and owner-isolation smoke checks pass.

## Recovery

The migration is transactional. If it fails, PostgreSQL rolls it back. After a
successful migration, prefer roll-forward: fix the new reader or migration in a
new migration. Do not drop `dataset_rows` or reconstruct `datasets.data` without
a reviewed backup/recovery plan. If application deployment fails, roll the app
back while keeping uploads disabled; the legacy app will not see cleared row
payloads, so restore service by rolling forward the bounded reader rather than
enabling uploads on the old build.
