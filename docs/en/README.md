---

title: @regardio/dev Documentation
type: guide
status: published
summary: Complete documentation for the @regardio/dev toolchain
related: [coding-standards, development-principles]
locale: en-US
---

# Documentation

Documentation index and quick reference for the `@regardio/dev` toolchain.

## Concepts

Foundational principles and standards that guide development:

| Document | Description |
|----------|-------------|
| [AI Agents](./agents.md) | Instructions for AI coding assistants |
| [API](./standards/api.md) | API design and implementation guidelines |
| [Coding](./standards/coding.md) | TypeScript, React, and general patterns |
| [Commits](./standards/commits.md) | Conventional commits and changelog generation |
| [Documentation](./standards/documentation.md) | Documentation structure and conventions |
| [Naming](./standards/naming.md) | Consistent naming across languages |
| [Principles](./standards/principles.md) | Code quality, architecture, maintainability |
| [React](./standards/react.md) | React and TypeScript development patterns |
| [SQL](./standards/sql.md) | PostgreSQL schema styling, structure, and access control |
| [Testing](./standards/testing.md) | Testing philosophy and patterns |
| [Writing](./standards/writing.md) | Voice, tone, and language |

## Toolchain

Configuration and usage for each tool in the stack:

| Document | Description |
|----------|-------------|
| [Biome](./tools/biome.md) | Linting and formatting |
| [Commitlint](./tools/commitlint.md) | Commit message validation |
| [Dependencies](./tools/dependencies.md) | Safe dependency updates and supply-chain controls |
| [Husky](./tools/husky.md) | Git hooks |
| [Markdownlint](./tools/markdownlint.md) | Markdown quality |
| [Playwright](./tools/playwright.md) | End-to-end testing |
| [Releases](./tools/releases.md) | GitLab-flow-based versioning and releases |
| [TypeScript](./tools/typescript.md) | Strict TypeScript configuration |
| [Vitest](./tools/vitest.md) | Unit and integration testing |

## Quick Reference

### Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm lint          # Run linting only
pnpm report        # Run tests with coverage
pnpm ship:production <patch|minor|major>  # Version and promote to production
pnpm ship:staging  # Deploy changes to staging
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
| `pnpm-workspace.yaml` | Workspace dependency and supply-chain policy |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Unit test configuration |
| `.sqlfluff` | SQL linting (copy from `@regardio/dev/sqlfluff/setup.cfg`) |

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
