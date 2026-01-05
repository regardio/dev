# Testing Approach

Testing philosophy and patterns for Regardio projects.

## Core Principles

- **Test business logic, not implementation details** - Validate what the system accomplishes for users
- **Fast feedback loops** - Enable rapid development cycles
- **Reliable and deterministic** - Tests should consistently pass or fail for the same reasons
- **Maintainable and readable** - Tests should clearly express requirements
- **Comprehensive coverage** - Include success paths, edge cases, and error conditions

## Testing Pyramid

The testing pyramid guides our investment:

| Level | Percentage | Purpose | Tools |
|-------|------------|---------|-------|
| **Unit** | 70% | Individual functions, components, business logic | Vitest |
| **Integration** | 20% | API endpoints, cross-component interactions | Vitest |
| **End-to-End** | 10% | Complete user workflows | Playwright |

## Writing Good Tests

### Structure: Arrange-Act-Assert

```typescript
it('should calculate total with discount', () => {
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

Test names should describe the expected behavior:

```typescript
// Good
it('should return empty array when no items match filter', () => {});
it('throws ValidationError when email is invalid', () => {});

// Bad
it('test1', () => {});
it('works correctly', () => {});
```

### Independence

Each test should:

- Set up its own state
- Not depend on other tests running first
- Clean up after itself
- Be runnable in isolation

## Frontend Testing

### Component Testing

Test behavior, not implementation:

```typescript
// Good: Tests user-visible behavior
it('displays error message when form submission fails', async () => {
  render(<ContactForm />);
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/failed/i);
});

// Bad: Tests implementation details
it('sets isError state to true', () => {
  // Testing internal state is fragile
});
```

### Accessibility Testing

- Verify keyboard navigation works
- Ensure screen readers can access content
- Check color contrast meets standards
- Test focus management

## Database Testing

### Function Testing

- Validate business rules are enforced
- Test access control boundaries
- Verify data validation
- Check error handling

### Performance Testing

- Monitor query execution time
- Verify index effectiveness
- Test under realistic load

## Continuous Integration

- **Pre-commit hooks** run linting and type checking
- **CI pipeline** runs full test suite on every PR
- **Coverage reports** track test coverage trends
- **Performance tests** run on significant changes

## Test Maintenance

- Delete tests that no longer provide value
- Update tests when requirements change
- Refactor tests alongside production code
- Keep test code as clean as production code

## Resources

- [Vitest Configuration](../toolchain/vitest.md)
- [Playwright Configuration](../toolchain/playwright.md)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
