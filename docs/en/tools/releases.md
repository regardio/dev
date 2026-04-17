---

title: Release Workflow
type: guide
status: published
summary: Automated release process for Regardio packages
related: [commitlint]
locale: en-US
---

# Release Workflow

Branch-based release workflow for Regardio packages. `main` → `staging` → `production`. Version bumps happen at ship time; quality gates run locally before any commit.

## Overview

Branches mirror deployment environments:

```text
main → production → staging
```

- **`main`** — active development, always deployable
- **`staging`** — optional validation environment (automatically synced from production)
- **`production`** — production-verified, versioned code only

Version numbers are assigned at ship time. You can ship directly from `main` to `production`, or optionally deploy to `staging` first for validation before shipping to production.

## How It Works

### Design principles

1. **Branches mirror environments.** `staging` reflects what is deployed to the staging server (when used); `production` always reflects what is deployed to production. There is never ambiguity about what is running where.
2. **Version numbers are a production guarantee.** A version bump only happens at `ship-production` time. This means every version tag in git and every release on npm corresponds to code that has been validated and shipped to production.
3. **Staging is optional.** You can ship directly from `main` to `production`. Use `ship-staging` when you want to test changes in a staging environment first. Either way, `staging` is automatically synced with `production` after each ship.
4. **Tests are a local gate, not a CI gate.** Quality checks (`build`, `lint`, `typecheck`, `test`) run on your machine before any commit is made. Broken code cannot enter the repository. CI only runs `build` and `publish` — it trusts the local gates.
5. **You always land back on `main`.** Every command returns you to `main` when it finishes so you can keep working without manual branch switching.

### Full flow diagram

```text
                    ship-staging (OPTIONAL)
                    ┌─────────────────────-────┐
                    │ quality checks pass      │
main ───────────────┤ ff-merge main → staging  ├──► main (pushed)
                    │ push staging + main      │
                    └────────────────────-─────┘
                                │
                           (validated in staging)
                                │
                                ▼
                    ship-production minor
                    ┌─────────────────-────────┐
                    │ tests pass on main       │
                    │ bump version             │
main ───────────────┤ update CHANGELOG.md      ├──► production
                    │ chore(release): pkg@ver  │
                    │ ff-merge main → prod     │
                    │ ff-merge prod → staging  │
                    │ sync back to main        │
                    └─────────────────-────────┘
                                │
                           (npm publish + GitHub Release triggered by CI)
                                ▼
                           production


                    ship-hotfix start fix-name
                    ┌────────────────────────-─┐
production ─────────┤ create hotfix/fix-name   ├──► hotfix/fix-name
                    └───────────────────────-──┘
                                │
                    ship-hotfix finish patch "msg"
                    ┌─────────────────────-────┐
                    │ tests pass               │
                    │ bump version             │
hotfix/fix-name ────┤ update CHANGELOG.md      ├──► production → staging → main
                    │ merge to production      │
                    │ propagate to staging     │
                    │ propagate to main        │
                    └───────────────────-──────┘
```

### What each branch represents at any point in time

| Branch | Contains | Version bumped? |
|--------|----------|-----------------|
| `main` | All committed, tested work | Only after a ship or hotfix |
| `staging` | Synced from `production` after each ship, or from `main` via `ship-staging` | After `ship-production` syncs it |
| `production` | Only shipped, versioned releases | Yes — always |

### GitHub Actions role

CI is intentionally minimal. It does not re-run tests. It:

1. Triggers on a push to `production`
2. Detects whether the version in `package.json` is new on npm
3. Publishes with OIDC provenance if so
4. Creates a GitHub Release with the top CHANGELOG section as the release body

## Commands

| Command | Usage | Purpose |
|---------|-------|---------|
| `ship-staging` | `ship-staging` | (Optional) Deploy changes to staging for testing |
| `ship-production` | `ship-production <patch\|minor\|major>` | Ship from main to production with version bump |
| `ship-hotfix` | `ship-hotfix start <name>` | Create a hotfix branch from production |
| `ship-hotfix` | `ship-hotfix finish <patch\|minor> "message"` | Finish and propagate a hotfix |

## Typical Release Flow

### Option A: Ship directly to production (recommended)

From `main`, with a clean working tree:

```bash
pnpm ship:production minor
```

This will:

1. Guard: must be on `main`, working tree clean
2. Fetch and verify `production` branch exists
3. Show all commits to be shipped and ask for confirmation — aborts if declined
4. Run full quality suite on `main` — aborts on failure
5. Bump version in `package.json` (patch / minor / major)
6. Collect all `git log` subjects since last production tip as changelog entries
7. Insert a new section into `CHANGELOG.md`
8. Fix formatting of modified files (`package.json`, `CHANGELOG.md`)
9. Commit with `chore(release): <package>@<version>` on `main`
10. Fast-forward merge `main` into `production` and push
11. Sync `staging` with `production` to keep it up to date
12. Return to `main`

### Option B: Test in staging first (optional)

If you want to validate changes in a staging environment before shipping:

#### 1. Deploy to staging

From `main`, with a clean working tree:

```bash
pnpm ship:staging
```

This will:

1. Guard: must be on `main`, working tree clean
2. Run quality checks (`build`, `lint`, `typecheck`, `test`) — aborts on failure
3. Fast-forward merge `main` into `staging` and push
4. Push `main` and return

You can do this multiple times. Each commit accumulates in `staging`.

#### 2. Ship to production

After validating in staging, ship to production using the same command as Option A:

```bash
pnpm ship:production minor
```

The workflow is identical — it ships from `main` to `production` and syncs `staging` afterward.

## Hotfix Flow

For urgent fixes that must go directly to production:

```bash
# 1. Create hotfix branch from production
pnpm ship:hotfix start fix-auth-bug

# 2. Make your changes, then finish
pnpm ship:hotfix finish patch "Fix critical auth token expiry bug"
```

`finish` will:

1. Guard: must be on a `hotfix/*` branch, working tree clean
2. Run full quality suite — aborts on failure
3. Bump version (patch or minor only) and update `CHANGELOG.md`
4. Commit, then merge `hotfix → production → staging → main`
5. Push all three branches
6. Delete the hotfix branch
7. Return to `main`

## Branch Setup

If `staging` or `production` branches do not yet exist in your repository:

```bash
git checkout -b staging && git push -u origin staging
git checkout -b production && git push -u origin production
git checkout main
```

## Quality Gates

Every command enforces the same gates — no broken code can be committed or pushed to any environment:

```bash
pnpm build      # Must succeed
pnpm lint       # Must succeed (validates without modifying)
pnpm typecheck  # Must succeed
pnpm test       # Tests with coverage — must succeed
```

**Note:** If `lint` fails, run `pnpm fix` manually to apply fixes, then commit the changes before shipping.

## Adoption

Any package using `@regardio/dev` gets these commands via the installed bins. Add the convenience scripts to `package.json`:

```json
{
  "scripts": {
    "ship:hotfix": "ship-hotfix",
    "ship:production": "ship-production",
    "ship:staging": "ship-staging"
  }
}
```

Create an initial `CHANGELOG.md` if one does not exist (the tools will create it automatically on first use if absent).

## Private Packages

Packages that should never be published to npm must set `"private": true` in `package.json` and omit `"publishConfig"`. This is the npm-standard mechanism that prevents accidental publishing regardless of how `npm publish` is called.

The git flow (`ship-staging`, `ship-production`, `ship-hotfix`) works identically for private packages — versioning, changelogs, and branch promotion all continue as normal. The CI `release.yml` detects `private: true` and skips the publish and GitHub Release steps gracefully.

Related documents:

- [Commit Conventions](../standards/commits.md) — Conventional commits for consistent history and automated changelogs
- [Commitlint](./commitlint.md) — Commit message validation
