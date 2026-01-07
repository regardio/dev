import { describe, expect, it } from 'vitest';

/**
 * Parse command line arguments for post-build-exports.
 * Extracted from post-build-exports.ts for testing.
 */
function parseArgs(args: string[]): {
  dist: string;
  preserve: string[];
  prefix: string;
  strip: string;
} {
  const result = {
    dist: 'dist',
    prefix: './',
    preserve: [] as string[],
    strip: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (arg === '--dist' && next) {
      result.dist = next;
      i++;
    } else if (arg === '--preserve' && next) {
      result.preserve = next.split(',').map((p) => p.trim());
      i++;
    } else if (arg === '--prefix' && next) {
      result.prefix = next;
      i++;
    } else if (arg === '--strip' && next) {
      result.strip = next;
      i++;
    }
  }

  return result;
}

/**
 * Generate export name from JS file path.
 * Extracted from post-build-exports.ts for testing.
 */
function generateExportName(jsPath: string, strip: string): string {
  let exportPath = jsPath.replace(/\.js$/, '');

  if (strip && exportPath.startsWith(strip)) {
    exportPath = exportPath.slice(strip.length);
    if (exportPath.startsWith('/')) {
      exportPath = exportPath.slice(1);
    }
  }

  // Strip /index suffix for cleaner exports
  if (exportPath.endsWith('/index')) {
    exportPath = exportPath.slice(0, -6);
  }

  return `./${exportPath}`;
}

describe('post-build-exports', () => {
  describe('parseArgs', () => {
    it('should return defaults when no args provided', () => {
      const result = parseArgs([]);

      expect(result).toEqual({
        dist: 'dist',
        prefix: './',
        preserve: [],
        strip: '',
      });
    });

    it('should parse --dist option', () => {
      const result = parseArgs(['--dist', 'build']);

      expect(result.dist).toBe('build');
    });

    it('should parse --preserve option with single value', () => {
      const result = parseArgs(['--preserve', './tailwind.css']);

      expect(result.preserve).toEqual(['./tailwind.css']);
    });

    it('should parse --preserve option with multiple comma-separated values', () => {
      const result = parseArgs(['--preserve', './a.css, ./b.css, ./c.css']);

      expect(result.preserve).toEqual(['./a.css', './b.css', './c.css']);
    });

    it('should parse --prefix option', () => {
      const result = parseArgs(['--prefix', './lib/']);

      expect(result.prefix).toBe('./lib/');
    });

    it('should parse --strip option', () => {
      const result = parseArgs(['--strip', 'generated']);

      expect(result.strip).toBe('generated');
    });

    it('should parse multiple options together', () => {
      const result = parseArgs([
        '--dist',
        'output',
        '--preserve',
        './styles.css',
        '--strip',
        'src',
      ]);

      expect(result).toEqual({
        dist: 'output',
        prefix: './',
        preserve: ['./styles.css'],
        strip: 'src',
      });
    });

    it('should ignore unknown options', () => {
      const result = parseArgs(['--unknown', 'value', '--dist', 'build']);

      expect(result.dist).toBe('build');
    });
  });

  describe('generateExportName', () => {
    it('should convert .js path to export name', () => {
      expect(generateExportName('foo.js', '')).toBe('./foo');
    });

    it('should handle nested paths', () => {
      expect(generateExportName('utils/helpers.js', '')).toBe('./utils/helpers');
    });

    it('should strip /index suffix', () => {
      expect(generateExportName('components/button/index.js', '')).toBe('./components/button');
    });

    it('should apply strip prefix', () => {
      expect(generateExportName('generated/icons/arrow.js', 'generated')).toBe('./icons/arrow');
    });

    it('should handle strip with leading slash', () => {
      expect(generateExportName('generated/icons/arrow.js', 'generated/')).toBe('./icons/arrow');
    });

    it('should handle index.js at root', () => {
      expect(generateExportName('index.js', '')).toBe('./index');
    });

    it('should handle deeply nested index files', () => {
      expect(generateExportName('a/b/c/index.js', '')).toBe('./a/b/c');
    });
  });
});
