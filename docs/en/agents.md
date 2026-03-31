---

title: AI Agent Guidelines
type: guide
status: published
summary: Instructions for AI coding assistants working with Regardio projects
related: [coding-standards, react-standards, development-principles]
locale: en-US
---

# AI Agent Guidelines

Instructions for AI coding assistants working with Regardio projects.

This document provides universal guidance for Claude, Codex, Cursor, Windsurf, Gemini, and other AI coding agents.

## Core Principles

- **Write clean, explicit TypeScript** - Avoid `any`, use strict mode
- **Avoid obvious comments** - Code should be self-documenting
- **Avoid unnecessary complexity** - Only implement what's explicitly required
- **Use implicit type inference** - Unless impossible
- **Handle errors gracefully** - Use try/catch with appropriate error types
- **No emojis** - Unless explicitly requested

## TypeScript Standards

### Type Safety

- Enable strict TypeScript type checking
- Define explicit interfaces for data structures
- Avoid `any` type except when absolutely necessary
- Use proper type assertions when needed

### Code Structure

- Group related functionality in modules
- Use explicit exports in package.json rather than barrel files
- Keep modules focused on single responsibility
- Extract common logic into utility functions

### Function Design

- Write small, focused functions
- Use proper parameter typing
- Implement proper error handling
- Return explicit types when inference is unclear

## React Standards

### Components

- Use functional components with hooks
- Create small, focused components with single responsibility
- Define explicit prop interfaces with TypeScript
- Prefer composition over inheritance

### Hooks

- Provide proper dependency arrays for `useEffect` and `useMemo`
- Extract reusable logic into custom hooks (follow `use` naming convention)
- Implement proper cleanup in `useEffect`
- **`useEffect` is a code smell** - Avoid if possible, justify when used

### State

- Keep state as close to its usage as possible
- Prefer single state object over many separate `useState` calls
- Use `useReducer` for complex state logic

### Testing

- Add `data-test` attributes for E2E tests where appropriate

## SQL / Database Standards

### Naming

- Use `snake_case` for all database identifiers
- Prefix function parameters with `p_`, local variables with `v_`
- Use descriptive names that reflect purpose

### Structure

- Write focused, single-purpose functions
- Implement proper error handling
- Document function behavior with comments
- Follow multi-tenancy patterns where applicable

## Common Patterns

### React State Management

#### ✅ Good: Single State Object

```typescript
const [state, setState] = useState({
  isLoading: false,
  data: null,
  error: null
});

// Update single property
setState(prev => ({ ...prev, isLoading: true }));

// Update multiple properties
setState(prev => ({ ...prev, isLoading: false, data: result }));
```

#### ❌ Bad: Multiple useState Calls

```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

### Avoiding useEffect

#### ✅ Good: Derived State

```typescript
// Compute values directly from props/state
const filteredItems = items.filter(item => item.active);
const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
```

#### ❌ Bad: Unnecessary useEffect

```typescript
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);
```

#### ✅ Good: Event Handlers

```typescript
const handleSubmit = async () => {
  setState(prev => ({ ...prev, isLoading: true }));
  try {
    const result = await api.submit(formData);
    setState(prev => ({ ...prev, isLoading: false, data: result }));
  } catch (error) {
    setState(prev => ({ ...prev, isLoading: false, error }));
  }
};
```

#### ❌ Bad: useEffect for Side Effects

```typescript
useEffect(() => {
  if (shouldSubmit) {
    api.submit(formData);
  }
}, [shouldSubmit]);
```

### SQL Function Patterns

#### ✅ Good: Proper Naming and Structure

```sql
CREATE FUNCTION update_user_profile(
  p_user_id uuid,
  p_name text,
  p_email text
) RETURNS void AS $$
DECLARE
  v_old_name text;
  v_timestamp timestamptz;
BEGIN
  -- Get current values
  SELECT name INTO v_old_name
  FROM user_profiles
  WHERE id = p_user_id;

  -- Update profile
  UPDATE user_profiles
  SET
    name = p_name,
    email = p_email,
    updated_at = now()
  WHERE id = p_user_id;

  -- Log change
  INSERT INTO audit_log (user_id, old_value, new_value)
  VALUES (p_user_id, v_old_name, p_name);
END;
$$ LANGUAGE plpgsql;
```

#### ❌ Bad: Poor Naming

```sql
CREATE FUNCTION updateProfile(
  userId uuid,
  name text
) RETURNS void AS $$
DECLARE
  oldName text;  -- Should be v_old_name
BEGIN
  -- function logic
END;
$$ LANGUAGE plpgsql;
```

### TypeScript Type Safety

#### ✅ Good: Explicit Interfaces

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function updateProfile(profile: UserProfile): Promise<void> {
  // Implementation
}
```

#### ❌ Bad: Using any

```typescript
function updateProfile(profile: any): Promise<void> {
  // Implementation
}
```

## Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm lint          # Run linting only
pnpm test          # Run tests
pnpm typecheck     # TypeScript type checking
```

Run `typecheck` regularly. Run linting when task is complete.

## Security

- Avoid security vulnerabilities (XSS, SQL injection, OWASP Top 10)
- Implement proper validation at system boundaries
- Use proper access control patterns
- Never hardcode secrets or API keys

## Documentation

- Document complex logic with comments explaining *why*
- Use JSDoc for TypeScript functions when helpful
- Keep README files updated

## Related Documentation

- [Coding](./coding.md)
- [Naming](./naming.md)
- [Testing](./testing.md)
- [Commits](./commits.md)
