#!/usr/bin/env node
/**
 * flow-changeset: Run @changesets/cli commands.
 * Usage: flow-changeset [changeset args...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const pkgPath = require.resolve('@changesets/cli/package.json');
const pkg = require(pkgPath);
let binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.changeset;
if (!binRel) {
  console.error('Unable to locate changeset binary from package.json bin field');
  process.exit(1);
}
if (binRel.startsWith('./')) binRel = binRel.slice(2);
const bin = path.join(path.dirname(pkgPath), binRel);

const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
