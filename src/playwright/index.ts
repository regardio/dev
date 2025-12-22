import type { PlaywrightTestConfig } from '@playwright/test';

export interface BuildPlaywrightBaseConfigParams {
  appUrl: string;
  appPort: number;
  devices: typeof import('@playwright/test').devices;
  ci?: boolean;
  webServerCommand: string;
}

/**
 * Build a base Playwright config object with Regardio defaults.
 * Consumers should wrap with defineConfig() in their local playwright.config.ts
 */
export function buildPlaywrightBaseConfig({
  appUrl,
  appPort,
  devices,
  ci = !!process.env.CI,
  webServerCommand,
}: BuildPlaywrightBaseConfigParams): PlaywrightTestConfig {
  if (!appUrl || typeof appUrl !== 'string') {
    throw new Error('[playwright] appUrl must be a non-empty string');
  }
  if (!appPort || typeof appPort !== 'number') {
    throw new Error('[playwright] appPort must be a number');
  }
  if (!devices) {
    throw new Error('[playwright] devices must be provided from "@playwright/test"');
  }

  return {
    forbidOnly: ci,
    fullyParallel: true,
    outputDir: './tests/test-results',
    projects: [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      {
        name: 'iPad Pro 11 landscape',
        use: { ...devices['iPad Pro 11 landscape'] },
      },
      { name: 'iPhone 14 portrait', use: { ...devices['iPhone 14'] } },
      { name: 'Pixel 7 portrait', use: { ...devices['Pixel 7'] } },
    ],
    reporter: [['html', { open: 'never', outputFolder: './tests/playwright-report' }]],
    retries: ci ? 2 : 0,
    testDir: './tests',
    testMatch: '**/*.e2e.ts',
    use: {
      baseURL: appUrl,
      trace: 'on-first-retry',
    },
    webServer: {
      command: webServerCommand,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !ci,
      url: appUrl,
    },
    ...(ci ? { workers: 1 } : {}),
  };
}
