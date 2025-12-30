#!/usr/bin/env node
/**
 * flow-release: Automate the release flow for @regardio/dev.
 *
 * Usage: flow-release <patch|minor|major> [message]
 *
 * This script:
 * 1. Creates a changeset file with the specified bump type
 * 2. Runs `changeset version` to apply the version bump
 * 3. Updates the lockfile (pnpm install --ignore-workspace)
 * 4. Commits all changes
 * 5. Pushes to the current branch
 *
 * The GitHub Action will then publish to npm automatically.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const bumpType = args[0];
const message = args.slice(1).join(' ') || 'Release update';

if (!bumpType || !['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: flow-release <patch|minor|major> [message]');
  console.error('Example: flow-release minor "Add new vitest configs"');
  process.exit(1);
}

const run = (cmd: string) => {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

const runQuiet = (cmd: string): string => {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
};

// Ensure we're in a clean git state
try {
  const status = runQuiet('git status --porcelain');
  if (status) {
    console.log('Working directory has uncommitted changes. Staging all changes...');
  }
} catch {
  console.error('Not in a git repository');
  process.exit(1);
}

// Generate a unique changeset filename
const changesetDir = join(process.cwd(), '.changeset');
const changesetId = `release-${Date.now()}`;
const changesetFile = join(changesetDir, `${changesetId}.md`);

// Create the changeset file
const changesetContent = `---
"@regardio/dev": ${bumpType}
---

${message}
`;

mkdirSync(changesetDir, { recursive: true });
writeFileSync(changesetFile, changesetContent);
console.log(`Created changeset: .changeset/${changesetId}.md`);

// Run changeset version to apply the bump
run('pnpm changeset version');

// Update lockfile to ensure it matches package.json
// Use --ignore-workspace to update this package's lockfile independently
console.log('Updating lockfile...');
run('pnpm install --ignore-workspace');

// Stage all changes
run('git add -A');

// Get the new version
const packageJsonPath = join(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as { version: string };
const { version } = packageJson;

// Commit
run(`git commit -m "chore(release): v${version}"`);

// Push
const branch = runQuiet('git branch --show-current');
run(`git push origin ${branch}`);

console.log(`\n✅ Released v${version}`);
console.log('The GitHub Action will now publish to npm.');
