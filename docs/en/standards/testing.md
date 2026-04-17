---

title: "Testing"
description: "How Regardio tests its code — layered, behaviour-first, and written as specification."
publishedAt: 2026-04-17
order: 9
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

Tests are the bridge between the prose that describes behaviour and the code that produces it. A test quotes what the docs say the system does and checks that the code holds to it. When the bridge stays honest, refactors are safe because tests describe behaviour rather than shape; when it slips, tests break on every refactor and pass through every regression that preserves the shape they pinned.

## Core principles

- Test what the caller observes, not how the code achieves it
- Fast feedback on the lowest layer that can verify a behaviour
- Deterministic runs; no reliance on time-of-day, order, or shared state
- Readable as specifications in their own right
- Cover the success path, the edges, and the errors

## Layers

| Level | Share | Purpose | Tool |
|-------|-------|---------|------|
| **Unit** | ~70% | Functions, components, small pieces of business logic | Vitest |
| **Integration** | ~20% | Modules together, API contracts, database behaviour | Vitest |
| **End-to-end** | ~10% | Critical user flows across the stack | Playwright |

The distribution follows cost and signal. Unit tests give the fastest feedback and the clearest error; integration tests catch contract mistakes between modules; end-to-end tests protect the flows users actually feel, and are too expensive to carry for everything else.

## Writing tests

### Arrange, Act, Assert

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

### Names describe behaviour

```typescript
// Good
it('returns an empty array when no items match the filter', () => {});
it('throws ValidationError when the email is invalid', () => {});

// Not good
it('test1', () => {});
it('sets isError to true', () => {});
```

### Independence

- Each test sets up its own state
- No dependency on the order other tests ran in
- Cleanup leaves nothing behind

## Frontend testing

Components are tested through the interface a user reaches — roles, labels, visible text, keyboard:

```typescript
it('displays an error when submission fails', async () => {
  render(<ContactForm />);
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByRole('alert')).toHaveTextContent(/failed/i);
});
```

Implementation-detail assertions (`isError` flags, render counts, private method calls) do not appear.

### Accessibility

- Keyboard navigation verified
- Screen-reader access through roles and labels
- Colour contrast checked where it matters
- Focus management correct on interactive flows

## Database testing

Schema tests run against a real Postgres so policies and triggers behave as they do in production:

- Business rules held
- RLS boundaries enforced
- Validation errors return the expected shape
- Queries use the indexes they are meant to
- Error paths are reached and handled

## Coverage

Library packages hold a floor around 80% for statements, branches, functions, and lines. The floor is a minimum, not a target — the goal is meaningful tests, not arithmetic.

Enforced at:

- Local development — `pnpm test`
- Release preparation — `ship-staging`
- CI — GitHub Actions

## Quality gates

Before a package publishes:

1. Build succeeds
2. Type check passes
3. Coverage meets the floor
4. Tests pass — no skipped or failing

## Continuous integration

- Pre-commit hooks run linting (Biome)
- CI runs build, typecheck, and the test suite with coverage
- Release workflow blocks publishing on any failure

## Test maintenance

- Tests that no longer describe current behaviour are updated or deleted
- Tests are refactored alongside the production code they accompany
- A suite with failing or skipped tests is a broken suite

## Related

- [Principles](./principles.md) — Shared principles, including specification-led workflow
- [React](./react.md) — How components are shaped to be testable
- [API](./api.md) — Testing API endpoints and contracts
- [Vitest](../tools/vitest.md) — Unit and integration testing
- [Playwright](../tools/playwright.md) — End-to-end testing

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
