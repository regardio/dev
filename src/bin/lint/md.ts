#!/usr/bin/env node
/**
 * lint-md: Run markdownlint-cli2 to lint and fix Markdown files.
 * Usage: lint-md [--fix] [globs...]
 *
 * Default globs (if none provided): "**\/*.md" "**\/*.mdx"
 * Default exclusions (always added): "!**\/dist/**" "!**\/node_modules/**"
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const packageDir = dirname(require.resolve('markdownlint-cli2'));
const bin = join(packageDir, 'markdownlint-cli2-bin.mjs');

const DEFAULT_GLOBS = ['**/*.md', '**/*.mdx'];
const DEFAULT_EXCLUSIONS = ['!**/dist/**', '!**/node_modules/**'];

const rawArgs = process.argv.slice(2);
const fixFlag = rawArgs.includes('--fix');
const userGlobs = rawArgs.filter((arg) => arg !== '--fix');

const globs = userGlobs.length > 0 ? userGlobs : DEFAULT_GLOBS;
const args = [...(fixFlag ? ['--fix'] : []), ...globs, ...DEFAULT_EXCLUSIONS];

const child = spawn(process.execPath, [bin, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
