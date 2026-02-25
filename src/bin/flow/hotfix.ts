#!/usr/bin/env node
/**
 * flow-hotfix: Manage hotfix branches based on production code.
 *
 * Usage:
 *   flow-hotfix start <name>                        - Create hotfix/<name> from production
 *   flow-hotfix finish <patch|minor> "description"  - Finish and propagate the hotfix
 *
 * GitLab workflow:
 *   production → hotfix/<name> → production → staging → main
 *
 * start:
 *   1. Fetches origin, checks out production, creates hotfix/<name>
 *
 * finish:
 *   1. Ensures you are on a hotfix/* branch with a clean working tree
 *   2. Runs quality checks
 *   3. Bumps version (patch or minor) and updates CHANGELOG.md
 *   4. Commits, then merges into production
 *   5. Merges production into staging
 *   6. Merges staging into main
 *   7. Pushes all three branches, deletes the hotfix branch
 *   8. Checks out main
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  branchExists,
  bumpVersion,
  git,
  gitRead,
  insertChangelog,
  runQualityChecks,
  runScript,
} from './utils.js';

const subcommand = process.argv[2];
const subArgs = process.argv.slice(3);

// ---------------------------------------------------------------------------
// flow-hotfix start <name>
// ---------------------------------------------------------------------------
if (subcommand === 'start') {
  const name = subArgs[0];
  if (!name) {
    console.error('Usage: flow-hotfix start <name>');
    process.exit(1);
  }

  const hotfixBranch = `hotfix/${name}`;

  const status = gitRead('status', '--porcelain');
  if (status) {
    console.error('Working directory has uncommitted changes. Commit or stash them first.');
    process.exit(1);
  }

  console.log('\nFetching latest state from origin...');
  git('fetch', 'origin');

  if (!branchExists('production')) {
    console.error(
      'Branch "production" does not exist. Create it first:\n'
        + '  git checkout -b production && git push -u origin production',
    );
    process.exit(1);
  }

  git('checkout', 'production');
  git('pull', '--ff-only', 'origin', 'production');
  git('checkout', '-b', hotfixBranch);

  console.log(`\n✅ Hotfix branch "${hotfixBranch}" created from production.`);
  console.log('Apply your fix, then run: flow-hotfix finish <patch|minor> "description"');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// flow-hotfix finish <patch|minor> "description"
// ---------------------------------------------------------------------------
if (subcommand === 'finish') {
  const bumpType = subArgs[0];
  const message = subArgs.slice(1).join(' ');

  if (!bumpType || !['patch', 'minor'].includes(bumpType)) {
    console.error('Usage: flow-hotfix finish <patch|minor> "description"');
    console.error('Hotfixes use patch or minor bumps only.');
    process.exit(1);
  }

  if (!message) {
    console.error('A description is required.');
    console.error('Example: flow-hotfix finish patch "Fix critical auth bug"');
    process.exit(1);
  }

  // Guard: must be on a hotfix/* branch
  const currentBranch = gitRead('branch', '--show-current');
  if (!currentBranch.startsWith('hotfix/')) {
    console.error(`Must be on a hotfix/* branch. Currently on: ${currentBranch}`);
    process.exit(1);
  }

  // Guard: working tree must be clean
  const status = gitRead('status', '--porcelain');
  if (status) {
    console.error('Working directory has uncommitted changes. Commit or stash them first.');
    process.exit(1);
  }

  // Quality checks
  console.log('\nRunning quality checks...');
  try {
    runQualityChecks();
  } catch {
    console.error('\nQuality checks failed. Fix all issues before finishing the hotfix.');
    process.exit(1);
  }
  console.log('✅ Quality checks passed');

  // Read package.json
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error('No package.json found in current directory.');
    process.exit(1);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    name: string;
    version: string;
  };
  const packageName = packageJson.name;
  const oldVersion = packageJson.version;
  const newVersion = bumpVersion(oldVersion, bumpType);

  console.log(`\nBumping ${packageName}: ${oldVersion} → ${newVersion}`);

  writeFileSync(
    packageJsonPath,
    `${JSON.stringify({ ...packageJson, version: newVersion }, null, 2)}\n`,
  );

  // Update CHANGELOG.md
  const changelogPath = join(process.cwd(), 'CHANGELOG.md');
  const today = new Date().toISOString().slice(0, 10);
  insertChangelog(changelogPath, `## [${newVersion}] - ${today} (hotfix)\n\n${message}\n`);

  // Fix formatting if available
  try {
    runScript('fix');
  } catch {
    // fix may not exist in all packages
  }

  // Commit
  git('add', '-A');
  git('commit', '-m', `chore(hotfix): ${packageName}@${newVersion}`, '-m', message);

  // Fetch before merging
  console.log('\nFetching latest state from origin...');
  git('fetch', 'origin');

  // Merge hotfix → production
  console.log('\nMerging hotfix into production...');
  git('checkout', 'production');
  git('pull', '--ff-only', 'origin', 'production');
  git(
    'merge',
    '--no-ff',
    currentBranch,
    '-m',
    `chore(hotfix): merge ${currentBranch} into production`,
  );
  git('push', 'origin', 'production');

  // Merge production → staging
  console.log('\nPropagating hotfix to staging...');
  git('checkout', 'staging');
  git('pull', '--ff-only', 'origin', 'staging');
  git('merge', '--no-ff', 'production', '-m', 'chore(hotfix): merge production into staging');
  git('push', 'origin', 'staging');

  // Merge staging → main
  console.log('\nPropagating hotfix to main...');
  git('checkout', 'main');
  git('pull', '--ff-only', 'origin', 'main');
  git('merge', '--no-ff', 'staging', '-m', 'chore(hotfix): merge staging into main');
  git('push', 'origin', 'main');

  // Delete hotfix branch
  git('branch', '-d', currentBranch);
  try {
    git('push', 'origin', '--delete', currentBranch);
  } catch {
    // Remote branch may not exist if it was never pushed
  }

  console.log(`\n✅ Hotfix ${packageName}@${newVersion} shipped to production → staging → main`);
  console.log('You are on main and ready to keep working.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Unknown subcommand
// ---------------------------------------------------------------------------
console.error('Usage:');
console.error('  flow-hotfix start <name>');
console.error('  flow-hotfix finish <patch|minor> "description"');
process.exit(1);
