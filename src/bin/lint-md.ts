#!/usr/bin/env node
/**
 * lint-md: Run markdownlint-cli2 to lint and fix Markdown files.
 * Usage: lint-md [markdownlint-cli2 args...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
// Resolve to any exported file to find the package directory
const packageDir = dirname(require.resolve('markdownlint-cli2'));
const bin = join(packageDir, 'markdownlint-cli2-bin.mjs');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
