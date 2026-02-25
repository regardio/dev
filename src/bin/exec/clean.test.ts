import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { resolveRimrafBin } from './clean.js';

function makeRequire(pkgPath: string, pkg: unknown): NodeRequire {
  const req = (id: string): unknown => (id === pkgPath ? pkg : undefined);
  req.resolve = (_id: string) => pkgPath;
  return req as unknown as NodeRequire;
}

describe('resolveRimrafBin', () => {
  it('resolves when bin is a plain string', () => {
    const pkgPath = '/node_modules/rimraf/package.json';
    const req = makeRequire(pkgPath, { bin: './dist/esm/bin.js' });

    const result = resolveRimrafBin(req);

    expect(result).toBe(path.join('/node_modules/rimraf', 'dist/esm/bin.js'));
  });

  it('strips leading ./ from the bin path', () => {
    const pkgPath = '/node_modules/rimraf/package.json';
    const req = makeRequire(pkgPath, { bin: './bin/rimraf' });

    const result = resolveRimrafBin(req);

    expect(result).toBe(path.join('/node_modules/rimraf', 'bin/rimraf'));
  });

  it('resolves when bin is an object with a rimraf key', () => {
    const pkgPath = '/node_modules/rimraf/package.json';
    const req = makeRequire(pkgPath, { bin: { rimraf: './dist/esm/bin.js' } });

    const result = resolveRimrafBin(req);

    expect(result).toBe(path.join('/node_modules/rimraf', 'dist/esm/bin.js'));
  });

  it('returns null when bin field is missing', () => {
    const pkgPath = '/node_modules/rimraf/package.json';
    const req = makeRequire(pkgPath, {});

    expect(resolveRimrafBin(req)).toBeNull();
  });

  it('returns null when bin object has no rimraf key', () => {
    const pkgPath = '/node_modules/rimraf/package.json';
    const req = makeRequire(pkgPath, { bin: { other: './dist/other.js' } });

    expect(resolveRimrafBin(req)).toBeNull();
  });

  it('resolves against the real rimraf package', () => {
    const req = createRequire(import.meta.url);

    const result = resolveRimrafBin(req);

    expect(result).not.toBeNull();
    expect(path.isAbsolute(result ?? '')).toBe(true);
  });
});
