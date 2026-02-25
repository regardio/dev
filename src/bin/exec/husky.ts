#!/usr/bin/env node
/**
 * exec-husky: Initializes Husky git hooks (delegates to husky's bin).
 * Usage: exec-husky
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bin = require.resolve('husky');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
