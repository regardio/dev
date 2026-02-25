#!/usr/bin/env node
/**
 * exec-s: Run npm scripts sequentially via npm-run-all's run-s.
 * Usage: exec-s <script-patterns>
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bin = require.resolve('npm-run-all/bin/run-s/index.js');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
