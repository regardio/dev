#!/usr/bin/env node
/**
 * exec-ts: Run a local TypeScript file via tsx with TS support.
 * Usage: exec-ts path/to/script.ts [args...]
 */
import { type SpawnOptions, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolve the absolute path to the tsx binary from its package.json bin field.
 * Returns the resolved path, or null if it cannot be determined.
 */
export function resolveTsxBin(require: NodeRequire): string | null {
  const pkgPath = require.resolve('tsx/package.json');
  const pkg = require(pkgPath) as { bin?: unknown };
  const binRel = pkg.bin;
  const binEntry: string | undefined =
    typeof binRel === 'string'
      ? binRel
      : typeof binRel === 'object' && binRel !== null && 'tsx' in binRel
        ? (binRel as Record<string, string>).tsx
        : undefined;
  if (!binEntry) return null;
  return path.join(path.dirname(pkgPath), binEntry);
}

// ---------------------------------------------------------------------------
// CLI entry point — only runs when executed directly
// ---------------------------------------------------------------------------
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? '')) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: exec-ts <script.ts> [args...]');
    process.exit(1);
  }

  const [scriptArg, ...rest] = args;
  const script = scriptArg ?? '';

  const require = createRequire(import.meta.url);
  const bin = resolveTsxBin(require);
  if (!bin) {
    console.error('Unable to locate tsx binary from package.json bin field');
    process.exit(1);
  }

  const spawnOptions: SpawnOptions = { stdio: 'inherit' };
  const child = spawn(process.execPath, [bin, script, ...rest], spawnOptions);
  child.on('exit', (code: number | null) => process.exit(code ?? 0));
}
