import { coverageThresholds } from './node';

/**
 * Vitest configuration for React packages with jsdom environment.
 * Use with defineConfig() in your vitest.config.ts
 *
 * Requires a setup file that imports '@testing-library/jest-dom/vitest'
 */
export const vitestReactConfig = {
  coverage: {
    provider: 'v8',
    thresholds: coverageThresholds,
  },
  environment: 'jsdom',
  exclude: ['node_modules', 'dist', 'build', '.turbo', '.react-router'],
  globals: true,
  include: ['**/*.test.ts', '**/*.test.tsx'],
  setupFiles: ['./src/test-setup.ts'],
};
