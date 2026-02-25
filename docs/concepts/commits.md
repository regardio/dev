# Commit Conventions

Conventional commits for consistent history and automated changelogs.

## Format

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Header

- **type**: Category of change (required)
- **scope**: Area of codebase affected (optional)
- **subject**: Short description in imperative mood (required)

Maximum 100 characters for the header line.

## Types

| Type | Description | Changelog Section |
|------|-------------|-------------------|
| `feat` | New feature | Features |
| `fix` | Bug fix | Bug Fixes |
| `docs` | Documentation only | - |
| `style` | Formatting, no code change | - |
| `refactor` | Code change that neither fixes nor adds | - |
| `perf` | Performance improvement | Performance |
| `test` | Adding or updating tests | - |
| `build` | Build system or dependencies | - |
| `ci` | CI configuration | - |
| `chore` | Other changes (tooling, etc.) | - |
| `revert` | Revert a previous commit | - |
| `BREAKING CHANGE` | Breaking API change | Breaking Changes |

## Examples

### Simple commits

```bash
feat: add user authentication
fix: resolve login redirect loop
docs: update API documentation
refactor: simplify payment processing
test: add unit tests for date utilities
chore: update dependencies
```

### With scope

```bash
feat(auth): implement OAuth2 flow
fix(api): handle null response gracefully
docs(readme): add installation instructions
refactor(utils): extract date formatting
```

### With body

```bash
fix: prevent race condition in data sync

The previous implementation could cause data corruption when
multiple sync operations ran concurrently. This change adds
a mutex lock to ensure sequential processing.

Closes #123
```

### Breaking changes

```bash
feat!: redesign authentication API

BREAKING CHANGE: The auth.login() method now returns a Promise
instead of using callbacks. Update all call sites to use async/await.
```

## Best Practices

### Write in imperative mood

```bash
# Good
feat: add validation for email field
fix: remove duplicate entries from list

# Bad
feat: added validation for email field
fix: removes duplicate entries from list
```

### Keep commits atomic

Each commit should represent a single logical change. If you need to describe multiple changes, split into multiple commits.

### Reference issues

Link to related issues in the footer:

```bash
fix: correct calculation of total price

Closes #456
Refs #123, #789
```

## Enforcement

Commit messages are validated by [Commitlint](../toolchain/commitlint.md) via Git hooks. Non-conforming commits will be rejected.

## Changelog Generation

Changelogs are updated automatically by `flow-ship` at release time. The commit
subjects between the previous production tip and the current staging HEAD are
collected and written as bullet points into `CHANGELOG.md`.

Write informative commit subjects — they become the public changelog entries.

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
