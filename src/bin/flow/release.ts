#!/usr/bin/env node
/**
 * flow-release: Deploy changes to staging following the GitLab workflow.
 *
 * Usage: flow-release [message]
 *
 * GitLab workflow:
 *   main → staging  (staging deploy, no version bump yet)
 *
 * Versioning happens at ship time (flow-ship), not here.
 * This keeps version numbers reserved for production-verified code.
 *
 * This script:
 * 1. Ensures the current branch is main and the working tree is clean
 * 2. Pulls latest main from origin
 * 3. Runs quality checks locally (build, typecheck, tests)
 * 4. Runs fix — commits formatting output (if any) with a commitlint-compliant message
 * 5. Merges main into staging (fast-forward) and pushes
 * 6. Pushes main and returns so work can continue
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { branchExists, git, gitRead, runQualityChecks, runScript } from './utils.js';

const args = process.argv.slice(2);
const message = args.join(' ') || 'auto-fix formatting';

// ---------------------------------------------------------------------------
// Guard: must be on main
// ---------------------------------------------------------------------------
const currentBranch = gitRead('branch', '--show-current');
if (currentBranch !== 'main') {
  console.error(`Must be on the main branch to release. Currently on: ${currentBranch}`);
  process.exit(1);
}

// Guard: working tree must be clean
const status = gitRead('status', '--porcelain');
if (status) {
  console.error('Working directory has uncommitted changes. Commit or stash them first.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Sync with origin before doing anything
// ---------------------------------------------------------------------------
console.log('\nFetching latest state from origin...');
git('fetch', 'origin');
git('pull', '--ff-only', 'origin', 'main');

// ---------------------------------------------------------------------------
// Read package.json
// ---------------------------------------------------------------------------
const packageJsonPath = join(process.cwd(), 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error('No package.json found in current directory.');
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as { name: string };
const packageName = packageJson.name;

if (!packageName) {
  console.error('No "name" field found in package.json.');
  process.exit(1);
}

// Guard: staging branch must exist
if (!branchExists('staging')) {
  console.error(
    'Branch "staging" does not exist locally or on origin. Create it first:\n'
      + '  git checkout -b staging && git push -u origin staging',
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Quality checks — no broken code may be committed
// ---------------------------------------------------------------------------
console.log('\nRunning quality checks...');
try {
  runQualityChecks();
} catch {
  console.error('\nQuality checks failed. Fix all issues before releasing.');
  process.exit(1);
}
console.log('✅ Quality checks passed');

// ---------------------------------------------------------------------------
// Fix formatting if available
// ---------------------------------------------------------------------------
try {
  runScript('fix');
} catch {
  // fix may not exist in all packages
}

// ---------------------------------------------------------------------------
// Commit formatting fixes (if any)
// ---------------------------------------------------------------------------
git('add', '-A');
const hasStagedChanges = gitRead('diff', '--cached', '--name-only') !== '';
if (hasStagedChanges) {
  git('commit', '-m', `chore(staging): ${message}`);
}

// ---------------------------------------------------------------------------
// Merge into staging
// ---------------------------------------------------------------------------
console.log('\nMerging main into staging...');
git('checkout', 'staging');
git('merge', '--ff-only', 'main');
git('push', 'origin', 'staging');

// ---------------------------------------------------------------------------
// Return to main and sync
// ---------------------------------------------------------------------------
git('checkout', 'main');
git('push', 'origin', 'main');

console.log('\n✅ Changes deployed to staging');
console.log('Run flow-ship <patch|minor|major> when ready to promote to production.');
