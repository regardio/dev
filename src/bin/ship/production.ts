#!/usr/bin/env node
/**
 * ship-production: Version and promote main to production following the GitLab workflow.
 *
 * Usage: ship-production <patch|minor|major>
 *
 * GitLab workflow:
 *   main → (version bump commit) → production → staging → main
 *
 * Versioning is intentionally deferred to this step so that version numbers
 * only ever correspond to production-verified code.
 *
 * This script:
 * 1. Ensures the current branch is main and the working tree is clean
 * 2. Verifies main is ahead of production (there is something to ship)
 * 3. Runs quality checks on main
 * 4. Bumps the version in package.json
 * 5. Collects change descriptions from git log between production and main
 * 6. Updates CHANGELOG.md
 * 7. Commits the version bump on main
 * 8. Merges main into production (fast-forward) and pushes
 * 9. Merges production into staging to keep it in sync
 * 10. Merges production back into main to ensure consistency
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
  console.error('Usage: ship-production <patch|minor|major>');
  console.error('Example: ship-production minor');
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
// Verify main has commits not yet in production
// ---------------------------------------------------------------------------
git('pull', '--ff-only', 'origin', 'main');
const ahead = gitRead('log', 'origin/production..HEAD', '--oneline');
if (!ahead) {
  console.error('main is already in sync with production. Nothing to ship.');
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
// Quality checks on main
// ---------------------------------------------------------------------------
console.log('\nRunning quality checks on main...');
try {
  runQualityChecks();
} catch {
  console.error('\nQuality checks failed on main. Fix issues before shipping.');
  process.exit(1);
}
console.log('✅ Quality checks passed');

// ---------------------------------------------------------------------------
// Read version from main package.json and bump
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
// Fix formatting of modified files (package.json, CHANGELOG.md)
// ---------------------------------------------------------------------------
try {
  runScript('fix:pkg');
} catch {
  // fix:pkg may not exist, try generic fix
  try {
    runScript('fix');
  } catch {
    // No fix script available
  }
}

// ---------------------------------------------------------------------------
// Commit version bump on main
// ---------------------------------------------------------------------------
git('add', '-A');
git('commit', '-m', `chore(release): ${packageName}@${newVersion}`, '-m', changeBody);

// ---------------------------------------------------------------------------
// Merge main → production
// ---------------------------------------------------------------------------
console.log('\nMerging main into production...');
git('checkout', 'production');
git('pull', '--ff-only', 'origin', 'production');
git('merge', '--ff-only', 'main');
git('push', 'origin', 'production');

// ---------------------------------------------------------------------------
// Sync staging with production
// ---------------------------------------------------------------------------
console.log('\nSyncing staging with production...');
git('checkout', 'staging');
git('pull', '--ff-only', 'origin', 'staging');
git('merge', '--ff-only', 'production');
git('push', 'origin', 'staging');

// ---------------------------------------------------------------------------
// Return to main and push
// ---------------------------------------------------------------------------
git('checkout', 'main');
git('push', 'origin', 'main');

console.log(`\n✅ Shipped ${packageName}@${newVersion} to production`);
console.log('You are on main and ready to keep working.');
