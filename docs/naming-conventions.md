# Naming Conventions

**Consistent naming patterns across Regardio projects.**

## General Principles

- **Be descriptive** - Names should convey purpose and intent
- **Be consistent** - Follow established patterns within each language/domain
- **Avoid abbreviations** - Prefer `getUserById` over `getUsrById`
- **Use domain language** - Match terminology used by the team and stakeholders

## TypeScript / JavaScript

### Variables and Functions

Use **camelCase**:

```typescript
const userName = 'alice';
const isActive = true;

function calculateTotal(items: Item[]): number { }
async function fetchUserProfile(userId: string): Promise<User> { }
```

### Types and Interfaces

Use **PascalCase**:

```typescript
interface UserProfile {
  id: string;
  displayName: string;
  createdAt: Date;
}

type RequestStatus = 'pending' | 'success' | 'error';

class PaymentProcessor { }
```

### Constants

Use **UPPER_SNAKE_CASE** for true constants:

```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

### React Components

Use **PascalCase** for components, **camelCase** for props:

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  isDisabled?: boolean;
  onClick: () => void;
}

function ActionButton({ variant, isDisabled, onClick }: ButtonProps) { }
```

### Files and Directories

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `date-utils.ts`)
- **Tests**: `*.test.ts` or `*.test.tsx`
- **Types**: `*.types.ts` or inline

## SQL / Database

### Tables and Columns

Use **snake_case**:

```sql
CREATE TABLE user_profile (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### Functions

Use **snake_case** with verb prefix:

```sql
CREATE FUNCTION get_user_by_id(p_user_id UUID) ...
CREATE FUNCTION create_member(p_ensemble_id UUID, p_user_id UUID) ...
CREATE FUNCTION update_participation_level(p_member_id UUID, p_level TEXT) ...
```

### Parameters

Prefix with `p_` for parameters, `v_` for local variables:

```sql
CREATE FUNCTION process_order(
  p_order_id UUID,
  p_customer_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_total NUMERIC;
  v_discount NUMERIC;
BEGIN
  -- Implementation
END;
$$ LANGUAGE plpgsql;
```

### Enums

Use **snake_case** for enum types and values:

```sql
CREATE TYPE participation_level AS ENUM (
  'observer',
  'contributor',
  'steward'
);
```

## CSS / Styling

### CSS Classes

Use **kebab-case**:

```css
.user-profile { }
.action-button--primary { }
.card__header { }
```

### CSS Variables

Use **kebab-case** with namespace prefix:

```css
:root {
  --color-primary: #007bff;
  --spacing-md: 1rem;
  --font-size-lg: 1.25rem;
}
```

## Git

### Branch Names

Use **kebab-case** with type prefix:

```bash
feature/user-authentication
fix/login-redirect-loop
docs/api-documentation
refactor/payment-processing
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile page
fix: resolve login redirect issue
docs: update API documentation
refactor: simplify payment processing logic
test: add unit tests for date utilities
chore: update dependencies
```

## Configuration Files

### JSON/JSONC

Use **camelCase** for keys:

```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

### Environment Variables

Use **UPPER_SNAKE_CASE**:

```bash
DATABASE_URL=postgres://localhost:5432/mydb
API_SECRET_KEY=your-secret-key
NODE_ENV=production
```
