---

title: @regardio/dev Documentation
type: guide
status: published
summary: Complete documentation for the @regardio/dev toolchain
related: [coding-standards, development-principles]
locale: en-US
---

# Documentation

Complete documentation for the @regardio/dev toolchain.

## Concepts

Foundational principles and standards that guide development:

| Document | Description |
|----------|-------------|
| [AI Agents](./en/agents.md) | Instructions for AI coding assistants |
| [API](./en/api.md) | API design and implementation guidelines |
| [Coding](./en/coding.md) | TypeScript, React, and general patterns |
| [Commits](./en/commits.md) | Conventional commits and changelog generation |
| [Documentation](./en/documentation.md) | Documentation structure and conventions |
| [Naming](./en/naming.md) | Consistent naming across languages |
| [Principles](./en/principles.md) | Code quality, architecture, maintainability |
| [React](./en/react.md) | React and TypeScript development patterns |
| [SQL](./en/sql.md) | PostgreSQL/Supabase schema styling and structure |
| [Testing](./en/testing.md) | Testing philosophy and patterns |

## Locale-Specific Documentation

Writing for Regardio content (crucial aspects available in German):

| Document | Description |
|----------|-------------|
| [Writing in English](./en/writing.md) | Voice, tone, and language for English content |
| [Schreiben auf Deutsch](./de/writing.md) | Stimme, Ton und Sprache für deutsche Inhalte |

## Toolchain

Configuration and usage for each tool in the stack:

| Document | Description |
|----------|-------------|
| [Biome](./en/toolchain/biome.md) | Linting and formatting |
| [Commitlint](./en/toolchain/commitlint.md) | Commit message validation |
| [Husky](./en/toolchain/husky.md) | Git hooks |
| [Markdownlint](./en/toolchain/markdownlint.md) | Markdown quality |
| [Playwright](./en/toolchain/playwright.md) | End-to-end testing |
| [Releases](./en/toolchain/releases.md) | GitLab-flow-based versioning and releases |
| [TypeScript](./en/toolchain/typescript.md) | Strict TypeScript configuration |
| [Vitest](./en/toolchain/vitest.md) | Unit and integration testing |

## Quick Reference

### Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm ship:staging  # Deploy changes to staging
pnpm ship:production <patch|minor|major>  # Version and promote to production
pnpm lint          # Run linting only
pnpm report        # Run tests with coverage
pnpm test          # Run tests
pnpm typecheck     # TypeScript type checking
```

### Config Files

| File | Purpose |
|------|---------|
| `.commitlintrc.json` | Commit message rules |
| `.markdownlint.json` | Markdown rules |
| `biome.jsonc` | Linting and formatting |
| `playwright.config.ts` | E2E test configuration |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Unit test configuration |

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
