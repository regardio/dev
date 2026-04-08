---

title: @regardio/dev Documentation
type: guide
status: published
summary: Complete documentation for the @regardio/dev toolchain
related: [coding-standards, development-principles]
locale: en-US
---

# Documentation

Complete documentation for the `@regardio/dev` toolchain.

## Impulse

A shared toolchain needs documentation that helps readers move from orientation to detail without guessing where to start.

- Documentation becomes harder to use when standards and tools are scattered
- Readers need both conceptual guidance and practical setup instructions
- A clear index reduces the cost of entering or revisiting the toolchain

## Signal

The docs in this package serve different purposes, but they belong to one shared system.

- Concept documents explain principles and recurring patterns
- Toolchain guides explain how to configure and use specific tools
- Writing guidance supports the voice and structure of the docs themselves

## Effect

There are a few ways to organize documentation.

- A flat list is simple, but it hides the difference between concepts and tools
- A purely narrative introduction helps newcomers, but slows repeat readers
- A structured index gives readers quick access while still showing how the pieces fit together

## Accord

This README acts as the entry point for `@regardio/dev` documentation.

- Group documents by role so readers can navigate by intent
- Keep quick-reference material close to the index
- Link into detailed documents instead of repeating them here

## Action

Use the sections below to find the document that matches the question you are trying to answer.

### Concepts

Foundational principles and standards that guide development:

| Document | Description |
|----------|-------------|
| [AI Agents](./agents.md) | Instructions for AI coding assistants |
| [API](./coding/api.md) | API design and implementation guidelines |
| [Coding](./coding/coding.md) | TypeScript, React, and general patterns |
| [Commits](./conventions/commits.md) | Conventional commits and changelog generation |
| [Documentation](./conventions/documentation.md) | Documentation structure and conventions |
| [Naming](./conventions/naming.md) | Consistent naming across languages |
| [Principles](./coding/principles.md) | Code quality, architecture, maintainability |
| [React](./coding/react.md) | React and TypeScript development patterns |
| [SQL](./coding/sql.md) | PostgreSQL/Supabase schema styling and structure |
| [Testing](./conventions/testing.md) | Testing philosophy and patterns |

### Locale-Specific Documentation

Writing for Regardio content:

| Document | Description |
|----------|-------------|
| [Writing in English](./conventions/writing.md) | Voice, tone, and language for English content |
| [Schreiben auf Deutsch](../de/konventionen/schreiben.md) | Stimme, Ton und Sprache für deutschsprachige Inhalte |

### Toolchain

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

### Quick Reference

#### Commands

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

#### Config Files

| File | Purpose |
|------|---------|
| `.commitlintrc.json` | Commit message rules |
| `.markdownlint.json` | Markdown rules |
| `biome.jsonc` | Linting and formatting |
| `playwright.config.ts` | E2E test configuration |
| `pnpm-workspace.yaml` | Workspace dependency and supply-chain policy |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Unit test configuration |

#### Extending Presets

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

## Essence

This index gives the documentation set a navigable shape.

- New readers can find the right entry point faster
- Experienced readers can jump directly to the detail they need
- The relationship between principles, tooling, and writing stays visible

Related documents:

- [Documentation Standard](./conventions/documentation.md) — Template and standard for Regardio documentation following the six-step structure
