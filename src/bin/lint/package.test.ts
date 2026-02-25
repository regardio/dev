import { describe, expect, it } from 'vitest';

import { reorderConditions } from './package.js';

describe('lint-package', () => {
  describe('reorderConditions', () => {
    it('reorders types before default when default comes first', () => {
      const input = {
        './foo': {
          default: './dist/foo.js',
          types: './dist/foo.d.ts',
        },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./foo'] as Record<string, unknown>)).toEqual(['types', 'default']);
    });

    it('does not modify when types already comes before default', () => {
      const input = {
        './foo': {
          default: './dist/foo.js',
          types: './dist/foo.d.ts',
        },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./foo'] as Record<string, unknown>)).toEqual(['types', 'default']);
    });

    it('handles multiple exports with mixed order', () => {
      const input = {
        './a': { default: './dist/a.js', types: './dist/a.d.ts' },
        './b': { default: './dist/b.js', types: './dist/b.d.ts' },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./a'] as Record<string, unknown>)[0]).toBe('types');
      expect(Object.keys(result['./b'] as Record<string, unknown>)[0]).toBe('types');
    });

    it('preserves other keys after types', () => {
      const input = {
        './foo': {
          default: './dist/foo.js',
          import: './dist/foo.mjs',
          require: './dist/foo.cjs',
          types: './dist/foo.d.ts',
        },
      };

      const result = reorderConditions(input);
      const keys = Object.keys(result['./foo'] as Record<string, unknown>);

      expect(keys[0]).toBe('types');
      expect(keys.slice(1)).toEqual(['default', 'import', 'require']);
    });

    it('handles exports without types or default', () => {
      const input = { './styles.css': './dist/styles.css' };

      expect(reorderConditions(input)).toEqual(input);
    });

    it('handles deeply nested condition objects', () => {
      const input = {
        './foo': {
          browser: { default: './dist/foo.browser.js', types: './dist/foo.browser.d.ts' },
          node: { default: './dist/foo.node.js', types: './dist/foo.node.d.ts' },
        },
      };

      const result = reorderConditions(input);
      const foo = result['./foo'] as Record<string, Record<string, unknown>>;

      expect(Object.keys(foo.node as object)[0]).toBe('types');
      expect(Object.keys(foo.browser as object)[0]).toBe('types');
    });
  });
});
