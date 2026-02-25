#!/usr/bin/env node
/**
 * flow-ship: Version and promote staging to production following the GitLab workflow.
 *
 * Usage: flow-ship <patch|minor|major>
 *
 * GitLab workflow:
 *   staging → (version bump commit) → production
 *
 * Versioning is intentionally deferred to this step so that version numbers
 * only ever correspond to production-verified code.
 *
 * This script:
 * 1. Ensures the current branch is main and the working tree is clean
 * 2. Verifies staging is ahead of production (there is something to ship)
 * 3. Runs quality checks on the staging branch
 * 4. Bumps the version in package.json
 * 5. Collects change descriptions from git log between production and staging
 * 6. Updates CHANGELOG.md
 * 7. Commits the version bump on staging
 * 8. Merges staging into production (fast-forward) and pushes
 * 9. Merges production back into main to carry the version commit forward
 * 10. Syncs staging with main so the next flow-release can ff-merge cleanly
 * 11. Returns to main
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  branchExists,
  bumpVersion,
  confirm,
  git,
  gitRead,
  insertChangelog,
  runQualityChecks,
  runScript,
} from './utils.js';

const args = process.argv.slice(2);
const bumpType = args[0];

if (!bumpType || !['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: flow-ship <patch|minor|major>');
  console.error('Example: flow-ship minor');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Guard: must be on main
// ---------------------------------------------------------------------------
const currentBranch = gitRead('branch', '--show-current');
if (currentBranch !== 'main') {
  console.error(`Must be on the main branch to ship. Currently on: ${currentBranch}`);
  process.exit(1);
}

// Guard: working tree must be clean
const status = gitRead('status', '--porcelain');
if (status) {
  console.error('Working directory has uncommitted changes. Commit or stash them first.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Fetch and verify both branches exist
// ---------------------------------------------------------------------------
console.log('\nFetching latest state from origin...');
git('fetch', 'origin');

if (!branchExists('staging')) {
  console.error(
    'Branch "staging" does not exist. Create it first:\n'
      + '  git checkout -b staging && git push -u origin staging',
  );
  process.exit(1);
}

if (!branchExists('production')) {
  console.error(
    'Branch "production" does not exist. Create it first:\n'
      + '  git checkout -b production && git push -u origin production',
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Verify staging has commits not yet in production
// ---------------------------------------------------------------------------
const ahead = gitRead('log', 'origin/production..origin/staging', '--oneline');
if (!ahead) {
  console.error('staging is already in sync with production. Nothing to ship.');
  process.exit(1);
}

console.log('\nCommits to be shipped to production:');
console.log(ahead);

// ---------------------------------------------------------------------------
// Read package name for the confirmation prompt
// ---------------------------------------------------------------------------
const packageJsonPath = join(process.cwd(), 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error('No package.json found in current directory.');
  process.exit(1);
}
const { name: packageName } = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  name: string;
};

if (!confirm(`\nShip ${packageName} as a ${bumpType} release?`)) {
  console.log('Aborted.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Quality checks on staging
// ---------------------------------------------------------------------------
console.log('\nChecking out staging for quality checks...');
git('checkout', 'staging');
git('pull', '--ff-only', 'origin', 'staging');

console.log('\nRunning quality checks on staging...');
try {
  runQualityChecks();
} catch {
  console.error('\nQuality checks failed on staging. Fix issues before shipping.');
  git('checkout', 'main');
  process.exit(1);
}
console.log('✅ Quality checks passed');

// ---------------------------------------------------------------------------
// Read version from staging package.json and bump
// ---------------------------------------------------------------------------
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  name: string;
  version: string;
};
const oldVersion = packageJson.version;
const newVersion = bumpVersion(oldVersion, bumpType);

console.log(`\nBumping ${packageName}: ${oldVersion} → ${newVersion}`);

writeFileSync(
  packageJsonPath,
  `${JSON.stringify({ ...packageJson, version: newVersion }, null, 2)}\n`,
);

// ---------------------------------------------------------------------------
// Derive change descriptions from git log between production and staging
// ---------------------------------------------------------------------------
const logOutput = gitRead('log', 'origin/production..HEAD', '--pretty=format:%s');
const changeLines = logOutput
  ? logOutput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  : [];

const changeBody =
  changeLines.length > 0
    ? changeLines.map((c) => `- ${c.length > 98 ? `${c.slice(0, 95)}...` : c}`).join('\n')
    : `${bumpType} release`;

// ---------------------------------------------------------------------------
// Update CHANGELOG.md
// ---------------------------------------------------------------------------
const changelogPath = join(process.cwd(), 'CHANGELOG.md');
const today = new Date().toISOString().slice(0, 10);
insertChangelog(changelogPath, `## [${newVersion}] - ${today}\n\n${changeBody}\n`);

// ---------------------------------------------------------------------------
// Fix formatting if available
// ---------------------------------------------------------------------------
try {
  runScript('fix');
} catch {
  // fix may not exist in all packages
}

// ---------------------------------------------------------------------------
// Commit version bump on staging
// ---------------------------------------------------------------------------
git('add', '-A');
git('commit', '-m', `chore(release): ${packageName}@${newVersion}`, '-m', changeBody);

// ---------------------------------------------------------------------------
// Merge staging → production
// ---------------------------------------------------------------------------
console.log('\nMerging staging into production...');
git('checkout', 'production');
git('pull', '--ff-only', 'origin', 'production');
git('merge', '--ff-only', 'staging');
git('push', 'origin', 'production');

// ---------------------------------------------------------------------------
// Bring version commit back to main
// ---------------------------------------------------------------------------
console.log('\nSyncing version commit back to main...');
git('checkout', 'main');
git('pull', '--ff-only', 'origin', 'main');
git('merge', '--ff-only', 'production');
git('push', 'origin', 'main');

// ---------------------------------------------------------------------------
// Sync staging with main so the next flow-release can ff-merge cleanly
// ---------------------------------------------------------------------------
git('checkout', 'staging');
git('merge', '--ff-only', 'main');
git('push', 'origin', 'staging');
git('checkout', 'main');

console.log(`\n✅ Shipped ${packageName}@${newVersion} to production`);
console.log('You are on main and ready to keep working.');
