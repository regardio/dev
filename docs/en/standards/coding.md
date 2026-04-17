---

title: "Coding"
description: "TypeScript and general coding patterns Regardio projects hold to across packages and apps."
publishedAt: 2026-04-17
order: 5
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

Regardio code is TypeScript across the board. What keeps the packages readable to each other is a small set of patterns held consistently: strict types, small modules, small functions, deliberate error handling. This page catalogues those patterns.

## TypeScript

### Type safety

- Strict TypeScript is on
- Data shapes are defined as `interface`; unions and aliases use `type`
- `any` stays rare and gets a comment explaining why
- Return types are explicit when inference leaves the reader guessing

### Modules and exports

- One responsibility per module
- No barrel files; `package.json` `exports` names the public surface
- Internal helpers stay internal, even when they look generally useful

### Function design

- Small, focused functions
- Parameters and non-obvious return types are typed explicitly

```typescript
interface UserProfile {
  id: string;
  displayName: string;
  createdAt: Date;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
```

## React

### Components

- Functional components with hooks
- One responsibility per component
- Explicit props interfaces
- Composition over inheritance

### Hooks

- Dependencies declared in full for `useEffect`, `useMemo`, `useCallback`
- Reusable logic extracts into custom hooks (`use` prefix)
- Subscriptions, timers, and listeners are torn down in cleanup
- `useEffect` reads as a code smell; most cases have a better form elsewhere

### State

- Local state stays close to where it is used
- Related state collapses into one object or a `useReducer`
- Server state lives in a query layer, not in `useState`

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

See [React](./react.md) for the longer form.

## General

### Comments carry the *why*

A comment that restates the next line gets deleted. A comment that names the reason behind a non-obvious choice stays.

```typescript
// Reset to 1-based index for display
counter += 1;
```

### Errors are designed, not caught and dropped

The paths that fail are known when the function is written. Result types are preferred at API boundaries; thrown errors inside a module where the flow is clearer. No `catch` block silently swallows.

```typescript
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error });
  return { success: false, error: 'Operation failed' };
}
```

### Inference where it reads, explicit where it doesn't

```typescript
const names = ['Alice', 'Bob'];           // inferred as string[]
const config: AppConfig = loadConfig();    // explicit where the type isn't obvious
```

### Exceptions leave a reason

Lint suppressions and type escapes carry a comment:

```typescript
// biome-ignore lint/complexity/noForEach: forEach is clearer for side effects here
items.forEach(sendNotification);

// @ts-expect-error: library types are incorrect for this overload
const result = legacyLib.process(data);
```

An unjustified suppression is a regression.

## Related

- [Principles](./principles.md) — Shared principles the patterns build on
- [React](./react.md) — Component, hook, and state patterns
- [Naming](./naming.md) — Names across languages
- [Testing](./testing.md) — Testing philosophy

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
