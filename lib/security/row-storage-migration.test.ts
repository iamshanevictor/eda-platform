import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase",
    "migrations",
    "20260824000100_row_oriented_dataset_storage.sql",
  ),
  "utf8",
);

describe("row-oriented dataset storage migration", () => {
  it("backfills and verifies rows before clearing legacy payloads", () => {
    const backfill = migration.indexOf("insert into public.dataset_rows");
    const verification = migration.indexOf("dataset row backfill count mismatch");
    const clearing = migration.indexOf("set data = '[]'::jsonb");

    expect(backfill).toBeGreaterThan(-1);
    expect(verification).toBeGreaterThan(backfill);
    expect(clearing).toBeGreaterThan(verification);
  });

  it("keeps row reads owner-scoped and expiry-aware", () => {
    expect(migration).toContain("grant select on table public.dataset_rows to authenticated");
    expect(migration).toContain("datasets.owner_id = (select auth.uid())");
    expect(migration).toContain("datasets.expires_at > now()");
    expect(migration).toContain("on delete cascade");
  });

  it("writes bounded row objects atomically through the service-role RPC", () => {
    expect(migration).toContain("jsonb_array_length(requested_data) > 10000");
    expect(migration).toContain("jsonb_typeof(row.value) <> 'object'");
    expect(migration).toContain("jsonb_array_elements(requested_data) with ordinality");
    expect(migration).toMatch(/grant execute on function public\.complete_upload_attempt[\s\S]+to service_role;/);
    expect(migration).toMatch(/^begin;[\s\S]+commit;\s*$/);
  });
});
