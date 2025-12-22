#!/usr/bin/env node
/**
 * exec-clean: Thin wrapper around rimraf for cleaning paths.
 * Usage: exec-clean <path> [morePaths...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const pkgPath = require.resolve('rimraf/package.json');
const pkg = require(pkgPath);
let binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.rimraf;
if (!binRel) {
  console.error('Unable to locate rimraf binary from package.json bin field');
  process.exit(1);
}
if (binRel.startsWith('./')) binRel = binRel.slice(2);
// Build an absolute path to the bin file relative to the resolved package root
const bin = path.join(path.dirname(pkgPath), binRel);

const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
