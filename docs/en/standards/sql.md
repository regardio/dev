---

title: "SQL"
description: "PostgreSQL file organisation, formatting, naming, functions, and access control for Regardio schemas."
publishedAt: 2026-04-17
order: 7
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

All SQL in Regardio is lowercase, schemas are organised by numbered files, SQLFluff enforces formatting, and RLS is on for every public table. This page catalogues the conventions. The reasoning behind the access pattern lives with the schema it protects — the standards here describe the form.

## Formatting

Keywords, identifiers, data types, function names, and casts are lowercase.

```sql
create table public.task (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz null
);
```

- 2-space indentation
- Leading binary operators (`and`, `or`)
- Trailing commas
- Single quotes for string literals
- Shorthand casting (`::type`)
- `!=` for not-equal (`<>` is not used)
- Line length capped at 100
- One statement per semicolon

## Linting

SQLFluff is the linter. Configuration lives in `.sqlfluff` at the project root. A blueprint ships with `@regardio/dev/sqlfluff/setup.cfg` — projects copy it and adjust (SQLFluff does not support config inheritance).

Key settings:

```ini
[sqlfluff]
dialect = postgres
max_line_length = 100

[sqlfluff:rules:capitalisation.keywords]
capitalisation_policy = lower

[sqlfluff:rules:capitalisation.identifiers]
extended_capitalisation_policy = lower
```

```bash
sqlfluff lint schemas/
sqlfluff fix schemas/
```

## File organisation

Schema files live in `schemas/` and are numbered to control load order. Each file owns one domain or object group.

### Naming pattern

```text
{nn}_{category}_{name}.sql
```

Examples: `00_schema_setup.sql`, `15_function_util.sql`, `30_core_task.sql`.

### Number ranges

- `00–09` — schema setup, enums
- `10–19` — functions (auth, jsonb, model, storage)
- `20–29` — reference tables (locale, timezone, country)
- `30–39` — core tables (member, task, tag)
- `40+` — domain tables

A file with a lower number does not depend on a file with a higher number.

### File header

Every file opens with a banner naming its number, title, purpose, and sections:

```sql
--------------------------------------------------------------------------------
-- {nn}. {Title}
--
-- {One-line purpose description.}
--
-- Provides:
-- 1. {First section}
-- 2. {Second section}
--------------------------------------------------------------------------------
```

### Section dividers

Within a file, sections separate by labelled dividers in a fixed order:

```sql
--[ 1. Table ]------------------------------------------------------------------

--[ 2. Indexes ]----------------------------------------------------------------

--[ 3. Functions ]--------------------------------------------------------------

--[ 4. Constraints ]------------------------------------------------------------

--[ 5. Triggers ]---------------------------------------------------------------

--[ 6. Permissions ]------------------------------------------------------------
```

## Schema structure

- `public` — user-facing tables, views, and API functions (exposed to PostgREST)
- `private` — server-internal tables and helpers (not exposed to PostgREST)
- `extensions` — third-party PostgreSQL extensions
- `auth` — Supabase auth schema; not modified

## Naming

Every identifier is `snake_case`.

### Tables

Singular: `member`, `task`, `project` — not `members`, `tasks`.

### Columns

- `id uuid` — primary key
- `{referenced_table}_id` — foreign key
- `{field}_intl jsonb` — internationalised content
- `created_at`, `updated_at`, `deleted_at`, `{event}_at` — timestamps
- `deleted_at timestamptz null` — soft-delete marker

Active-record queries use partial indexes filtered by `deleted_at is null`.

### Column grouping

Inline `--- SECTION` markers group related columns:

```sql
create table public.task (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project (id),

  --- CONTENT
  title text not null,
  description text null,

  --- STATUS
  status public.task_status not null,
  due_at timestamptz null,
  deleted_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz null
);
```

### Functions

Pattern: `{domain}_{verb}` or `{domain}_{verb}_{target}`.

- `util_generate_slug`, `util_generate_code`
- `jsonb_is_boolean`, `jsonb_deep_merge`
- `task_get_status`, `task_check_ownership`
- `access_check_permissions`, `user_get_role`

Parameters are prefixed `_` (`_input`, `_task_id`); local variables are prefixed `v_` (`v_result`, `v_count`).

Standard verbs: `get`, `list`, `create`, `update`, `delete`, `check`, `is`, `has`, `set`, `generate`.

### Objects bound to a table

- Check constraints — `chk_{table}_{field}_{purpose}`
- Unique constraints — `uq_{table}_{field}`
- Indexes — `idx_{table}_{field}`; unique as `idx_unique_{table}_{field}`
- Triggers — `trg_{table}_{purpose}`
- RLS policies — `pol_{table}_{operation}`

## Functions

Every function declares volatility, security context, language, and a pinned empty search path:

```sql
create or replace function public.util_generate_slug(
  _input text
) returns text
language plpgsql
immutable
security invoker
set search_path = ''
as $func$
  declare
    v_result text;
  begin
    -- body
    return v_result;
  end;
$func$;
```

- `security invoker` is the default
- `security definer` is chosen only when the function needs to act beyond the caller's grants
- `set search_path = ''` always; schema-qualified names are used throughout

## Documentation

Tables, columns, and functions carry `comment on` entries using dollar-quoted `$doc$` strings, placed immediately after the definition. The comment describes what the object is and what callers can assume about it — not how it is implemented.

```sql
comment on table public.task is $doc$A unit of work within a project.$doc$;

comment on column public.task.title is $doc$Short description of the task.$doc$;

comment on function public.util_generate_slug is $doc$
Converts a text input into a URL-safe slug.

Parameters:
- _input text: Source text to slugify

Returns text: Lowercase hyphenated slug.
$doc$;
```

## Access control

RLS is on and forced for every table in `public`. Grants revoke everything first, then grant only what is needed. Write paths prefer `security definer` functions over direct table grants.

```sql
alter table public.task enable row level security;
alter table public.task force row level security;

revoke all on table public.task from anon, authenticated;
grant select on table public.task to authenticated;

create policy pol_task_select on public.task
  for select using (owner_id = (select auth.uid()));

create policy pol_task_update on public.task
  for update using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
```

## Related

- [Naming](./naming.md) — Names across languages
- [API](./api.md) — How the schema is consumed
- [Principles](./principles.md) — Shared principles
- [Writing](./writing.md) — Voice, tone, language

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
