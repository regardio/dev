#!/usr/bin/env node
/**
 * Sorts package.json files using sort-package-json and fixes
 * exports condition order (types must come before default for TypeScript).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Recursively reorder exports condition objects so that `types` always
 * appears before `default`. Returns a new object; does not mutate input.
 */
export function reorderConditions(obj: Record<string, unknown>): Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) return obj;

  const processed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    processed[key] =
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? reorderConditions(value as Record<string, unknown>)
        : value;
  }

  if ('types' in processed && 'default' in processed) {
    const keys = Object.keys(processed);
    if (keys.indexOf('default') < keys.indexOf('types')) {
      const reordered: Record<string, unknown> = { types: processed.types };
      for (const key of keys) {
        if (key !== 'types') reordered[key] = processed[key];
      }
      return reordered;
    }
  }

  return processed;
}

/**
 * Fix exports condition order in a package.json file.
 * Returns true if the file needs changes (or was changed when fix=true).
 */
export function fixExportsOrder(filePath: string, fix: boolean): boolean {
  const fullPath = resolve(process.cwd(), filePath);
  if (!existsSync(fullPath)) return false;

  const content = readFileSync(fullPath, 'utf-8');
  const pkg = JSON.parse(content) as Record<string, unknown>;

  if (!pkg.exports || typeof pkg.exports !== 'object') return false;

  const fixed = reorderConditions(pkg.exports as Record<string, unknown>);
  const changed = JSON.stringify(fixed) !== JSON.stringify(pkg.exports);

  if (changed && fix) {
    writeFileSync(fullPath, `${JSON.stringify({ ...pkg, exports: fixed }, null, 2)}\n`);
  }

  return changed;
}

// ---------------------------------------------------------------------------
// CLI entry point — only runs when executed directly
// ---------------------------------------------------------------------------
if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? '')) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const devRoot = resolve(__dirname, '../../..');

  const sortPkgBin = join(devRoot, 'node_modules/.bin/sort-package-json');
  const sortPkgBinAlt = join(devRoot, 'node_modules/sort-package-json/cli.js');

  let bin = '';
  if (existsSync(sortPkgBin)) {
    bin = sortPkgBin;
  } else if (existsSync(sortPkgBinAlt)) {
    bin = `node ${sortPkgBinAlt}`;
  } else {
    bin = 'npx sort-package-json';
  }

  const args = process.argv.slice(2);
  const fixMode = args.includes('--fix');
  const files = args.filter((arg) => arg !== '--fix');
  const targets = files.length > 0 ? files : ['package.json'];

  try {
    const checkFlag = fixMode ? '' : '--check';
    execSync(`${bin} ${checkFlag} ${targets.join(' ')}`.trim(), { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }

  let hasExportsIssues = false;
  for (const file of targets) {
    const needsFix = fixExportsOrder(file, fixMode);
    if (needsFix && !fixMode) {
      console.error(
        `${file}: exports condition order is incorrect (types must come before default)`,
      );
      hasExportsIssues = true;
    }
  }

  if (hasExportsIssues) {
    process.exit(1);
  }
}
