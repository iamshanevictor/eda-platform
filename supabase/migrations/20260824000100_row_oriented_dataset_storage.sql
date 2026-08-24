begin;

alter table public.datasets
  add column if not exists row_count integer;

create table if not exists public.dataset_rows (
  dataset_id bigint not null references public.datasets(id) on delete cascade,
  row_index integer not null check (row_index >= 0),
  row_data jsonb not null check (jsonb_typeof(row_data) = 'object'),
  primary key (dataset_id, row_index)
);

revoke all on table public.dataset_rows from public, anon, authenticated;
grant select on table public.dataset_rows to authenticated;
alter table public.dataset_rows enable row level security;

drop policy if exists "owners can read active dataset rows" on public.dataset_rows;
create policy "owners can read active dataset rows"
on public.dataset_rows
for select
to authenticated
using (
  (select auth.uid()) is not null
  and coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false)
  and exists (
    select 1
    from public.datasets
    where datasets.id = dataset_rows.dataset_id
      and datasets.owner_id = (select auth.uid())
      and datasets.expires_at > now()
  )
);

insert into public.dataset_rows (dataset_id, row_index, row_data)
select dataset.id, element.ordinality::integer - 1, element.value
from public.datasets as dataset
cross join lateral jsonb_array_elements(dataset.data) with ordinality as element(value, ordinality)
on conflict (dataset_id, row_index) do nothing;

update public.datasets as dataset
set row_count = jsonb_array_length(dataset.data)
where dataset.row_count is null;

do $migration$
begin
  if exists (
    select 1
    from public.datasets as dataset
    left join public.dataset_rows as stored_row on stored_row.dataset_id = dataset.id
    group by dataset.id, dataset.row_count
    having dataset.row_count <> count(stored_row.dataset_id)::integer
  ) then
    raise exception 'dataset row backfill count mismatch';
  end if;
end
$migration$;

update public.datasets
set data = '[]'::jsonb
where data <> '[]'::jsonb;

alter table public.datasets
  alter column row_count set not null,
  alter column row_count set default 0;

create or replace function public.complete_upload_attempt(
  attempt_id uuid,
  requested_owner uuid,
  requested_file_name text,
  requested_file_size integer,
  requested_data jsonb,
  requested_summary_stats jsonb,
  requested_missing_values jsonb,
  requested_column_types jsonb,
  requested_correlation_matrix jsonb
)
returns table (dataset_id bigint, expires_at timestamptz)
language plpgsql
volatile
security definer
set search_path = ''
as $function$
declare
  new_dataset_id bigint;
  new_expires_at timestamptz;
begin
  if requested_owner is null or not exists (
    select 1 from auth.users
    where id = requested_owner and is_anonymous is true
  ) then
    raise exception using errcode = '42501', message = 'anonymous authentication required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(requested_owner::text, 0));

  if not exists (
    select 1 from private.upload_attempts
    where id = attempt_id
      and owner_id = requested_owner
      and completed_at is null
      and started_at > now() - interval '30 seconds'
  ) then
    raise exception using errcode = '42501', message = 'active upload reservation required';
  end if;

  if (
    select count(*) from public.datasets
    where owner_id = requested_owner and public.datasets.expires_at > now()
  ) >= 5 then
    raise exception using errcode = 'P0001', message = 'active dataset limit reached';
  end if;

  if requested_file_name is null
    or length(requested_file_name) = 0
    or length(requested_file_name) > 255
    or requested_file_name !~* '[.]csv$'
    or requested_file_size <= 0
    or requested_file_size > 2097152
    or requested_data is null
    or jsonb_typeof(requested_data) <> 'array'
    or jsonb_array_length(requested_data) = 0
    or jsonb_array_length(requested_data) > 10000
    or pg_column_size(requested_data) > 8388608
    or exists (
      select 1 from jsonb_array_elements(requested_data) as row(value)
      where jsonb_typeof(row.value) <> 'object'
    )
    or requested_summary_stats is null
    or jsonb_typeof(requested_summary_stats) <> 'object'
    or requested_missing_values is null
    or jsonb_typeof(requested_missing_values) <> 'object'
    or requested_column_types is null
    or jsonb_typeof(requested_column_types) <> 'object'
    or requested_correlation_matrix is null
    or jsonb_typeof(requested_correlation_matrix) <> 'object'
  then
    raise exception using errcode = '22023', message = 'upload payload is outside the allowed envelope';
  end if;

  insert into public.datasets (owner_id, file_name, file_size, data, row_count)
  values (
    requested_owner,
    requested_file_name,
    requested_file_size,
    '[]'::jsonb,
    jsonb_array_length(requested_data)
  )
  returning id, public.datasets.expires_at into new_dataset_id, new_expires_at;

  insert into public.dataset_rows (dataset_id, row_index, row_data)
  select new_dataset_id, row.ordinality::integer - 1, row.value
  from jsonb_array_elements(requested_data) with ordinality as row(value, ordinality);

  insert into public.dataset_analyses (
    owner_id, dataset_id, summary_stats, missing_values, column_types, correlation_matrix
  ) values (
    requested_owner, new_dataset_id, requested_summary_stats, requested_missing_values,
    requested_column_types, requested_correlation_matrix
  );

  update private.upload_attempts
  set completed_at = now(), succeeded = true
  where id = attempt_id and owner_id = requested_owner;

  return query select new_dataset_id, new_expires_at;
end
$function$;

revoke all on function public.complete_upload_attempt(uuid, uuid, text, integer, jsonb, jsonb, jsonb, jsonb, jsonb)
from public, anon, authenticated;
grant execute on function public.complete_upload_attempt(uuid, uuid, text, integer, jsonb, jsonb, jsonb, jsonb, jsonb)
to service_role;

commit;
