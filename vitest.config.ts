import type { UserConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import { coverageThresholds } from './src/vitest/node';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['src/bin/**'],
      provider: 'v8',
      thresholds: coverageThresholds,
    },
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
}) satisfies UserConfig as UserConfig;
