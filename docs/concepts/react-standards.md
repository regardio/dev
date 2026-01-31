# React and TypeScript Standards

TypeScript and React development patterns for Regardio projects.

## Table of Contents

- [TypeScript Standards](#typescript-standards)
- [React Standards](#react-standards)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Performance Guidelines](#performance-guidelines)

## TypeScript Standards

### Type Definitions

- **Explicit typing**: Always define explicit types for function parameters and return values
- **Interface over type**: Prefer `interface` for object shapes, `type` for unions and computed types
- **Strict configuration**: Use strict TypeScript configuration with no implicit any
- **Generic constraints**: Use generic constraints to ensure type safety

```typescript
// Good: Explicit interface definition
interface UserData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

// Good: Function with explicit types
function processUser(data: UserData): Promise<ProcessedUser> {
  // Implementation
}

// Good: Generic with constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
}
```

### Naming Conventions

- **camelCase** for variables, functions, and methods
- **PascalCase** for types, interfaces, classes, and components
- **UPPER_SNAKE_CASE** for constants
- **Descriptive names** that clearly indicate purpose

```typescript
// Good naming examples
const userRepository = new UserRepository();
const MAX_RETRY_ATTEMPTS = 3;

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}

class ApiClient {
  private readonly baseUrl: string;

  async fetchData(endpoint: string): Promise<unknown> {
    // Implementation
  }
}
```

### Error Handling

- **Type-safe error handling**: Use discriminated unions or Result types
- **Explicit error types**: Define specific error types for different failure modes
- **Graceful degradation**: Handle errors in ways that preserve user experience

```typescript
// Good: Result type pattern
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

- **Functional components**: Use function components with hooks
- **Single responsibility**: Each component should have one clear purpose
- **Composition over inheritance**: Build complex UIs through component composition
- **Props interface**: Define explicit interfaces for all component props

```typescript
interface CardProps {
  title: string;
  description: string;
  onSelect: (id: string) => void;
  isSelected?: boolean;
  className?: string;
}

export function Card({
  title,
  description,
  onSelect,
  isSelected = false,
  className
}: CardProps) {
  const handleClick = useCallback(() => {
    onSelect(title);
  }, [title, onSelect]);

  return (
    <div
      className={cn('card', { selected: isSelected }, className)}
      onClick={handleClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Hook Usage

- **Custom hooks**: Extract reusable logic into custom hooks
- **Dependency arrays**: Always include all dependencies in useEffect arrays
- **Cleanup**: Properly clean up subscriptions and timers
- **Memoization**: Use useMemo and useCallback judiciously for performance

```typescript
// Good: Custom hook with proper cleanup
function useWebSocket(url: string) {
  const [data, setData] = useState<unknown>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setStatus('connected');
    ws.onmessage = (event) => setData(JSON.parse(event.data));
    ws.onclose = () => setStatus('disconnected');

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, status };
}
```

## Event Handling

### Type-Safe Event Handlers

- **Proper event types**: Use correct React event types for handlers
- **Prevent default**: Explicitly handle form submissions and link clicks
- **Accessibility**: Include keyboard event handlers where appropriate

```typescript
function SearchForm({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(query);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

## Component Architecture

### File Organization

```text
src/
  components/
    ui/              # Reusable UI components
    features/        # Feature-specific components
    shared/          # Shared business logic components
  hooks/             # Custom hooks
  types/             # Type definitions
  utils/             # Utility functions
  stores/            # State management
```

### Component Categories

**UI Components**: Pure, reusable components

- No business logic
- Accept all styling via props
- Fully accessible
- Well-documented

**Feature Components**: Business logic components

- Handle specific domain logic
- Integrate with backend services
- Manage local state
- Compose UI components

**Page Components**: Route-level components

- Handle routing logic
- Coordinate multiple features
- Manage page-level state

### Props Design

- **Minimal props**: Only pass what's needed
- **Stable references**: Use useCallback for function props
- **Default values**: Provide sensible defaults
- **Optional chaining**: Handle undefined props gracefully

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  onRowSelect?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// Good: Generic, reusable component
function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowSelect,
  loading = false,
  emptyMessage = 'No data available',
  className
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <table className={className}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.id}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr
            key={row.id}
            onClick={() => onRowSelect?.(row)}
            className={onRowSelect ? 'clickable' : undefined}
          >
            {columns.map(col => (
              <td key={col.id}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## State Management

### Local State

- **useState**: For simple component state
- **useReducer**: For complex state logic
- **Custom hooks**: For reusable state logic

```typescript
// Good: useReducer for complex state
type State = {
  items: Item[];
  filter: string;
  sortBy: 'name' | 'date';
  loading: boolean;
};

type Action =
  | { type: 'SET_ITEMS'; items: Item[] }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'SET_SORT'; sortBy: 'name' | 'date' }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    case 'SET_SORT':
      return { ...state, sortBy: action.sortBy };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
  }
}
```

### Global State

- **Context**: For theme, user preferences, authentication
- **External stores**: For complex application state
- **Server state**: Use React Query or SWR for server data

```typescript
// Good: Context for global app state
interface AppContextValue {
  user: User | null;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const value = useMemo(
    () => ({ user, theme, setTheme }),
    [user, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

## Performance Guidelines

### Optimization Strategies

- **Code splitting**: Split bundles by route and feature
- **Lazy loading**: Load components and data on demand
- **Memoization**: Prevent unnecessary re-renders
- **Bundle analysis**: Monitor and optimize bundle size

```typescript
// Good: Lazy loading with React.lazy
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Rendering Performance

- **React.memo**: Memoize expensive components
- **useMemo**: Memoize expensive calculations
- **useCallback**: Stabilize function references
- **Virtual scrolling**: For large lists

```typescript
// Good: Optimized list component
const ListItem = React.memo(function ListItem({
  item,
  onSelect
}: {
  item: Item;
  onSelect: (id: string) => void;
}) {
  const handleClick = useCallback(() => {
    onSelect(item.id);
  }, [item.id, onSelect]);

  return (
    <div onClick={handleClick}>
      {item.name}
    </div>
  );
});

function List({ items, onSelect }: { items: Item[]; onSelect: (id: string) => void }) {
  // Memoize expensive filtering/sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <div>
      {sortedItems.map(item => (
        <ListItem key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
```

## Testing Components

### Component Testing

Test behavior, not implementation:

```typescript
// Good: Tests user-visible behavior
describe('SearchForm', () => {
  it('calls onSubmit with query when form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    render(<SearchForm onSubmit={mockOnSubmit} />);

    const input = screen.getByRole('textbox', { name: /search/i });
    await user.type(input, 'test query');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('clears input when Escape is pressed', async () => {
    render(<SearchForm onSubmit={vi.fn()} />);

    const input = screen.getByRole('textbox', { name: /search/i });
    await user.type(input, 'test');
    await user.keyboard('{Escape}');

    expect(input).toHaveValue('');
  });
});
```

### Accessibility Testing

- Verify keyboard navigation works
- Ensure screen readers can access content
- Check ARIA attributes are correct
- Test focus management

```typescript
describe('Modal', () => {
  it('traps focus within modal when open', async () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);

    const firstButton = screen.getByRole('button', { name: /close/i });
    const lastButton = screen.getByRole('button', { name: /confirm/i });

    firstButton.focus();
    await user.tab();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
  });
});
```

## Related Documentation

- [Coding Standards](./coding-standards.md) - General TypeScript patterns
- [Testing Approach](./testing.md) - Testing philosophy and patterns
- [Development Principles](./development-principles.md) - Universal coding standards

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
