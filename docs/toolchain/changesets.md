# Changesets

Automated versioning and npm publishing.

## Why Changesets?

- **Semantic versioning** - Proper major/minor/patch bumps
- **Changelog generation** - Automatic from commit messages
- **npm publishing** - Integrated with GitHub Actions
- **Monorepo support** - Handles package dependencies

## Setup

### 1. Create Changeset Config

Create `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "access": "public",
  "baseBranch": "main",
  "changelog": ["@changesets/changelog-github", { "repo": "regardio/YOUR_REPO" }],
  "commit": false,
  "fixed": [],
  "ignore": [],
  "linked": [],
  "updateInternalDependencies": "patch"
}
```

### 2. Create GitHub Workflow

Copy the template from `src/templates/release.yml` to `.github/workflows/release.yml`.

### 3. Add Scripts

```json
{
  "scripts": {
    "release": "flow-release",
    "version": "pnpm changeset version"
  }
}
```

### 4. Configure package.json

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### 5. Create Initial CHANGELOG.md

```markdown
# @your-package/name

## 0.1.0

Initial release.
```

## Usage

### Quick Release

The `flow-release` command automates the entire process:

```bash
pnpm release patch "Fix typo in config"
pnpm release minor "Add new feature"
pnpm release major "Breaking API change"
```

This will:

1. Create a changeset file
2. Bump version in package.json
3. Update CHANGELOG.md
4. Commit with `chore(release): vX.Y.Z`
5. Push to current branch

GitHub Actions then publishes to npm automatically.

### Manual Process

For more control:

```bash
pnpm changeset           # Create changeset interactively
pnpm version             # Apply version bump
git add . && git commit  # Commit changes
git push                 # Trigger release workflow
```

## GitHub Repository Setup

### Actions Permissions

```text
Settings → Actions → General → Workflow permissions
☑ Read and write permissions
☑ Allow GitHub Actions to create and approve pull requests
```

### Branch Protection

```text
Settings → Rules → Rulesets → New branch ruleset

Ruleset Name: main-protection
Target: main

Rules:
☑ Restrict deletions
☑ Require a pull request before merging
☑ Require status checks to pass
☑ Block force pushes
```

## npm Provenance

The workflow uses npm provenance via OIDC:

- Links packages to source repository
- Cryptographic proof of build origin
- No npm token secrets needed

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
