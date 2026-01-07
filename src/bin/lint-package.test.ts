import { describe, expect, it } from 'vitest';

/**
 * Reorder exports conditions: types must come before default for TypeScript.
 * Extracted from lint-package.ts for testing.
 */
function reorderConditions(obj: Record<string, unknown>): Record<string, unknown> {
  function processObject(o: Record<string, unknown>): Record<string, unknown> {
    if (typeof o !== 'object' || o === null) return o;

    // First, recursively process all nested objects
    const processed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(o)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processed[key] = processObject(value as Record<string, unknown>);
      } else {
        processed[key] = value;
      }
    }

    // Then check if this object has both 'types' and 'default' keys
    if ('types' in processed && 'default' in processed) {
      const keys = Object.keys(processed);
      const typesIndex = keys.indexOf('types');
      const defaultIndex = keys.indexOf('default');

      // If default comes before types, reorder
      if (defaultIndex < typesIndex) {
        const reordered: Record<string, unknown> = {};
        reordered.types = processed.types;
        for (const key of keys) {
          if (key !== 'types') {
            reordered[key] = processed[key];
          }
        }
        return reordered;
      }
    }

    return processed;
  }

  return processObject(obj);
}

describe('lint-package', () => {
  describe('reorderConditions', () => {
    it('should reorder types before default when default comes first', () => {
      const input = {
        './foo': {
          default: './dist/foo.js',
          types: './dist/foo.d.ts',
        },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./foo'] as Record<string, unknown>)).toEqual(['types', 'default']);
    });

    it('should not modify when types already comes before default', () => {
      const input = {
        './foo': {
          default: './dist/foo.js',
          types: './dist/foo.d.ts',
        },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./foo'] as Record<string, unknown>)).toEqual(['types', 'default']);
    });

    it('should handle multiple exports with mixed order', () => {
      const input = {
        './a': {
          default: './dist/a.js',
          types: './dist/a.d.ts',
        },
        './b': {
          default: './dist/b.js',
          types: './dist/b.d.ts',
        },
      };

      const result = reorderConditions(input);

      expect(Object.keys(result['./a'] as Record<string, unknown>)[0]).toBe('types');
      expect(Object.keys(result['./b'] as Record<string, unknown>)[0]).toBe('types');
    });

    it('should preserve other keys after types', () => {
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

    it('should handle exports without types or default', () => {
      const input = {
        './styles.css': './dist/styles.css',
      };

      const result = reorderConditions(input);

      expect(result).toEqual(input);
    });

    it('should handle deeply nested condition objects', () => {
      const input = {
        './foo': {
          browser: {
            default: './dist/foo.browser.js',
            types: './dist/foo.browser.d.ts',
          },
          node: {
            default: './dist/foo.node.js',
            types: './dist/foo.node.d.ts',
          },
        },
      };

      const result = reorderConditions(input);
      const foo = result['./foo'] as Record<string, Record<string, unknown>>;

      expect(Object.keys(foo.node as object)[0]).toBe('types');
      expect(Object.keys(foo.browser as object)[0]).toBe('types');
    });
  });
});
