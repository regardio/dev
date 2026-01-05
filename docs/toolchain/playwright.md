# Playwright

End-to-end testing for web applications.

## Why Playwright?

- **Cross-browser** - Chromium, Firefox, WebKit
- **Auto-wait** - No flaky timeouts
- **Powerful selectors** - Role-based, text-based, CSS
- **Trace viewer** - Debug failures with screenshots and DOM snapshots

## Configuration

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

## Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

## Running Tests

```bash
pnpm test:e2e                    # Run all E2E tests
pnpm playwright test --ui        # Interactive UI mode
pnpm playwright test --debug     # Debug mode with inspector
pnpm playwright show-report      # View HTML report
```

## Writing Tests

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

## Best Practices

### Use Role-Based Selectors

```typescript
// Preferred - accessible and resilient
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email');

// Avoid - brittle
await page.locator('.submit-btn');
await page.locator('#email-input');
```

### Add data-test Attributes

For elements without accessible names:

```tsx
<div data-test="user-avatar">{avatar}</div>
```

```typescript
await page.getByTestId('user-avatar');
```

### Page Object Pattern

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

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
