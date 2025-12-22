#!/usr/bin/env node
/**
 * exec-tsc: Run the TypeScript compiler (tsc) via local dependency.
 * Usage: exec-tsc [tsc args...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bin = require.resolve('typescript/bin/tsc');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
