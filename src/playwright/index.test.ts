import { devices } from '@playwright/test';
import { describe, expect, it } from 'vitest';
import type { BuildPlaywrightBaseConfigParams } from './index.js';
import { buildPlaywrightBaseConfig } from './index.js';

describe('buildPlaywrightBaseConfig', () => {
  const validParams: BuildPlaywrightBaseConfigParams = {
    appPort: 3000,
    appUrl: 'http://localhost:3000',
    devices,
    webServerCommand: 'pnpm dev',
  };

  describe('validation', () => {
    it('throws if appUrl is missing', () => {
      expect(() => buildPlaywrightBaseConfig({ ...validParams, appUrl: '' })).toThrow(
        '[playwright] appUrl must be a non-empty string',
      );
    });

    it('throws if appPort is not a number', () => {
      expect(() =>
        buildPlaywrightBaseConfig({ ...validParams, appPort: '3000' as unknown as number }),
      ).toThrow('[playwright] appPort must be a number');
    });

    it('throws if devices is missing', () => {
      expect(() =>
        buildPlaywrightBaseConfig({
          ...validParams,
          devices: undefined as unknown as typeof devices,
        }),
      ).toThrow('[playwright] devices must be provided');
    });
  });

  describe('config output', () => {
    it('returns valid Playwright config structure', () => {
      const config = buildPlaywrightBaseConfig(validParams);

      expect(config).toHaveProperty('projects');
      expect(config).toHaveProperty('testDir', './tests');
      expect(config).toHaveProperty('testMatch', '**/*.e2e.ts');
      expect(config).toHaveProperty('webServer');
      expect(config).toHaveProperty('use.baseURL', 'http://localhost:3000');
    });

    it('configures 6 browser projects', () => {
      const config = buildPlaywrightBaseConfig(validParams);
      expect(config.projects).toHaveLength(6);
    });

    it('sets retries to 0 when not in CI', () => {
      const config = buildPlaywrightBaseConfig({ ...validParams, ci: false });
      expect(config.retries).toBe(0);
    });

    it('sets retries to 2 in CI', () => {
      const config = buildPlaywrightBaseConfig({ ...validParams, ci: true });
      expect(config.retries).toBe(2);
    });

    it('sets workers to 1 in CI', () => {
      const config = buildPlaywrightBaseConfig({ ...validParams, ci: true });
      expect(config.workers).toBe(1);
    });

    it('sets forbidOnly to true in CI', () => {
      const config = buildPlaywrightBaseConfig({ ...validParams, ci: true });
      expect(config.forbidOnly).toBe(true);
    });
  });
});
