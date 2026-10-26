# EDA Platform Decisions

Last updated: 2026-08-24

## Statistical semantics

The platform analyzes the complete accepted CSV (maximum 10,000 rows) and uses
the following deterministic semantics:

- Missing values are `null`, `undefined`, or empty/whitespace-only strings.
- A non-empty column is Boolean only when every value is a native Boolean or
  case-insensitive `true`/`false` string.
- A column is numeric only when every non-missing value is a finite number or a
  finite numeric string. Mixed numeric/text columns are text.
- Dates require ISO `YYYY-MM-DD` calendar dates or ISO datetimes with an
  explicit timezone. Broad locale-dependent `Date.parse` inference is not used.
- Standard deviation is the population deviation because the accepted CSV is
  the complete analyzed population, not an inferred sample.
- Quartiles use linear interpolation at `(n - 1) * p` (the R-7 method).
- Displayed summary values and correlations are rounded to four decimals.
- Pearson correlation uses pairwise-complete rows. A pair with fewer than two
  observations or zero variance returns `0`; a numeric column diagonal is `1`.
- Correlation remains capped at the first 30 numeric columns in source order.
- Samples are deterministic, evenly spaced, include both endpoints when the
  sample contains at least two rows, and never determine authoritative totals.

These decisions intentionally replace the Phase 0 characterization behavior
for first-value inference, Boolean coercion, index quartiles, broad date
parsing, row-misaligned correlation, and random-comparator sampling.

## Dataset row storage

Accepted CSV rows are stored one row per record in `public.dataset_rows`, keyed
by `(dataset_id, row_index)`. `public.datasets.row_count` is the authoritative
total; the legacy `datasets.data` JSONB column is retained as an empty array for
forward compatibility and rollback safety, but application reads must not use
it.

- A dataset insert, its row inserts, its analysis, and upload-attempt completion
  remain one transaction inside the service-role-only upload RPC.
- Parent deletion and the existing expiry purge remove rows through `ON DELETE
  CASCADE`.
- Authenticated anonymous owners may select rows only while the parent dataset
  belongs to the same owner and has not expired. Browser roles receive no row
  write grants.
- Pagination uses ordered, bounded row-index ranges. Chart samples use the
  deterministic sampling decision above. Reports use metadata and stored
  analysis rather than loading every row.
- The migration backfills rows and verifies row counts before clearing legacy
  JSON payloads. Deployment and recovery details are in
  `supabase/ROW_STORAGE_DEPLOYMENT.md`.
