---

title: React and TypeScript Standards
type: concept
status: published
summary: TypeScript and React development patterns for Regardio projects
related: [coding-standards, testing, development-principles]
locale: en-US
---

# React and TypeScript Standards

TypeScript and React development patterns for Regardio projects.

## TypeScript Standards

### Type Definitions

- Explicit types for function parameters and return values
- Prefer `interface` for object shapes, `type` for unions
- Strict TypeScript configuration, no implicit any
- Use generic constraints for type safety

```typescript
interface UserData {
  id: string;
  email: string;
  displayName: string;
}

function processUser(data: UserData): Promise<ProcessedUser> { }

interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
}
```

### Naming Conventions

- **camelCase**: variables, functions, methods
- **PascalCase**: types, interfaces, classes, components
- **UPPER_SNAKE_CASE**: constants

### Error Handling

- Use discriminated unions or Result types
- Define specific error types for failure modes
- Handle errors gracefully

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

## React Standards

### Component Structure

- Use functional components with hooks
- Single responsibility per component
- Composition over inheritance
- Explicit props interfaces

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

### Hook Usage

- Extract reusable logic into custom hooks
- Include all dependencies in useEffect arrays
- Clean up subscriptions and timers
- Use useMemo/useCallback judiciously

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

## Event Handling

- Use correct React event types
- Handle form submissions and prevent default
- Include keyboard handlers for accessibility

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

## Component Architecture

### File Organization

- `components/ui/` - Reusable UI components
- `components/features/` - Feature-specific components
- `hooks/` - Custom hooks
- `types/` - Type definitions
- `utils/` - Utility functions

### Component Categories

- **UI Components**: Pure, reusable, no business logic
- **Feature Components**: Domain logic, backend integration
- **Page Components**: Route-level, coordinate features

### Props Design

- Pass only what's needed
- Use useCallback for function props
- Provide sensible defaults
- Handle undefined gracefully

## State Management

### Local State

- **useState**: Simple component state
- **useReducer**: Complex state logic
- **Custom hooks**: Reusable state logic

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

### Global State

- **Context**: Theme, user preferences, authentication
- **External stores**: Complex application state
- **Server state**: React Query or SWR

## Performance

### Optimization Strategies

- Code splitting by route and feature
- Lazy load components and data
- Memoize to prevent re-renders
- Monitor bundle size

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

### Rendering Performance

- **React.memo**: Memoize expensive components
- **useMemo**: Memoize calculations
- **useCallback**: Stabilize function references

```typescript
const ListItem = React.memo(function ListItem({ item, onSelect }: { item: Item; onSelect: (id: string) => void }) {
  const handleClick = useCallback(() => onSelect(item.id), [item.id, onSelect]);
  return <div onClick={handleClick}>{item.name}</div>;
});
```

## Testing

Test behavior, not implementation:

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

### Accessibility Testing

- Verify keyboard navigation
- Ensure screen reader access
- Check ARIA attributes
- Test focus management

## Related Documentation

- [Coding](./coding.md) - General TypeScript patterns
- [Testing](./testing.md) - Testing philosophy and patterns
- [Principles](./principles.md) - Universal coding standards

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
