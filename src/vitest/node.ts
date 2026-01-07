import type { TestUserConfig } from 'vitest/node';

/**
 * Coverage thresholds for library packages.
 * These ensure adequate test coverage before publishing.
 */
export const coverageThresholds = {
  branches: 80,
  functions: 80,
  lines: 80,
  statements: 80,
};

/**
 * Base Vitest configuration for Node.js packages.
 * Use with defineConfig() in your vitest.config.ts
 */
export const vitestNodeConfig: TestUserConfig = {
  coverage: {
    provider: 'v8',
    thresholds: coverageThresholds,
  },
  environment: 'node',
  exclude: ['node_modules', 'dist', 'build', '.turbo', '.react-router'],
  globals: true,
  include: ['**/*.test.ts', '**/*.test.tsx'],
};
