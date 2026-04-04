---

title: Playwright
type: guide
status: published
summary: End-to-end testing for web applications
related: [vitest]
locale: en-US
---

# Playwright

End-to-end testing for web applications.

## Impulse

Some risks only appear when a full application runs as a user would encounter it.

- Unit and integration tests do not cover complete user journeys
- Browser behavior can differ in ways lower-level tests never surface
- Teams need a stable way to verify critical flows before release

## Signal

End-to-end testing matters most where user-visible behavior crosses multiple layers.

- Browser automation can reveal integration failures and regressions
- Accessible selectors make tests more resilient and closer to actual use
- Shared configuration keeps E2E testing consistent across projects

## Effect

There are several ways to approach browser-level testing.

- Manual QA can catch issues, but it is hard to repeat reliably
- Ad hoc browser scripts can work for narrow cases, but they drift quickly
- A shared Playwright baseline gives repeatable coverage for critical user workflows

## Accord

We use Playwright as the default end-to-end testing tool for web applications in Regardio.

- Prefer user-centered, accessible selectors
- Keep configuration centralized where possible
- Use E2E tests for meaningful workflows, not as a substitute for all other tests

## Action

Use the configuration, scripts, and testing patterns below when adding end-to-end coverage.

### Why Playwright?

- **Cross-browser** - Chromium, Firefox, WebKit
- **Auto-wait** - No flaky timeouts
- **Powerful selectors** - Role-based, text-based, CSS
- **Trace viewer** - Debug failures with screenshots and DOM snapshots

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { buildPlaywrightBaseConfig } from '@regardio/dev/playwright';

export default defineConfig(
  buildPlaywrightBaseConfig({
    appPort: 5100,
    appUrl: 'http://localhost:5100',
    devices,
    webServerCommand: 'vite preview',
  }),
);
```

### Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

### Running Tests

```bash
pnpm test:e2e                    # Run all E2E tests
pnpm playwright test --ui        # Interactive UI mode
pnpm playwright test --debug     # Debug mode with inspector
pnpm playwright show-report      # View HTML report
```

### Writing Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can submit contact form', async ({ page }) => {
  await page.goto('/contact');

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Message').fill('Hello!');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Message sent')).toBeVisible();
});
```

### Best Practices

#### Use Role-Based Selectors

```typescript
// Preferred - accessible and resilient
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email');

// Avoid - brittle
await page.locator('.submit-btn');
await page.locator('#email-input');
```

#### Add data-test Attributes

For elements without accessible names:

```tsx
<div data-test="user-avatar">{avatar}</div>
```

```typescript
await page.getByTestId('user-avatar');
```

#### Page Object Pattern

For complex pages, use page objects:

```typescript
class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}
```

## Essence

This guide gives browser-level testing a clear role in the overall testing strategy.

- Critical user journeys can be checked in a repeatable way
- Cross-browser behavior stays visible during development and release work
- E2E coverage remains focused on behavior that lower-level tests cannot fully guarantee

Related documents:

- [Testing Approach](../conventions/testing.md) — Testing philosophy and patterns for Regardio projects
- [Vitest](./vitest.md) — Unit and integration testing for TypeScript projects

### Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
