---

title: SQL Standards
type: concept
status: published
summary: SQL file organization, formatting, naming, and linting conventions for PostgreSQL projects
related: [naming-conventions, api-standards]
locale: en-US
---

# SQL Standards

SQL file organization, formatting, naming, and linting conventions for PostgreSQL projects. All SQL is lowercase; files are numbered for explicit load order; SQLFluff enforces formatting.

## Formatting

All SQL uses **lowercase** — keywords, identifiers, data types, function names, and literals.
This is enforced by SQLFluff.

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
- Statements end with a semicolon
- Maximum line length: 100 characters
- Single quotes for string literals
- Shorthand casting (`::type`, not `CAST(… AS type)`)
- `!=` for not-equal (`<>` is not used)

## Linting

SQLFluff is the SQL linter. Configuration lives in `.sqlfluff` at the project root. A ready-to-use blueprint is available at `@regardio/dev/sqlfluff/setup.cfg` — copy it into your project and adjust as needed (SQLFluff does not support config inheritance).

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

Run linting with:

```bash
sqlfluff lint schemas/
sqlfluff fix schemas/
```

## File Organization

Schema files live in `schemas/` and are numbered to control load order.
Each file owns one domain or object group.

### Naming Pattern

```text
{nn}_{category}_{name}.sql
```

Examples: `00_schema_setup.sql`, `15_function_util.sql`, `30_core_task.sql`

### Number Ranges

- **`00–09`** — Schema setup, enums
- **`10–19`** — Functions (auth, jsonb, model, storage, etc.)
- **`20–29`** — Reference tables (locale, timezone, country, etc.)
- **`30–39`** — Core tables (user, task, tag, etc.)
- **`40+`** — Domain tables (project, team, workflow, etc.)

### File Header

Every file opens with a banner comment documenting
its number, title, purpose, and the sections it contains:

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

### Section Dividers

Within a file, sections are separated by labeled dividers for consistent section order:

```sql
--[ 1. Table ]------------------------------------------------------------------

--[ 2. Indexes ]----------------------------------------------------------------

--[ 3. Functions ]--------------------------------------------------------------

--[ 4. Constraints ]------------------------------------------------------------

--[ 5. Triggers ]---------------------------------------------------------------

--[ 6. Permissions ]------------------------------------------------------------
```

## Naming Conventions

All identifiers use `snake_case`.

### Tables

Singular form: `user`, `task`, `project` — not `users`, `tasks`.

### Columns

- Primary key: `id uuid`
- Foreign keys: `{referenced_table}_id`
- Internationalized content: `{field}_intl jsonb`
- Timestamps: `created_at`, `updated_at`, `deleted_at`, `{event}_at`
- Soft delete: `deleted_at timestamptz null`

### Column Grouping

Use inline `--- SECTION` markers to group related columns:

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

Pattern: `{domain}_{verb}` or `{domain}_{verb}_{target}`

- `util_generate_slug`, `util_generate_code`
- `jsonb_is_boolean`, `jsonb_deep_merge`
- `task_get_status`, `task_check_ownership`
- `access_check_permissions`, `user_get_role`

Function parameters use a `_` prefix: `_length`, `_input`, `_user_id`.

**Standard verbs**: `get`, `list`, `create`, `update`, `delete`, `check`, `is`, `has`, `set`, `generate`

### Constraints, Indexes, Triggers, Policies

- **Check constraints**: `chk_{table}_{field}_{purpose}`
- **Unique constraints**: `uq_{table}_{field}`
- **Indexes**: `idx_{table}_{field}`, unique indexes `idx_unique_{table}_{field}`
- **Triggers**: `trg_{table}_{purpose}`
- **RLS policies**: `pol_{table}_{operation}`

Partial indexes with `where deleted_at is null` are the default for active-record queries.

## Schema Structure

- **`public`** — User-facing tables, views, and API functions (exposed to PostgREST)
- **`private`** — Server-internal tables and helpers (not exposed to PostgREST)
- **`extensions`** — Third-party PostgreSQL extensions
- **`auth`** — Auth provider schema (do not modify)

## Function Standards

Every function declares volatility, security context, language, and a hardened search path:

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

- `security invoker` for functions that act on behalf of the caller
- `security definer` for functions that need elevated privileges
- `set search_path = ''` always — use fully schema-qualified names throughout
- Local variables use a `v_` prefix: `v_result`, `v_index`

## Documentation

Use `comment on` with dollar-quoted `$doc$` strings.
Add comments to tables, columns, and functions immediately after their definition:

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

## Access Control

Enable RLS on every table in `public`. The standard pattern:

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

- Revoke all, then grant only what is needed
- Write operations go through `security definer` functions, not direct table grants

Related documents:

- [Naming Conventions](./naming.md) — Consistent naming patterns across the project
- [API Design Standards](./api.md) — API design and implementation guidelines
