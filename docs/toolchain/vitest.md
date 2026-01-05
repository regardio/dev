# Vitest

Fast unit testing powered by Vite.

## Why Vitest?

- **Speed** - Instant HMR for tests, parallel execution
- **Vite-native** - Same config, same transforms
- **Jest-compatible** - Familiar API, easy migration
- **TypeScript-first** - No additional setup needed

## Configuration

### Node.js Packages

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { vitestNodeConfig } from '@regardio/dev/vitest/node';

export default defineConfig({ test: vitestNodeConfig });
```

### React Packages

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { vitestReactConfig } from '@regardio/dev/vitest/react';

export default defineConfig({ test: vitestReactConfig });
```

### Testing Library Setup

For React packages, create `src/test-setup.ts`:

```typescript
import '@regardio/dev/testing/setup-react';
```

This sets up Testing Library matchers and cleanup.

## Scripts

```json
{
  "scripts": {
    "test": "exec-p test:*",
    "test:unit": "vitest run"
  }
}
```

## Running Tests

```bash
pnpm test:unit          # Run all tests once
pnpm vitest             # Watch mode
pnpm vitest --ui        # Visual UI
pnpm vitest --coverage  # With coverage report
```

## Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Place tests next to source files or in `__tests__` directories

## Writing Tests

Follow the Arrange-Act-Assert pattern:

```typescript
import { describe, it, expect } from 'vitest';

describe('calculateTotal', () => {
  it('should apply discount correctly', () => {
    // Arrange
    const items = [{ price: 100 }, { price: 50 }];
    const discount = 0.1;

    // Act
    const total = calculateTotal(items, discount);

    // Assert
    expect(total).toBe(135);
  });
});
```

## React Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

it('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledOnce();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
