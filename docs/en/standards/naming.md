---

title: Naming Conventions
type: concept
status: published
summary: Consistent naming patterns across Regardio projects
related: [coding-standards, sql-schema-standards]
locale: en-US
---

# Naming Conventions

Naming patterns for TypeScript, SQL, CSS, Git, and configuration. Prefer descriptive names over abbreviations; match the idiom of each language or domain.

## General Principles

- Descriptive names that convey purpose
- Consistent patterns within each language/domain
- Avoid abbreviations (`getUserById` not `getUsrById`)
- Use domain language

## TypeScript / JavaScript

### Variables and Functions

**camelCase**:

```typescript
const userName = 'alice';
function calculateTotal(items: Item[]): number { }
async function fetchUserProfile(userId: string): Promise<User> { }
```

### Types and Interfaces

**PascalCase**:

```typescript
interface UserProfile { id: string; displayName: string; createdAt: Date; }
type RequestStatus = 'pending' | 'success' | 'error';
class PaymentProcessor { }
```

### Constants

**UPPER_SNAKE_CASE**:

```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### React Components

**PascalCase** for components, **camelCase** for props:

```typescript
interface ButtonProps { variant: 'primary' | 'secondary'; onClick: () => void; }
function ActionButton({ variant, onClick }: ButtonProps) { }
```

### Files and Directories

- **All files**: lowercase kebab-case
- **Tests**: `*.test.ts`

## SQL / Database

### Tables and Columns

`snake_case`, singular table names:

```sql
create table member (
  id uuid primary key,
  display_name text not null,
  created_at timestamptz default now()
);
```

### Functions

`{domain}_{verb}` or `{domain}_{verb}_{target}`:

```sql
create function util_generate_slug(_input text) ...
create function task_get_status(_task_id uuid) ...
```

### Parameters and Variables

Prefix `_` for parameters, `v_` for local variables:

```sql
create function process_order(_order_id uuid)
returns void
language plpgsql
as $func$
  declare
    v_total numeric;
  begin
    -- implementation
  end;
$func$;
```

## CSS / Styling

**kebab-case**:

```css
.user-profile { }
.action-button--primary { }

:root {
  --color-primary: #007bff;
  --spacing-md: 1rem;
}
```

## Git

### Branch Names

**kebab-case** with type prefix:

```bash
feature/user-authentication
fix/login-redirect-loop
docs/api-documentation
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
```

## Configuration Files

**JSON/JSONC**: camelCase for keys
**Environment Variables**: UPPER_SNAKE_CASE

```json
{ "compilerOptions": { "strictNullChecks": true } }
```

```bash
DATABASE_URL=postgres://localhost:5432/mydb
NODE_ENV=production
```

Related documents:

- [Coding Standards](./coding.md) — TypeScript, React, and general coding patterns
- [SQL Schema Standards](./sql.md) — SQL schema styling and structure guidelines for PostgreSQL and Supabase projects
