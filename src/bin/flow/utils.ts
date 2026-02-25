/**
 * Shared utilities for flow-release, flow-ship, and flow-hotfix.
 *
 * Git commands use execFileSync (not a shell string) so user-provided
 * strings such as commit messages are never interpolated by the shell.
 * pnpm script invocations use execSync via shell since script names are
 * developer-controlled and pnpm itself is resolved through PATH.
 */
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * Run a git command with the given arguments.
 * Output is inherited (visible to the user).
 */
export const git = (...args: string[]): void => {
  console.log(`$ git ${args.join(' ')}`);
  execFileSync('git', args, { stdio: 'inherit' });
};

/**
 * Run a git command and return trimmed stdout.
 * Stderr is suppressed; throws on non-zero exit.
 */
export const gitRead = (...args: string[]): string =>
  execFileSync('git', args, { encoding: 'utf-8' }).trim();

/**
 * Run a pnpm script via the shell.
 * Only pass developer-controlled script names — never user input.
 */
export const runScript = (script: string): void => {
  console.log(`$ pnpm ${script}`);
  execSync(`pnpm ${script}`, { stdio: 'inherit' });
};

/**
 * Bump a semver string by the given increment type.
 */
export const bumpVersion = (current: string, bump: string): string => {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid semver: ${current}`);
  }
  const [major, minor, patch] = parts as [number, number, number];
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

/**
 * Insert a new changelog entry after the title line of CHANGELOG.md.
 * Creates the file if it does not exist.
 */
export const insertChangelog = (changelogPath: string, entry: string): void => {
  if (existsSync(changelogPath)) {
    const existing = readFileSync(changelogPath, 'utf-8');
    const insertAt = existing.indexOf('\n## ');
    if (insertAt === -1) {
      writeFileSync(changelogPath, `${existing.trimEnd()}\n\n${entry}`);
    } else {
      writeFileSync(
        changelogPath,
        `${existing.slice(0, insertAt)}\n\n${entry}${existing.slice(insertAt + 1)}`,
      );
    }
  } else {
    writeFileSync(changelogPath, `# Changelog\n\n${entry}`);
  }
};

/**
 * Run quality checks. Throws if any step fails.
 */
export const runQualityChecks = (): void => {
  runScript('build');
  runScript('typecheck');
  runScript('report');
};

/**
 * Check whether a branch exists locally or on origin.
 * Requires a prior `git fetch` to have up-to-date remote refs.
 */
export const branchExists = (name: string): boolean =>
  gitRead('branch', '--list', name) !== ''
  || gitRead('branch', '--list', '--remotes', `origin/${name}`) !== '';
