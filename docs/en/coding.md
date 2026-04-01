---

title: Coding Standards
type: concept
status: published
summary: TypeScript, React, and general coding patterns for Regardio projects
related: [react-standards, development-principles, naming-conventions]
locale: en-US
---

# Coding Standards

TypeScript, React, and general coding patterns for Regardio projects.

## Impulse

Shared coding standards become necessary when teams need to read, review, and change the same code without relying on personal habit alone.

- Inconsistent code structure increases cognitive load
- Weak conventions slow reviews and make refactoring harder
- Shared patterns help projects stay legible over time

## Signal

Standards are most useful when they support judgment instead of replacing it.

- TypeScript and React both benefit from explicit, readable structure
- Error handling, state management, and exceptions reveal where code quality matters most
- A small set of recurring patterns can remove avoidable ambiguity

## Effect

There are several ways to document coding practice.

- A broad style guide can be comprehensive, but hard to apply
- Purely local conventions are flexible, but they drift quickly
- A compact set of shared patterns gives teams usable guidance without freezing every decision

## Accord

We use shared coding standards to keep TypeScript, React, and general implementation patterns understandable across Regardio projects.

- Prefer clarity over cleverness
- Keep modules and functions focused
- Make exceptions explicit when a rule does not apply cleanly

## Action

Use the patterns below when writing and reviewing code.

### TypeScript

#### Type Safety

- Enable strict TypeScript type checking
- Define explicit interfaces for data structures
- Avoid `any` type except when absolutely necessary

#### Code Structure

- Group related functionality in modules
- Use explicit exports in package.json (no barrel files)
- Single responsibility per module
- Extract common logic into utility functions

#### Function Design

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

### React

#### Components

- Use functional components with hooks
- Small, focused components with single responsibility
- Explicit prop interfaces with TypeScript
- Composition over inheritance

#### Hooks

- Proper dependency arrays for `useEffect` and `useMemo`
- Extract reusable logic into custom hooks (`use` prefix)
- Implement cleanup in `useEffect`
- **`useEffect` is a code smell** - Avoid if possible

#### State

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

### General Patterns

#### Avoid Obvious Comments

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

## Essence

This document gives coding work a shared practical baseline.

- Teams can read and review code against the same expectations
- TypeScript and React patterns stay easier to reason about across projects
- Exceptions remain deliberate instead of becoming silent drift

Related documents:

- [Development Principles](./principles.md) — Universal coding standards and principles for Regardio projects
- [React and TypeScript Standards](./react.md) — TypeScript and React development patterns for Regardio projects
- [Naming Conventions](./naming.md) — Consistent naming patterns across Regardio projects
