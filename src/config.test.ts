import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcDir = path.dirname(fileURLToPath(import.meta.url));

function readJson(filePath: string) {
  // biome-ignore lint/suspicious/noExplicitAny: Test file needs flexible typing for nested config access
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as any;
}

describe('Config Structure Validation', () => {
  describe('biome/preset.json', () => {
    const configPath = path.join(srcDir, 'biome/preset.json');
    const config = readJson(configPath);

    it('has $schema defined', () => {
      expect(config.$schema).toContain('biomejs.dev');
    });

    it('has linter enabled', () => {
      expect(config.linter?.enabled).toBe(true);
    });

    it('has formatter enabled', () => {
      expect(config.formatter?.enabled).toBe(true);
    });

    it('has recommended rules enabled', () => {
      expect(config.linter?.rules?.recommended).toBe(true);
    });

    it('disallows explicit any', () => {
      expect(config.linter?.rules?.suspicious?.noExplicitAny).toBe('error');
    });
  });

  describe('typescript/base.json', () => {
    const configPath = path.join(srcDir, 'typescript/base.json');
    const config = readJson(configPath);

    it('has $schema defined', () => {
      expect(config.$schema).toContain('schemastore.org');
    });

    it('has strict mode enabled', () => {
      expect(config.compilerOptions?.strict).toBe(true);
    });

    it('has noUncheckedIndexedAccess enabled', () => {
      expect(config.compilerOptions?.noUncheckedIndexedAccess).toBe(true);
    });

    it('has strictNullChecks enabled', () => {
      expect(config.compilerOptions?.strictNullChecks).toBe(true);
    });

    it('has noImplicitAny enabled', () => {
      expect(config.compilerOptions?.noImplicitAny).toBe(true);
    });

    it('targets ES2022', () => {
      expect(config.compilerOptions?.target).toBe('ES2022');
    });

    it('uses ESNext module', () => {
      expect(config.compilerOptions?.module).toBe('ESNext');
    });
  });

  describe('typescript/react.json', () => {
    const configPath = path.join(srcDir, 'typescript/react.json');
    const config = readJson(configPath);

    it('extends base.json', () => {
      expect(config.extends).toContain('./base.json');
    });

    it('has jsx set to react-jsx', () => {
      expect(config.compilerOptions?.jsx).toBe('react-jsx');
    });
  });

  describe('markdownlint/markdownlint.json', () => {
    const configPath = path.join(srcDir, 'markdownlint/markdownlint.json');
    const config = readJson(configPath);

    it('is a valid JSON object', () => {
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    it('has MD013 (line-length) rule configured', () => {
      expect(config.MD013).toBeDefined();
    });
  });

  describe('commitlint/commitlint.cjs', () => {
    const configPath = path.join(srcDir, 'commitlint/commitlint.cjs');

    it('file exists', () => {
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('exports extends with conventional config', () => {
      const content = fs.readFileSync(configPath, 'utf8');
      expect(content).toContain('@commitlint/config-conventional');
    });
  });
});

describe('Vitest Configs', () => {
  describe('vitest/node', () => {
    it('exports vitestNodeConfig', async () => {
      const { vitestNodeConfig } = await import('./vitest/node.js');
      expect(vitestNodeConfig).toBeDefined();
      expect(vitestNodeConfig.environment).toBe('node');
    });
  });

  describe('vitest/react', () => {
    it('exports vitestReactConfig', async () => {
      const { vitestReactConfig } = await import('./vitest/react.js');
      expect(vitestReactConfig).toBeDefined();
      expect(vitestReactConfig.environment).toBe('jsdom');
    });
  });
});
