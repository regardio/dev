import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { resolveTsxBin } from './ts.js';

function makeRequire(pkgPath: string, pkg: unknown): NodeRequire {
  const req = (id: string): unknown => (id === pkgPath ? pkg : undefined);
  req.resolve = (_id: string) => pkgPath;
  return req as unknown as NodeRequire;
}

describe('resolveTsxBin', () => {
  it('resolves when bin is a string', () => {
    const pkgPath = '/node_modules/tsx/package.json';
    const req = makeRequire(pkgPath, { bin: './dist/cli.mjs' });

    const result = resolveTsxBin(req);

    expect(result).toBe(path.join('/node_modules/tsx', 'dist/cli.mjs'));
  });

  it('resolves when bin is an object with a tsx key', () => {
    const pkgPath = '/node_modules/tsx/package.json';
    const req = makeRequire(pkgPath, { bin: { tsx: './dist/cli.mjs' } });

    const result = resolveTsxBin(req);

    expect(result).toBe(path.join('/node_modules/tsx', 'dist/cli.mjs'));
  });

  it('returns null when bin field is missing', () => {
    const pkgPath = '/node_modules/tsx/package.json';
    const req = makeRequire(pkgPath, {});

    expect(resolveTsxBin(req)).toBeNull();
  });

  it('returns null when bin object has no tsx key', () => {
    const pkgPath = '/node_modules/tsx/package.json';
    const req = makeRequire(pkgPath, { bin: { other: './dist/other.js' } });

    expect(resolveTsxBin(req)).toBeNull();
  });

  it('resolves against the real tsx package', () => {
    const req = createRequire(import.meta.url);

    const result = resolveTsxBin(req);

    expect(result).not.toBeNull();
    expect(path.isAbsolute(result ?? '')).toBe(true);
  });
});
