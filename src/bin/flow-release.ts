#!/usr/bin/env node
/**
 * flow-release: Automate the release flow for any @regardio package.
 *
 * Usage: flow-release <patch|minor|major> [message]
 *
 * This script:
 * 1. Reads the package name from package.json
 * 2. Creates a changeset file with the specified bump type
 * 3. Runs `changeset version` to apply the version bump
 * 4. Updates the lockfile (pnpm install --ignore-workspace)
 * 5. Commits all changes
 * 6. Pushes to the current branch
 *
 * The GitHub Action will then publish to npm automatically.
 *
 * Prerequisites for adopting packages:
 * - Add @regardio/dev as a devDependency
 * - Create .changeset/config.json (see template in dev docs)
 * - Add .github/workflows/release.yml (see template in dev docs)
 * - Add "release": "flow-release" to package.json scripts
 */
import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
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

// Read package name from package.json
const packageJsonPath = join(process.cwd(), 'package.json');
if (!existsSync(packageJsonPath)) {
  console.error('No package.json found in current directory');
  process.exit(1);
}
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  name: string;
  version: string;
};
const packageName = packageJson.name;

if (!packageName) {
  console.error('No "name" field found in package.json');
  process.exit(1);
}

console.log(`Releasing ${packageName} with ${bumpType} bump...`);

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

// Verify .changeset/config.json exists
const changesetDir = join(process.cwd(), '.changeset');
const changesetConfigPath = join(changesetDir, 'config.json');
if (!existsSync(changesetConfigPath)) {
  console.error('No .changeset/config.json found.');
  console.error('Run: pnpm changeset init');
  console.error('Then configure .changeset/config.json for your package.');
  process.exit(1);
}

// Clean up existing changesets to ensure only our bump type is applied
mkdirSync(changesetDir, { recursive: true });

const existingChangesets = readdirSync(changesetDir).filter(
  (f) => f.endsWith('.md') && f !== 'README.md',
);
for (const file of existingChangesets) {
  unlinkSync(join(changesetDir, file));
  console.log(`Removed existing changeset: ${file}`);
}

// Generate a unique changeset filename
const changesetId = `release-${Date.now()}`;
const changesetFile = join(changesetDir, `${changesetId}.md`);

// Create the changeset file with dynamic package name
const changesetContent = `---
"${packageName}": ${bumpType}
---

${message}
`;

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

// Re-read package.json to get the new version after changeset version
const updatedPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
  version: string;
};
const { version } = updatedPackageJson;

// Commit
run(`git commit -m "chore(release): v${version}"`);

// Push
const branch = runQuiet('git branch --show-current');
run(`git push origin ${branch}`);

console.log(`\n✅ Released v${version}`);
console.log('The GitHub Action will now publish to npm.');
