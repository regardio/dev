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

## Impulse

Software becomes harder to trust when verification happens too late, too narrowly, or too inconsistently.

- Fast-moving teams need feedback before mistakes harden into regressions
- Tests lose value when they mirror implementation instead of behavior
- Shared expectations help teams balance speed, confidence, and maintenance cost

## Signal

A useful testing approach treats tests as part of design rather than an afterthought.

- Different kinds of tests answer different kinds of risk
- Reliable tests support refactoring and release confidence
- Coverage is helpful only when paired with meaningful assertions

## Effect

There are several ways to structure testing work.

- Heavy end-to-end testing covers broad behavior, but it is slower and harder to maintain
- Pure unit testing is fast, but it can miss integration boundaries
- A balanced testing pyramid gives fast local feedback while still covering system behavior

## Accord

We use a layered testing approach in Regardio projects.

- Prefer tests that describe behavior and business rules
- Keep fast feedback in unit and integration tests
- Use end-to-end tests for critical user flows and cross-system confidence

## Action

Use the structure, patterns, and quality gates below when planning and writing tests.

### Core Principles

- Test business logic, not implementation details
- Fast feedback loops for rapid development
- Reliable and deterministic tests
- Maintainable and readable
- Comprehensive coverage (success paths, edge cases, errors)

### Testing Pyramid

| Level | % | Purpose | Tools |
|-------|---|---------|-------|
| **Unit** | 70% | Functions, components, business logic | Vitest |
| **Integration** | 20% | API endpoints, cross-component | Vitest |
| **End-to-End** | 10% | Complete user workflows | Playwright |

### Writing Good Tests

#### Structure: Arrange-Act-Assert

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

#### Naming

Describe expected behavior:

```typescript
// Good
it('returns empty array when no items match filter', () => {});
it('throws ValidationError when email is invalid', () => {});

// Bad
it('test1', () => {});
```

#### Independence

- Set up own state
- No dependencies on other tests
- Clean up after itself
- Runnable in isolation

### Frontend Testing

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

#### Accessibility Testing

- Keyboard navigation
- Screen reader access
- Color contrast
- Focus management

### Database Testing

- Validate business rules
- Test access control boundaries
- Verify data validation
- Check error handling
- Monitor query performance
- Verify index effectiveness

### Coverage Requirements

Library packages: 80% minimum for statements, branches, functions, lines

Enforced at:

- Local development (`pnpm test`)
- Release script (`ship-staging`)
- CI/CD (GitHub Actions)

### Quality Gates

Before npm publishing:

1. Build succeeds
2. Type check passes
3. Coverage meets thresholds

### Continuous Integration

- Pre-commit hooks run linting (Biome)
- CI pipeline runs build, typecheck, coverage
- Release workflow blocks publishing on failures

### Test Maintenance

- Delete tests that no longer provide value
- Update tests when requirements change
- Refactor tests alongside production code
- Keep test code clean

## Essence

This approach gives testing a practical shape that supports both confidence and change.

- Teams can choose the right test for the risk they are addressing
- Fast feedback stays central to daily development
- Coverage remains useful because it is tied to meaningful behavior

Related documents:

- [Vitest](./toolchain/vitest.md) — Unit and integration testing for TypeScript projects
- [Playwright](./toolchain/playwright.md) — End-to-end testing for web applications
- [React and TypeScript Standards](./react.md) — TypeScript and React development patterns

### Resources

- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
