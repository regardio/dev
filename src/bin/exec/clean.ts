#!/usr/bin/env node
/**
 * exec-clean: Thin wrapper around rimraf for cleaning paths.
 * Usage: exec-clean <path> [morePaths...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * Resolve the absolute path to the rimraf binary from its package.json bin field.
 * Returns the resolved path, or null if it cannot be determined.
 */
export function resolveRimrafBin(require: NodeRequire): string | null {
  const pkgPath = require.resolve('rimraf/package.json');
  const pkg = require(pkgPath) as { bin?: unknown };
  const binRel =
    typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin as Record<string, string>)?.rimraf;
  if (!binRel) return null;
  const normalized = binRel.startsWith('./') ? binRel.slice(2) : binRel;
  return path.join(path.dirname(pkgPath), normalized);
}

const require = createRequire(import.meta.url);
const bin = resolveRimrafBin(require);
if (!bin) {
  console.error('Unable to locate rimraf binary from package.json bin field');
  process.exit(1);
}

const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
