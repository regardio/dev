---

title: Husky
type: guide
status: published
summary: Git hooks for quality gates
related: [commitlint, biome]
locale: en-US
---

# Husky

Runs quality checks at commit time via Git hooks. Configured through `@regardio/dev`; bypass only in genuine emergencies.

## Setup

Husky is configured automatically via the `prepare` script:

```json
{
  "scripts": {
    "prepare": "exec-husky"
  }
}
```

This runs after `pnpm install` and sets up the `.husky` directory.

## Hooks

### commit-msg

Validates commit messages against conventional commit format:

```bash
#!/bin/sh
pnpm lint-commit --edit $1
```

### pre-commit (optional)

Run linting before commit:

```bash
#!/bin/sh
pnpm lint
```

## CLI Wrapper

Use `exec-husky` instead of `husky` directly. This wrapper handles monorepo scenarios correctly.

## Bypassing Hooks

In rare cases where you need to skip hooks:

```bash
git commit --no-verify -m "emergency fix"
```

Use sparingly and only when absolutely necessary.

## Troubleshooting

### Hooks not running

Ensure Husky is installed:

```bash
pnpm install
```

Check that `.husky` directory exists and contains hook files.

### Permission denied

Make hooks executable:

```bash
chmod +x .husky/*
```

Related documents:

- [Commitlint](./commitlint.md) — Commit message validation
- [Biome](./biome.md) — Linting and formatting

### Resources

- [Husky Documentation](https://typicode.github.io/husky/)
