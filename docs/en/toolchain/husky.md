---

title: Husky
type: guide
status: published
summary: Git hooks for quality gates
related: [commitlint, biome]
locale: en-US
---

# Husky

Git hooks for automated quality checks.

## Impulse

Quality gates work best when they run at the edge of the workflow instead of relying on memory.

- Manual checks are easy to skip when work is moving quickly
- Shared hooks reduce drift between developers
- Fast local validation keeps broken changes out of history

## Signal

Git hooks are useful because they connect repository rules to everyday actions.

- Commit-time checks give immediate feedback
- Local enforcement supports the same expectations that appear in CI
- A shared wrapper helps monorepo setup remain predictable

## Effect

There are a few ways to handle workflow checks.

- Purely manual discipline is flexible, but it is inconsistent
- CI-only enforcement catches issues later than necessary
- Local hooks create earlier feedback without changing the underlying standards

## Accord

We use Husky to run repository checks at commit time in Regardio projects.

- Configure hooks through the shared tooling in `@regardio/dev`
- Keep hook behavior lightweight and understandable
- Treat bypassing as an exception rather than normal workflow

### Why Husky?

- **Pre-commit validation** - Catch issues before they enter history
- **Consistent enforcement** - Same checks for all developers
- **Fast feedback** - Know immediately if something is wrong
- **CI alignment** - Same rules locally and in CI

## Action

Use the setup and hook examples below to install Husky and connect it to the checks your project needs.

### Setup

Husky is configured automatically via the `prepare` script:

```json
{
  "scripts": {
    "prepare": "exec-husky"
  }
}
```

This runs after `pnpm install` and sets up the `.husky` directory.

### Hooks

#### commit-msg

Validates commit messages against conventional commit format:

```bash
#!/bin/sh
pnpm lint-commit --edit $1
```

#### pre-commit (optional)

Run linting before commit:

```bash
#!/bin/sh
pnpm lint
```

### CLI Wrapper

Use `exec-husky` instead of `husky` directly. This wrapper handles monorepo scenarios correctly.

### Bypassing Hooks

In rare cases where you need to skip hooks:

```bash
git commit --no-verify -m "emergency fix"
```

Use sparingly and only when absolutely necessary.

### Troubleshooting

#### Hooks not running

Ensure Husky is installed:

```bash
pnpm install
```

Check that `.husky` directory exists and contains hook files.

#### Permission denied

Make hooks executable:

```bash
chmod +x .husky/*
```

## Essence

This guide makes local workflow enforcement easier to understand and adopt.

- Quality checks move closer to the moment changes are created
- Teams share the same commit-time expectations
- Exceptions remain explicit instead of becoming silent drift

Related documents:

- [Commitlint](./commitlint.md) — Commit message validation
- [Biome](./biome.md) — Linting and formatting

### Resources

- [Husky Documentation](https://typicode.github.io/husky/)
