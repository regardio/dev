#!/usr/bin/env node
/**
 * lint-commit: Run commitlint against commit messages.
 * Usage: lint-commit [commitlint args...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bin = require.resolve('@commitlint/cli/cli.js');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
