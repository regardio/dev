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

## Impulse

AI coding assistants are most helpful when they work from shared project expectations instead of improvising repository conventions.

- Agent output can drift quickly without clear standards
- Small inconsistencies compound when assistants touch many files and technologies
- Shared guidance helps agents support the project without becoming disruptive

## Signal

Agent work is not separate from normal engineering work. It changes code, docs, tests, and release quality in the same system.

- Type safety, code structure, and error handling matter as much for agent-written code as for human-written code
- React, SQL, testing, and security patterns need to remain consistent across contributions
- Documentation and commit quality shape how maintainable agent work stays over time

## Effect

There are several ways to guide AI assistants.

- Very generic prompts are flexible, but they do not anchor repo-specific expectations
- Highly detailed per-task instructions can work, but they are hard to repeat consistently
- A shared project guide gives agents a stable baseline while still leaving room for task-specific direction

## Accord

We use a shared set of agent guidelines so AI assistants work within Regardio's coding, testing, and documentation standards.

- Prefer explicit, maintainable TypeScript
- Keep changes focused on what the task actually requires
- Treat security, testing, and documentation as part of the same quality bar

## Action

Use the guidance below when an AI assistant writes, edits, reviews, or explains code in Regardio projects.

### Core Principles

- **Write clean, explicit TypeScript** - Avoid `any`, use strict mode
- **Avoid obvious comments** - Code should be self-documenting
- **Avoid unnecessary complexity** - Only implement what is explicitly required
- **Use implicit type inference** - Unless impossible
- **Handle errors gracefully** - Use try/catch with appropriate error types
- **No emojis** - Unless explicitly requested

### TypeScript Standards

#### Type Safety

- Enable strict TypeScript type checking
- Define explicit interfaces for data structures
- Avoid `any` type except when absolutely necessary
- Use proper type assertions when needed

#### Code Structure

- Group related functionality in modules
- Use explicit exports in package.json rather than barrel files
- Keep modules focused on single responsibility
- Extract common logic into utility functions

#### Function Design

- Write small, focused functions
- Use proper parameter typing
- Implement proper error handling
- Return explicit types when inference is unclear

### React Standards

#### Components

- Use functional components with hooks
- Create small, focused components with single responsibility
- Define explicit prop interfaces with TypeScript
- Prefer composition over inheritance

#### Hooks

- Provide proper dependency arrays for `useEffect` and `useMemo`
- Extract reusable logic into custom hooks (follow `use` naming convention)
- Implement proper cleanup in `useEffect`
- **`useEffect` is a code smell** - Avoid if possible, justify when used

#### State

- Keep state as close to its usage as possible
- Prefer single state object over many separate `useState` calls
- Use `useReducer` for complex state logic

#### Testing

- Add `data-test` attributes for E2E tests where appropriate

### SQL / Database Standards

#### Naming

- Use `snake_case` for all database identifiers
- Prefix function parameters with `p_`, local variables with `v_`
- Use descriptive names that reflect purpose

#### Structure

- Write focused, single-purpose functions
- Implement proper error handling
- Document function behavior with comments
- Follow multi-tenancy patterns where applicable

### Common Patterns

#### React State Management

##### Good: Single State Object

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

##### Bad: Multiple useState Calls

```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

#### Avoiding useEffect

##### Good: Derived State

```typescript
// Compute values directly from props/state
const filteredItems = items.filter(item => item.active);
const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
```

##### Bad: Unnecessary useEffect

```typescript
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);
```

##### Good: Event Handlers

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

##### Bad: useEffect for Side Effects

```typescript
useEffect(() => {
  if (shouldSubmit) {
    api.submit(formData);
  }
}, [shouldSubmit]);
```

#### SQL Function Patterns

##### Good: Proper Naming and Structure

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
  SELECT name INTO v_old_name
  FROM user_profiles
  WHERE id = p_user_id;

  UPDATE user_profiles
  SET
    name = p_name,
    email = p_email,
    updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO audit_log (user_id, old_value, new_value)
  VALUES (p_user_id, v_old_name, p_name);
END;
$$ LANGUAGE plpgsql;
```

##### Bad: Poor Naming

```sql
CREATE FUNCTION updateProfile(
  userId uuid,
  name text
) RETURNS void AS $$
DECLARE
  oldName text;
BEGIN
END;
$$ LANGUAGE plpgsql;
```

#### TypeScript Type Safety

##### Good: Explicit Interfaces

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

##### Bad: Using any

```typescript
function updateProfile(profile: any): Promise<void> {
  // Implementation
}
```

### Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm lint          # Run linting only
pnpm test          # Run tests
pnpm typecheck     # TypeScript type checking
```

Run `typecheck` regularly. Run linting when task is complete.

### Security

- Avoid security vulnerabilities (XSS, SQL injection, OWASP Top 10)
- Implement proper validation at system boundaries
- Use proper access control patterns
- Never hardcode secrets or API keys

### Documentation

- Document complex logic with comments explaining *why*
- Use JSDoc for TypeScript functions when helpful
- Keep README files updated

## Essence

This guide gives AI assistants a project-specific baseline for writing and editing code in Regardio.

- Agent output stays closer to the same standards as human work
- Reviewers can expect a more consistent level of code quality
- Repository conventions remain visible instead of being rediscovered task by task

Related documents:

- [Coding Standards](./coding.md) — TypeScript, React, and general coding patterns for Regardio projects
- [Naming Conventions](./naming.md) — Consistent naming patterns across Regardio projects
- [Testing Approach](./testing.md) — Testing philosophy and patterns for Regardio projects
- [Commit Conventions](./commits.md) — Conventional commits for consistent history and automated changelogs
