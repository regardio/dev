#!/usr/bin/env node
/**
 * lint-biome: Run Biome (formatter/linter) against the codebase.
 * Usage: lint-biome [biome args...]
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const bin = require.resolve('@biomejs/biome/bin/biome');
const args = process.argv.slice(2);
const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
