import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { bumpVersion, confirm, insertChangelog } from './utils.js';

// ---------------------------------------------------------------------------
// bumpVersion
// ---------------------------------------------------------------------------

describe('bumpVersion', () => {
  it('bumps patch', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
  });

  it('bumps minor and resets patch', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('bumps major and resets minor + patch', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('handles zero components', () => {
    expect(bumpVersion('0.0.0', 'patch')).toBe('0.0.1');
    expect(bumpVersion('0.0.0', 'minor')).toBe('0.1.0');
    expect(bumpVersion('0.0.0', 'major')).toBe('1.0.0');
  });

  it('defaults to patch for unknown bump type', () => {
    expect(bumpVersion('1.2.3', 'unknown')).toBe('1.2.4');
  });

  it('throws for invalid semver', () => {
    expect(() => bumpVersion('not-semver', 'patch')).toThrow('Invalid semver');
    expect(() => bumpVersion('1.2', 'patch')).toThrow('Invalid semver');
    expect(() => bumpVersion('1.2.x', 'patch')).toThrow('Invalid semver');
  });
});

// ---------------------------------------------------------------------------
// insertChangelog
// ---------------------------------------------------------------------------

describe('insertChangelog', () => {
  let tmpDir: string;
  let changelogPath: string;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `flow-utils-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tmpDir, { recursive: true });
    changelogPath = join(tmpDir, 'CHANGELOG.md');
  });

  afterEach(() => {
    rmSync(tmpDir, { force: true, recursive: true });
  });

  it('creates a new file when none exists', () => {
    insertChangelog(changelogPath, '## [1.0.0] - 2025-01-01\n\n- initial release\n');

    expect(existsSync(changelogPath)).toBe(true);
    const content = readFileSync(changelogPath, 'utf-8');
    expect(content).toContain('# Changelog');
    expect(content).toContain('## [1.0.0] - 2025-01-01');
  });

  it('inserts before the first existing ## section', () => {
    writeFileSync(changelogPath, '# Changelog\n\n## [1.0.0] - 2025-01-01\n\n- old entry\n');

    insertChangelog(changelogPath, '## [1.1.0] - 2025-02-01\n\n- new entry\n');

    const content = readFileSync(changelogPath, 'utf-8');
    const newIdx = content.indexOf('## [1.1.0]');
    const oldIdx = content.indexOf('## [1.0.0]');
    expect(newIdx).toBeLessThan(oldIdx);
  });

  it('appends when no ## section exists yet', () => {
    writeFileSync(changelogPath, '# Changelog\n');

    insertChangelog(changelogPath, '## [1.0.0] - 2025-01-01\n\n- initial\n');

    const content = readFileSync(changelogPath, 'utf-8');
    expect(content).toContain('## [1.0.0]');
  });

  it('preserves existing entries when inserting', () => {
    writeFileSync(changelogPath, '# Changelog\n\n## [1.0.0] - 2025-01-01\n\n- old entry\n');

    insertChangelog(changelogPath, '## [1.1.0] - 2025-02-01\n\n- new entry\n');

    const content = readFileSync(changelogPath, 'utf-8');
    expect(content).toContain('## [1.0.0]');
    expect(content).toContain('- old entry');
    expect(content).toContain('## [1.1.0]');
    expect(content).toContain('- new entry');
  });

  it('appends when file exists but has no title line', () => {
    writeFileSync(changelogPath, '## [1.0.0] - 2025-01-01\n\n- old entry\n');

    insertChangelog(changelogPath, '## [1.1.0] - 2025-02-01\n\n- new entry\n');

    const content = readFileSync(changelogPath, 'utf-8');
    expect(content).toContain('## [1.0.0]');
    expect(content).toContain('## [1.1.0]');
  });

  it('handles multiple existing entries in the correct order', () => {
    writeFileSync(
      changelogPath,
      '# Changelog\n\n## [1.1.0] - 2025-02-01\n\n- second\n\n## [1.0.0] - 2025-01-01\n\n- first\n',
    );

    insertChangelog(changelogPath, '## [1.2.0] - 2025-03-01\n\n- third\n');

    const content = readFileSync(changelogPath, 'utf-8');
    const idx120 = content.indexOf('## [1.2.0]');
    const idx110 = content.indexOf('## [1.1.0]');
    const idx100 = content.indexOf('## [1.0.0]');
    expect(idx120).toBeLessThan(idx110);
    expect(idx110).toBeLessThan(idx100);
  });
});

// ---------------------------------------------------------------------------
// confirm
// ---------------------------------------------------------------------------

describe('confirm', () => {
  let tmpDir: string;
  let inputFile: string;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `confirm-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tmpDir, { recursive: true });
    inputFile = join(tmpDir, 'input');
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    rmSync(tmpDir, { force: true, recursive: true });
    vi.restoreAllMocks();
  });

  it('returns true for "y"', () => {
    writeFileSync(inputFile, 'y\n');
    expect(confirm('Continue?', inputFile)).toBe(true);
  });

  it('returns true for "Y"', () => {
    writeFileSync(inputFile, 'Y\n');
    expect(confirm('Continue?', inputFile)).toBe(true);
  });

  it('returns false for "n"', () => {
    writeFileSync(inputFile, 'n\n');
    expect(confirm('Continue?', inputFile)).toBe(false);
  });

  it('returns false for empty input', () => {
    writeFileSync(inputFile, '\n');
    expect(confirm('Continue?', inputFile)).toBe(false);
  });

  it('returns false for any other input', () => {
    writeFileSync(inputFile, 'yes\n');
    expect(confirm('Continue?', inputFile)).toBe(false);
  });

  it('writes the prompt to stdout', () => {
    writeFileSync(inputFile, 'y\n');
    confirm('Ship it?', inputFile);
    expect(process.stdout.write).toHaveBeenCalledWith('Ship it? (y/N) ');
  });
});
