---

title: Coding Standards
type: concept
status: published
summary: TypeScript, React, and general coding patterns for Regardio projects
related: [react-standards, development-principles, naming-conventions]
locale: en-US
---

# Coding Standards

Patterns for TypeScript, React, and general implementation. Apply these when writing and reviewing code.

## TypeScript

### Type Safety

- Enable strict TypeScript type checking
- Define explicit interfaces for data structures
- Avoid `any` type except when absolutely necessary

### Code Structure

- Group related functionality in modules
- Use explicit exports in package.json (no barrel files)
- Single responsibility per module
- Extract common logic into utility functions

### Function Design

- Write small, focused functions
- Proper parameter typing and error handling
- Return explicit types when inference is unclear

```typescript
// Good
interface UserProfile {
  id: string;
  displayName: string;
  createdAt: Date;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

// Bad: Implicit any, unclear return
async function fetchUser(id) {
  return await api.get(`/users/${id}`);
}
```

## React

### Components

- Use functional components with hooks
- Small, focused components with single responsibility
- Explicit prop interfaces with TypeScript
- Composition over inheritance

### Hooks

- Proper dependency arrays for `useEffect` and `useMemo`
- Extract reusable logic into custom hooks (`use` prefix)
- Implement cleanup in `useEffect`
- **`useEffect` is a code smell** - Avoid if possible

### State

- Keep state close to usage
- Prefer single state object over multiple `useState` calls
- Use `useReducer` for complex state logic

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant, isDisabled, onClick, children }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} disabled={isDisabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

## General Patterns

### Avoid Obvious Comments

Comments explain *why*, not *what*:

```typescript
// Bad: Obvious
// Increment counter by 1
counter += 1;

// Good: Explains why
// Reset to 1-based index for display
counter += 1;
```

#### Handle Errors Gracefully

```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error });
  return { success: false, error: 'Operation failed' };
}
```

#### Use Implicit Type Inference

```typescript
// Good: Inferred as string[]
const names = ['Alice', 'Bob'];

// Unnecessary
const names: string[] = ['Alice', 'Bob'];

// Good: Explicit when not obvious
const config: AppConfig = loadConfig();
```

### Exceptions

When rules do not apply, document why:

```typescript
// biome-ignore lint/complexity/noForEach: forEach is clearer for side effects
items.forEach(item => sendNotification(item));

// @ts-expect-error: Library types are incorrect for this overload
const result = legacyLib.process(data);
```

Always include a reason explaining the exception.

Related documents:

- [Development Principles](./principles.md) — Universal coding standards and principles
- [React and TypeScript Standards](./react.md) — Component, hook, and state patterns
- [Testing Approach](./testing.md) — Testing philosophy and patterns
