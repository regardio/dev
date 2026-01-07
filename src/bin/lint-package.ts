#!/usr/bin/env node
/**
 * Sorts package.json files using sort-package-json and fixes
 * exports condition order (types must come before default for TypeScript).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const devRoot = resolve(__dirname, '../..');

// Find sort-package-json binary
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

// Get args passed to this script
const args = process.argv.slice(2);
const files = args.length > 0 ? args : ['package.json'];

// Run sort-package-json
try {
  execSync(`${bin} ${files.join(' ')}`, { stdio: 'inherit' });
} catch {
  process.exit(1);
}

/**
 * Fix exports condition order: types must come before default for TypeScript.
 * See: https://www.typescriptlang.org/docs/handbook/esm-node.html
 */
function fixExportsOrder(filePath: string): void {
  const fullPath = resolve(process.cwd(), filePath);
  if (!existsSync(fullPath)) return;

  const content = readFileSync(fullPath, 'utf-8');
  const pkg = JSON.parse(content) as Record<string, unknown>;

  if (!pkg.exports || typeof pkg.exports !== 'object') return;

  let modified = false;

  function reorderConditions(obj: Record<string, unknown>): Record<string, unknown> {
    if (typeof obj !== 'object' || obj === null) return obj;

    // Check if this object has both 'types' and 'default' keys
    if ('types' in obj && 'default' in obj) {
      const keys = Object.keys(obj);
      const typesIndex = keys.indexOf('types');
      const defaultIndex = keys.indexOf('default');

      // If default comes before types, reorder
      if (defaultIndex < typesIndex) {
        modified = true;
        const reordered: Record<string, unknown> = {};
        // Put types first, then all other keys in original order
        reordered.types = obj.types;
        for (const key of keys) {
          if (key !== 'types') {
            reordered[key] = obj[key];
          }
        }
        return reordered;
      }
    }

    // Recursively process nested objects
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = reorderConditions(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  pkg.exports = reorderConditions(pkg.exports as Record<string, unknown>);

  if (modified) {
    writeFileSync(fullPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}

// Fix exports order in each file
for (const file of files) {
  fixExportsOrder(file);
}
