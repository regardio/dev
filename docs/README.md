# Documentation

Complete documentation for the @regardio/dev toolchain.

## Concepts

Foundational principles and standards that guide development:

| Document | Description |
|----------|-------------|
| [Development Principles](./concepts/development-principles.md) | Code quality, architecture, maintainability |
| [Coding Standards](./concepts/coding-standards.md) | TypeScript, React, and general patterns |
| [Naming Conventions](./concepts/naming-conventions.md) | Consistent naming across languages |
| [Commit Conventions](./concepts/commits.md) | Conventional commits and changelog generation |
| [Testing Approach](./concepts/testing.md) | Testing philosophy and patterns |
| [SQL Schema Standards](./concepts/sql-schema-standards.md) | PostgreSQL/Supabase schema styling and structure |
| [React Standards](./concepts/react-standards.md) | React and TypeScript development patterns |
| [API Standards](./concepts/api-standards.md) | API design and implementation guidelines |
| [AI Agent Guidelines](./concepts/ai-agents.md) | Instructions for AI coding assistants |

## Toolchain

Configuration and usage for each tool in the stack:

| Document | Description |
|----------|-------------|
| [TypeScript](./toolchain/typescript.md) | Strict TypeScript configuration |
| [Biome](./toolchain/biome.md) | Linting and formatting |
| [Vitest](./toolchain/vitest.md) | Unit and integration testing |
| [Playwright](./toolchain/playwright.md) | End-to-end testing |
| [Commitlint](./toolchain/commitlint.md) | Commit message validation |
| [Markdownlint](./toolchain/markdownlint.md) | Markdown quality |
| [Husky](./toolchain/husky.md) | Git hooks |
| [Changesets](./toolchain/changesets.md) | Versioning and releases |

## Quick Reference

### Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm lint          # Run linting only
pnpm test          # Run tests
pnpm report        # Run tests with coverage
pnpm typecheck     # TypeScript type checking
```

### Config Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript configuration |
| `biome.jsonc` | Linting and formatting |
| `vitest.config.ts` | Unit test configuration |
| `playwright.config.ts` | E2E test configuration |
| `.commitlintrc.json` | Commit message rules |
| `.markdownlint.json` | Markdown rules |

### Extending Presets

```jsonc
// biome.jsonc
{ "extends": ["@regardio/dev/biome"] }

// tsconfig.json
{ "extends": "@regardio/dev/typescript/base.json" }

// .commitlintrc.json
{ "extends": ["@regardio/dev/commitlint"] }

// .markdownlint.json
{ "extends": "@regardio/dev/markdownlint" }
```
