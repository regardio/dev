# Release Workflow

GitLab-flow-based release process for all Regardio packages.

## Overview

Branches mirror deployment environments:

```text
main → staging → production
```

- **`main`** — active development, always deployable
- **`staging`** — validated before promotion to production
- **`production`** — production-verified, versioned code only

Version numbers are assigned at ship time, so they always correspond to
code that has passed staging validation.

## How It Works

### Design principles

1. **Branches mirror environments.** `staging` always reflects what is deployed to the staging server; `production` always reflects what is deployed to production. There is never ambiguity about what is running where.

2. **Version numbers are a production guarantee.** A version bump only happens at `flow-ship` time, after the code has been validated in staging. This means every version tag in git and every release on npm corresponds to code that has actually been tested end-to-end in a real environment.

3. **Tests are a local gate, not a CI gate.** Quality checks (`build`, `typecheck`, `report`) run on your machine before any commit is made. Broken code cannot enter the repository. CI only runs `build` and `publish` — it trusts the local gates.

4. **You always land back on `main`.** Every command returns you to `main` when it finishes so you can keep working without manual branch switching.

### Full flow diagram

```text
                    flow-release "msg"
                    ┌─────────────────────────┐
                    │ tests pass               │
                    │ chore(staging): msg      │
main ───────────────┤                          ├──► main
                    │ ff-merge main → staging  │
                    └─────────────────────────┘
                                │
                           (validated in staging)
                                │
                    flow-ship minor
                    ┌─────────────────────────┐
                    │ tests pass on staging    │
                    │ bump version             │
staging ────────────┤ update CHANGELOG.md      ├──► staging
                    │ chore(release): pkg@ver  │
                    │ ff-merge staging → prod  │
                    │ ff-merge prod → main     │
                    └─────────────────────────┘
                                │
                           (npm publish + GitHub Release triggered by CI)
                                ▼
                           production


                    flow-hotfix start fix-name
                    ┌─────────────────────────┐
production ─────────┤ create hotfix/fix-name   ├──► hotfix/fix-name
                    └─────────────────────────┘
                                │
                    flow-hotfix finish patch "msg"
                    ┌─────────────────────────┐
                    │ tests pass               │
                    │ bump version             │
hotfix/fix-name ────┤ update CHANGELOG.md      ├──► production → staging → main
                    │ merge to production      │
                    │ propagate to staging     │
                    │ propagate to main        │
                    └─────────────────────────┘
```

### What each branch represents at any point in time

| Branch | Contains | Version bumped? |
|--------|----------|-----------------|
| `main` | All committed, tested work | Only after a ship or hotfix |
| `staging` | Everything in `main`, plus the version commit when shipping | After `flow-ship` commits it |
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
| `flow-release` | `flow-release "message"` | Deploy changes to staging |
| `flow-ship` | `flow-ship <patch\|minor\|major>` | Promote staging to production with version bump |
| `flow-hotfix` | `flow-hotfix start <name>` | Create a hotfix branch from production |
| `flow-hotfix` | `flow-hotfix finish <patch\|minor> "message"` | Finish and propagate a hotfix |

## Typical Release Flow

### 1. Deploy to staging

From `main`, with a clean working tree:

```bash
pnpm release "Add new vitest configs"
```

This will:

1. Guard: must be on `main`, working tree clean
2. Run `pnpm build`, `pnpm typecheck`, `pnpm report` — aborts on failure
3. Run `pnpm fix`
4. Commit with `chore(staging): <message>`
5. Fast-forward merge `main` into `staging` and push
6. Return to `main`

You can do this multiple times. Each commit accumulates in `staging`.

### 2. Ship to production

When staging has been validated and you are ready to release:

```bash
pnpm ship minor
```

This will:

1. Guard: must be on `main`, working tree clean
2. Fetch and verify `staging` and `production` branches exist
3. Confirm `staging` is ahead of `production` — aborts if nothing to ship
4. Check out `staging`, run full quality suite — aborts on failure
5. Bump version in `package.json` (patch / minor / major)
6. Collect all `git log` subjects since last production tip as changelog entries
7. Insert a new section into `CHANGELOG.md`
8. Run `pnpm fix`
9. Commit with `chore(release): <package>@<version>`
10. Fast-forward merge `staging` into `production` and push
11. Fast-forward merge `production` back into `main` and push
12. Return to `main`

## Hotfix Flow

For urgent fixes that must go directly to production:

```bash
# 1. Create hotfix branch from production
flow-hotfix start fix-auth-bug

# 2. Make your changes, then finish
flow-hotfix finish patch "Fix critical auth token expiry bug"
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

Every command enforces the same gates — no broken code can be committed
or pushed to any environment:

```bash
pnpm build      # Must succeed
pnpm typecheck  # Must succeed
pnpm report     # Tests with coverage — must succeed
```

## Adoption

Any package using `@regardio/dev` gets these commands via the installed bins.
Add the convenience scripts to `package.json`:

```json
{
  "scripts": {
    "release": "flow-release",
    "ship": "flow-ship",
    "hotfix": "flow-hotfix"
  }
}
```

Create an initial `CHANGELOG.md` if one does not exist (the tools will create
it automatically on first use if absent).
