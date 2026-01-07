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
| **Workflow** | Husky, Changesets |
| **CLI utilities** | exec-clean, exec-p, exec-s, exec-ts, flow-release, lint-biome, lint-md, lint-package |

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

- [Development Principles](./docs/concepts/development-principles.md) - Code quality, architecture, maintainability
- [Coding Standards](./docs/concepts/coding-standards.md) - TypeScript, React, and general patterns
- [Naming Conventions](./docs/concepts/naming-conventions.md) - Consistent naming across languages
- [Commit Conventions](./docs/concepts/commits.md) - Conventional commits and changelog generation
- [Testing Approach](./docs/concepts/testing.md) - Testing philosophy and patterns
- [AI Agent Guidelines](./docs/concepts/ai-agents.md) - Instructions for AI coding assistants

### Toolchain

- [TypeScript](./docs/toolchain/typescript.md) - Strict TypeScript configuration
- [Biome](./docs/toolchain/biome.md) - Linting and formatting
- [Vitest](./docs/toolchain/vitest.md) - Unit and integration testing
- [Playwright](./docs/toolchain/playwright.md) - End-to-end testing
- [Commitlint](./docs/toolchain/commitlint.md) - Commit message validation
- [Markdownlint](./docs/toolchain/markdownlint.md) - Markdown quality
- [Husky](./docs/toolchain/husky.md) - Git hooks
- [Changesets](./docs/toolchain/changesets.md) - Versioning and releases

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
