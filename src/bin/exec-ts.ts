#!/usr/bin/env node
/**
 * exec-ts: Run a local TypeScript file via tsx with TS support.
 * Usage: exec-ts path/to/script.ts [args...]
 */
import { type SpawnOptions, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: exec-ts <script.ts> [args...]');
  process.exit(1);
}

const [scriptArg, ...rest] = args;
const script = scriptArg ?? '';

// Delegate to tsx to run a local TypeScript file with full TypeScript support
const require = createRequire(import.meta.url);
const pkgPath = require.resolve('tsx/package.json');
const pkg = require(pkgPath);
const binRel = pkg.bin;
const binPath: string | undefined =
  typeof binRel === 'string'
    ? binRel
    : typeof binRel === 'object' && binRel !== null && 'tsx' in binRel
      ? (binRel as Record<string, string>).tsx
      : undefined;

if (!binPath) {
  console.error('Unable to locate tsx binary from package.json bin field');
  process.exit(1);
}
// Build an absolute path to the bin file relative to the resolved package root
const bin = path.join(path.dirname(pkgPath), binPath);
const spawnOptions: SpawnOptions = { stdio: 'inherit' };
const child = spawn(process.execPath, [bin, script, ...rest], spawnOptions);
child.on('exit', (code: number | null) => process.exit(code ?? 0));
