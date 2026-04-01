---

title: Naming Conventions
type: concept
status: published
summary: Consistent naming patterns across Regardio projects
related: [coding-standards, sql-schema-standards]
locale: en-US
---

# Naming Conventions

Consistent naming patterns across Regardio projects.

## Impulse

Naming matters because it shapes how quickly people can understand, search, and change a codebase.

- Inconsistent naming forces readers to re-learn patterns from file to file
- Weak names hide intent and increase review overhead
- Shared conventions make systems easier to navigate across languages and domains

## Signal

Names do more than label things. They express structure, boundaries, and responsibility.

- Different languages and tools benefit from different naming styles
- Consistent patterns improve predictability across projects
- Good naming lowers the cognitive cost of reading code, schemas, and configuration

## Effect

There are several ways to handle naming.

- Fully local naming habits are flexible, but they fragment quickly
- A single universal naming rule is simple, but it ignores language-specific norms
- A shared set of domain-aware conventions creates consistency without flattening useful differences

## Accord

We use explicit naming conventions that match the language and domain they belong to.

- Prefer descriptive names over abbreviations
- Follow established idioms for each language or medium
- Let names reflect purpose rather than private shorthand

## Action

Use the patterns below when naming variables, types, files, schemas, branches, and configuration.

### General Principles

- Descriptive names that convey purpose
- Consistent patterns within each language/domain
- Avoid abbreviations (`getUserById` not `getUsrById`)
- Use domain language

### TypeScript / JavaScript

#### Variables and Functions

**camelCase**:

```typescript
const userName = 'alice';
function calculateTotal(items: Item[]): number { }
async function fetchUserProfile(userId: string): Promise<User> { }
```

#### Types and Interfaces

**PascalCase**:

```typescript
interface UserProfile { id: string; displayName: string; createdAt: Date; }
type RequestStatus = 'pending' | 'success' | 'error';
class PaymentProcessor { }
```

#### Constants

**UPPER_SNAKE_CASE**:

```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

#### React Components

**PascalCase** for components, **camelCase** for props:

```typescript
interface ButtonProps { variant: 'primary' | 'secondary'; onClick: () => void; }
function ActionButton({ variant, onClick }: ButtonProps) { }
```

#### Files and Directories

- **All files**: lowercase kebab-case
- **Tests**: `*.test.ts`

### SQL / Database

#### Tables and Columns

**snake_case**:

```sql
CREATE TABLE user_profile (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Functions

**snake_case** with verb prefix:

```sql
CREATE FUNCTION get_user_by_id(p_user_id UUID) ...
CREATE FUNCTION create_member(p_ensemble_id UUID, p_user_id UUID) ...
```

#### Parameters and Variables

Prefix `p_` for parameters, `v_` for local variables:

```sql
CREATE FUNCTION process_order(p_order_id UUID, p_customer_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total NUMERIC;
  v_discount NUMERIC;
BEGIN
  -- Implementation
END;
$$ LANGUAGE plpgsql;
```

### CSS / Styling

**kebab-case**:

```css
.user-profile { }
.action-button--primary { }

:root {
  --color-primary: #007bff;
  --spacing-md: 1rem;
}
```

### Git

#### Branch Names

**kebab-case** with type prefix:

```bash
feature/user-authentication
fix/login-redirect-loop
docs/api-documentation
```

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
```

### Configuration Files

**JSON/JSONC**: camelCase for keys
**Environment Variables**: UPPER_SNAKE_CASE

```json
{ "compilerOptions": { "strictNullChecks": true } }
```

```bash
DATABASE_URL=postgres://localhost:5432/mydb
NODE_ENV=production
```

## Essence

This document gives naming a shared logic across languages without forcing everything into one pattern.

- Code and schemas become easier to scan and search
- Teams can rely on familiar conventions in each domain
- Naming choices stay descriptive instead of drifting toward shorthand

Related documents:

- [Coding Standards](./coding.md) — TypeScript, React, and general coding patterns
- [SQL Schema Standards](./sql.md) — SQL schema styling and structure guidelines for PostgreSQL and Supabase projects
