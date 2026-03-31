---

title: Testing Approach
type: concept
status: published
summary: Testing philosophy and patterns for Regardio projects
related: [react-standards, development-principles]
locale: en-US
---

# Testing Approach

Testing philosophy and patterns for Regardio projects.

## Core Principles

- Test business logic, not implementation details
- Fast feedback loops for rapid development
- Reliable and deterministic tests
- Maintainable and readable
- Comprehensive coverage (success paths, edge cases, errors)

## Testing Pyramid

| Level | % | Purpose | Tools |
|-------|---|---------|-------|
| **Unit** | 70% | Functions, components, business logic | Vitest |
| **Integration** | 20% | API endpoints, cross-component | Vitest |
| **End-to-End** | 10% | Complete user workflows | Playwright |

## Writing Good Tests

### Structure: Arrange-Act-Assert

```typescript
it('calculates total with discount', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 50 }];
  const discount = 0.1;
  // Act
  const total = calculateTotal(items, discount);
  // Assert
  expect(total).toBe(135);
});
```

### Naming

Describe expected behavior:

```typescript
// Good
it('returns empty array when no items match filter', () => {});
it('throws ValidationError when email is invalid', () => {});

// Bad
it('test1', () => {});
```

### Independence

- Set up own state
- No dependencies on other tests
- Clean up after itself
- Runnable in isolation

## Frontend Testing

Test behavior, not implementation:

```typescript
// Good: User-visible behavior
it('displays error message when form submission fails', async () => {
  render(<ContactForm />);
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/failed/i);
});

// Bad: Implementation details
it('sets isError state to true', () => {});
```

### Accessibility Testing

- Keyboard navigation
- Screen reader access
- Color contrast
- Focus management

## Database Testing

- Validate business rules
- Test access control boundaries
- Verify data validation
- Check error handling
- Monitor query performance
- Verify index effectiveness

## Coverage Requirements

Library packages: 80% minimum for statements, branches, functions, lines

Enforced at:

- Local development (`pnpm test`)
- Release script (`ship-staging`)
- CI/CD (GitHub Actions)

## Quality Gates

Before npm publishing:

1. Build succeeds
2. Type check passes
3. Coverage meets thresholds

## Continuous Integration

- Pre-commit hooks run linting (Biome)
- CI pipeline runs build, typecheck, coverage
- Release workflow blocks publishing on failures

## Test Maintenance

- Delete tests that no longer provide value
- Update tests when requirements change
- Refactor tests alongside production code
- Keep test code clean

## Resources

- [Vitest Configuration](./toolchain/vitest.md)
- [Playwright Configuration](./toolchain/playwright.md)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
