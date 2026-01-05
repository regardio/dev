# Coding Standards

TypeScript, React, and general coding patterns for Regardio projects.

## TypeScript

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

### Examples

```typescript
// Good: Explicit interface, clear types
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

### Example

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  isDisabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant, isDisabled, onClick, children }: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## General Patterns

### Avoid Obvious Comments

Code should be self-documenting. Comments should explain *why*, not *what*:

```typescript
// Bad: Obvious comment
// Increment counter by 1
counter += 1;

// Good: Explains why
// Reset to 1-based index for display
counter += 1;
```

### Handle Errors Gracefully

```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error });
  return { success: false, error: 'Operation failed' };
}
```

### Use Implicit Type Inference

Let TypeScript infer types when obvious:

```typescript
// Good: Type is inferred as string[]
const names = ['Alice', 'Bob'];

// Unnecessary: Explicit type adds noise
const names: string[] = ['Alice', 'Bob'];

// Good: Explicit when not obvious
const config: AppConfig = loadConfig();
```

## Exceptions

When rules don't apply, document why:

```typescript
// biome-ignore lint/complexity/noForEach: forEach is clearer for side effects
items.forEach(item => sendNotification(item));

// @ts-expect-error: Library types are incorrect for this overload
const result = legacyLib.process(data);
```

Always include a reason explaining the exception.
