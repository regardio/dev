# @regardio/dev

A unified developer toolchain for consistent, high-quality TypeScript projects.

## Purpose

`@regardio/dev` provides a complete, opinionated development environment that can be adopted by any JavaScript/TypeScript project. It bundles best-in-class tools with sensible defaults, enabling teams to focus on building features rather than configuring tooling.

**One dependency. Zero configuration conflicts. Consistent quality across all projects.**

## Philosophy

We believe in **balanced strictness**: rigorous enough to catch bugs early and maintain consistency, yet practical enough to not impede development velocity.

- **Strict by default** - TypeScript strict mode, comprehensive linting, conventional commits
- **Sensible defaults** - Shared configs that work out of the box
- **Minimal boilerplate** - Extend presets, override only what's necessary
- **Fast feedback** - Quick linting and type checking during development

The goal is code that's correct, consistent, and a pleasure to work with.

## What's Inside

| Category | Tools |
|----------|-------|
| **Linting** | Biome, Markdownlint, Commitlint |
| **Testing** | Vitest, Playwright, Testing Library |
| **Build** | TypeScript, tsx, Vite |
| **Workflow** | Husky, GitLab Flow |
| **CLI utilities** | exec-clean, exec-p, exec-s, exec-tsc, ship-staging, ship-production, ship-hotfix, lint-biome, lint-md, lint-package |

## Quick Start

```bash
pnpm add -D @regardio/dev
```

Extend the shared configs in your project:

```jsonc
// biome.jsonc
{ "extends": ["@regardio/dev/biome"] }

// tsconfig.json
{ "extends": "@regardio/dev/typescript/base.json" }
```

## Documentation

Detailed documentation is organized by topic:

### Concepts

- [AI Agents](./docs/en/agents.md) - Instructions for AI coding assistants
- [API](./docs/en/api.md) - API design and implementation guidelines
- [Coding](./docs/en/coding.md) - TypeScript, React, and general patterns
- [Commits](./docs/en/commits.md) - Conventional commits and changelog generation
- [Documentation](./docs/en/documentation.md) - Documentation structure and conventions
- [Naming](./docs/en/naming.md) - Consistent naming across languages
- [Principles](./docs/en/principles.md) - Code quality, architecture, maintainability
- [React](./docs/en/react.md) - React and TypeScript development patterns
- [SQL](./docs/en/sql.md) - PostgreSQL/Supabase schema styling and structure
- [Testing](./docs/en/testing.md) - Testing philosophy and patterns
- [Writing](./docs/en/writing.md) - Voice, tone, and language for content

### Toolchain

- [Biome](./docs/en/toolchain/biome.md) - Linting and formatting
- [Commitlint](./docs/en/toolchain/commitlint.md) - Commit message validation
- [Dependencies](./docs/en/toolchain/dependencies.md) - Safe dependency updates and supply-chain controls
- [Husky](./docs/en/toolchain/husky.md) - Git hooks
- [Markdownlint](./docs/en/toolchain/markdownlint.md) - Markdown quality
- [Playwright](./docs/en/toolchain/playwright.md) - End-to-end testing
- [Releases](./docs/en/toolchain/releases.md) - GitLab-flow-based versioning and releases
- [TypeScript](./docs/en/toolchain/typescript.md) - Strict TypeScript configuration
- [Vitest](./docs/en/toolchain/vitest.md) - Unit and integration testing

## Portability

While designed for Regardio projects, this toolchain follows well-established standards and can be adopted by any TypeScript project:

- All configs extend official tool presets
- No proprietary conventions or lock-in
- Standard npm package distribution
- MIT licensed

## License

MIT © [Regardio](https://regard.io)

## Acknowledgments

Built on the shoulders of giants: [Biome](https://biomejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/), [Vite](https://vitejs.dev/), and the entire open source ecosystem.
