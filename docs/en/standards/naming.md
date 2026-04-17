---

title: "Naming"
description: "Naming patterns across TypeScript, SQL, CSS, Git, and configuration — each language in its own idiom, aligned across the seams."
publishedAt: 2026-04-17
order: 4
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

A name is the shortest documentation a thing gets. The same concept can appear in TypeScript, a SQL column, a CSS class, and a branch; when the words line up across those surfaces, the concept stays recognisable. The convention is to match each language's native idiom and keep the words in the same order across languages.

## General

- Names carry their purpose — `getUserById` not `getUsrByID`
- Consistent patterns within each language
- Abbreviations only when they are genuinely universal (`id`, `url`, `http`)
- Domain language where domain words exist

## TypeScript and JavaScript

### Variables and functions

`camelCase`:

```typescript
const userName = 'alice';
function calculateTotal(items: Item[]): number { }
async function fetchUserProfile(userId: string): Promise<User> { }
```

### Types, interfaces, classes

`PascalCase`:

```typescript
interface UserProfile { id: string; displayName: string; createdAt: Date; }
type RequestStatus = 'pending' | 'success' | 'error';
class PaymentProcessor { }
```

### Constants

`UPPER_SNAKE_CASE`:

```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### React components

`PascalCase` for components, `camelCase` for props:

```typescript
interface ButtonProps { variant: 'primary' | 'secondary'; onClick: () => void; }
function ActionButton({ variant, onClick }: ButtonProps) { }
```

### Files and directories

- Lowercase `kebab-case`
- Tests end in `.test.ts`
- File names match the concept they export

## SQL

### Tables and columns

`snake_case`, tables in the singular:

```sql
create table member (
  id uuid primary key,
  display_name text not null,
  created_at timestamptz default now()
);
```

Column suffixes:

- `id` — primary key
- `{referenced_table}_id` — foreign key
- `{field}_intl` — internationalised text (`jsonb`, keys are locale codes)
- `{event}_at` — timestamps
- `deleted_at` — soft-delete marker

### Functions

Pattern: `{domain}_{verb}` or `{domain}_{verb}_{target}`

```sql
create function util_generate_slug(_input text) ...
create function task_get_status(_task_id uuid) ...
```

Standard verbs: `get`, `list`, `create`, `update`, `delete`, `check`, `is`, `has`, `set`, `generate`.

### Parameters and variables

Prefix `_` for parameters, `v_` for local variables:

```sql
create function process_order(_order_id uuid)
returns void
language plpgsql
as $func$
  declare
    v_total numeric;
  begin
    -- body
  end;
$func$;
```

### Objects bound to a table

- Check constraints — `chk_{table}_{field}_{purpose}`
- Unique constraints — `uq_{table}_{field}`
- Indexes — `idx_{table}_{field}`; unique as `idx_unique_{table}_{field}`
- Triggers — `trg_{table}_{purpose}`
- RLS policies — `pol_{table}_{operation}`

## CSS

`kebab-case`; BEM-style modifiers where useful:

```css
.user-profile { }
.action-button--primary { }

:root {
  --color-primary: #007bff;
  --spacing-md: 1rem;
}
```

## Git

### Branches

`kebab-case` with a type prefix:

```bash
feature/user-authentication
fix/login-redirect-loop
docs/api-documentation
```

### Commit subjects

Conventional Commits, imperative mood — see [Commits](./commits.md).

## Configuration

- JSON / JSONC keys — `camelCase`
- Environment variables — `UPPER_SNAKE_CASE`
- Package names — scoped, `kebab-case` (`@regardio/react`, `@regardio/ensemble-supabase`)

```json
{ "compilerOptions": { "strictNullChecks": true } }
```

```bash
DATABASE_URL=postgres://localhost:5432/mydb
NODE_ENV=production
```

## Related

- [Coding](./coding.md) — TypeScript and general patterns
- [SQL](./sql.md) — PostgreSQL naming, structure, and access
- [Commits](./commits.md) — Branch and commit naming
- [Writing](./writing.md) — Voice, tone, language

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
