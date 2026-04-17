---

title: "React"
description: "Component, hook, state, and performance patterns the Regardio React apps hold to."
publishedAt: 2026-04-17
order: 6
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

Regardio's user-facing surfaces — the Instrument app, the channel apps, the Storybook-hosted component packages — are all React. They share a design system through `@regardio/react` and styling through `@regardio/tailwind`. A contributor moving between them finds the same component shapes and the same decisions about where state lives. This page names those shared patterns.

## TypeScript in React

### Types

- Explicit types on function parameters and public return values
- `interface` for object shapes; `type` for unions
- Generic constraints when a type carries across boundaries

```typescript
interface UserData {
  id: string;
  email: string;
  displayName: string;
}

interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Pick<T, Exclude<keyof T, 'id'>>): Promise<T>;
}
```

### Naming

- `camelCase` — variables, functions, methods
- `PascalCase` — types, interfaces, classes, components
- `UPPER_SNAKE_CASE` — constants

### Error handling

Result types at API boundaries; specific error types for known failure modes:

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const data = await api.getUser(id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Components

### Structure

- Functional components with hooks
- One responsibility per component
- Composition over inheritance
- Explicit props interface

```typescript
interface CardProps {
  title: string;
  description: string;
  onSelect: (id: string) => void;
  isSelected?: boolean;
}

export function Card({ title, description, onSelect, isSelected = false }: CardProps) {
  const handleClick = useCallback(() => onSelect(title), [title, onSelect]);
  return (
    <div className={cn('card', { selected: isSelected })} onClick={handleClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Categories

- **UI components** — pure, reusable, no business logic
- **Feature components** — domain logic, backend integration
- **Page components** — route-level; compose features

### File layout

- `components/ui/` — reusable UI components
- `components/features/` — feature-specific components
- `hooks/` — custom hooks
- `types/` — shared types
- `utils/` — framework-agnostic helpers

### Props

- Pass only what the component uses
- `useCallback` for function props that cross memoised boundaries
- Sensible defaults; undefined handled gracefully

## Hooks

- Dependencies declared in full for `useEffect`, `useMemo`, `useCallback`
- Reusable logic extracts into a custom hook, name prefixed `use`
- Cleanup releases whatever the hook set up

```typescript
function useWebSocket(url: string) {
  const [data, setData] = useState<unknown>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setStatus('connected');
    ws.onmessage = (event) => setData(JSON.parse(event.data));
    ws.onclose = () => setStatus('disconnected');
    return () => ws.close();
  }, [url]);

  return { data, status };
}
```

### Event handling

- Typed with the React event they receive
- Forms prevent default and read values from controlled inputs
- Keyboard handlers accompany mouse handlers

```typescript
function SearchForm({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

## State

### Local

- `useState` for simple component state
- `useReducer` when the shape grows beyond two or three related pieces
- Custom hooks for reusable state logic

```typescript
type State = { items: Item[]; filter: string; sortBy: 'name' | 'date'; loading: boolean };
type Action =
  | { type: 'SET_ITEMS'; items: Item[] }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'SET_SORT'; sortBy: 'name' | 'date' }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ITEMS': return { ...state, items: action.items };
    case 'SET_FILTER': return { ...state, filter: action.filter };
    case 'SET_SORT': return { ...state, sortBy: action.sortBy };
    case 'SET_LOADING': return { ...state, loading: action.loading };
  }
}
```

### Global

- Context for theme, session, user preferences
- A dedicated store for application state that genuinely spans the app
- React Query (or equivalent) for server state

## Performance

- Code-split by route and feature; lazy-load what isn't needed yet
- `React.memo`, `useMemo`, `useCallback` where profiling points at a win — not as defensive decoration
- Bundle size monitored

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## Testing

Components are tested through the interface a user reaches — roles, labels, visible text, keyboard. Implementation-detail assertions (internal state, render counts) do not appear.

```typescript
describe('SearchForm', () => {
  it('calls onSubmit with query when form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    render(<SearchForm onSubmit={mockOnSubmit} />);
    const input = screen.getByRole('textbox', { name: /search/i });
    await user.type(input, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });
});
```

### Accessibility

- Keyboard navigation verified
- Screen-reader access through roles and labels
- Focus management checked on interactive flows
- ARIA attributes correct where they carry meaning

## Related

- [Coding](./coding.md) — TypeScript patterns React code builds on
- [Testing](./testing.md) — Testing philosophy and layers
- [Principles](./principles.md) — Shared principles across the stack
- [Naming](./naming.md) — Names across languages

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
