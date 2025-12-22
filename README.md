# @regardio/dev

Developer tooling for testing, linting, and build workflows in Regardio projects.

## Philosophy

We believe in **balanced strictness**: rigorous enough to catch bugs early and maintain consistency, yet practical enough to not impede development velocity.

### Strict by Default

- **TypeScript strict mode** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- **Comprehensive linting** via Biome for code quality, style, and complexity
- **Conventional commits** enforced through commitlint
- **Automated testing** as a first-class concern

### Practical in Application

Strictness serves developers, not the other way around. Our approach:

- **Sensible defaults** - Shared configs that work out of the box
- **Minimal boilerplate** - Extend presets, override only what's necessary
- **Fast feedback** - Quick linting and type checking during development
- **Clear exceptions** - When rules don't apply, document why with `// biome-ignore` or `@ts-expect-error`

### The Balance

We optimize for:

1. **Catching bugs before they ship** - Strict types prevent runtime errors
2. **Readable, maintainable code** - Consistent style reduces cognitive load
3. **Developer experience** - Tools should help, not hinder
4. **Team velocity** - Shared understanding through enforced conventions

Exceptions are allowed but must be intentional and documented. The goal is code that's correct, consistent, and a pleasure to work with.

## What's inside

- **CLI bins**: exec-clean, exec-husky, exec-p, exec-s, exec-ts, exec-tsc, lint-biome, lint-commit, lint-md
- **Config presets**: Biome, Commitlint, Markdownlint, TypeScript (base/react)
- **Testing configs**: Vitest (node/react), Playwright base config, Testing Library setup
- **Dev dependencies**: All commonly needed testing and linting packages bundled
- **[Developer Documentation](./docs/README.md)**: Foundational principles, testing philosophy, naming conventions

## Install

```bash
pnpm add -D @regardio/dev
```

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts (Node.js package)
import { defineConfig } from 'vitest/config';
import { vitestNodeConfig } from '@regardio/dev/vitest/node';

export default defineConfig({ test: vitestNodeConfig });
```

```typescript
// vitest.config.ts (React package)
import { defineConfig } from 'vitest/config';
import { vitestReactConfig } from '@regardio/dev/vitest/react';

export default defineConfig({ test: vitestReactConfig });
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { buildPlaywrightBaseConfig } from '@regardio/dev/playwright';

export default defineConfig(
  buildPlaywrightBaseConfig({
    appPort: 5100,
    appUrl: 'http://localhost:5100',
    devices,
    webServerCommand: 'vite preview',
  }),
);
```

### Testing Library Setup

For React packages, create a `src/test-setup.ts`:

```typescript
import '@regardio/dev/testing/setup-react';
```

## Config Presets

- **Biome**: `"extends": ["@regardio/dev/biome"]`
- **TypeScript**: `@regardio/dev/typescript/base.json`, `@regardio/dev/typescript/react.json`
- **Commitlint**: `module.exports = require('@regardio/dev/commitlint');`
- **Markdownlint**: `"extends": "@regardio/dev/markdownlint"`

## Scripts (examples)

```json
{
  "scripts": {
    "fix": "exec-p fix:*",
    "fix:biome": "lint-biome check --write --unsafe .",
    "fix:md": "lint-md --fix \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\"",
    "lint": "exec-p lint:*",
    "lint:biome": "lint-biome check .",
    "lint:md": "lint-md \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\"",
    "prepare": "exec-husky",
    "test": "exec-p test:*",
    "test:e2e": "playwright test",
    "test:unit": "vitest run",
  }
}
```

## Local Config Files

Each package needs a few local config files that extend the shared presets. Here's the minimal setup:

### Required Files

All config files should be placed in the **package root** (same level as `package.json`):

| File | Purpose | Extends |
|------|---------|---------|
| `tsconfig.json` | TypeScript base config | `@regardio/dev/typescript/base.json` or `react.json` |
| `tsconfig.build.json` | Build-specific config | `./tsconfig.json` + `@regardio/dev/typescript/build.json` |
| `biome.jsonc` | Linting and formatting | `@regardio/dev/biome` |
| `.commitlintrc.json` | Commit message linting | `@regardio/dev/commitlint` (workspace root only) |
| `.markdownlint.jsonc` | Markdown linting | `@regardio/dev/markdownlint` |
| `vitest.config.ts` | Unit test config | Uses `vitestNodeConfig` or `vitestReactConfig` |
| `playwright.config.ts` | E2E test config | Uses `buildPlaywrightBaseConfig` |
| `.hintrc` | webhint config (optional) | `development` preset |

### File Naming Conventions

- **JSON configs**: Use the standard names expected by each tool
  - `.commitlintrc.json` (not `commitlint.config.json`)
  - `.markdownlint.jsonc` (supports comments)
  - `biome.jsonc` (supports comments, Biome also accepts `biome.json`)
- **TypeScript configs**: Always `tsconfig*.json`
- **Test configs**: `vitest.config.ts`, `playwright.config.ts`
- **Hidden files**: Prefix with `.` for tool-specific configs (`.hintrc`, `.editorconfig`)

### Workspace Root vs Package Root

| Location | Files |
|----------|-------|
| **Workspace root** | `.editorconfig`, `.commitlintrc.json`, `.gitignore`, AI agent configs |
| **Each package** | `tsconfig.json`, `tsconfig.build.json`, `biome.jsonc`, `.markdownlint.jsonc`, test configs |

### Example: tsconfig.json (Node.js package)

```json
{
  "extends": "@regardio/dev/typescript/base.json",
  "include": ["src/**/*.ts"]
}
```

### Example: tsconfig.build.json

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "extends": ["./tsconfig.json", "@regardio/dev/typescript/build.json"],
  "include": ["src/**/*.ts"]
}
```

### Example: biome.jsonc

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "extends": ["@regardio/dev/biome"]
}
```

## Code Quality Philosophy

### Strictness by Default

We enforce strict checks across the codebase:

- **TypeScript**: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **Biome**: Comprehensive lint rules for correctness, style, and complexity
- **Commits**: Conventional commit format enforced via commitlint

### Why So Strict?

1. **Catch bugs early** - Strict type checking prevents entire categories of runtime errors
2. **Consistent codebase** - Uniform style reduces cognitive load when reading code
3. **Self-documenting** - Explicit types and patterns make intent clear
4. **Refactoring confidence** - Strong types enable safe, large-scale changes

### Exceptions: Few and Intentional

We allow very few exceptions, and each must be justified:

- **`// biome-ignore`** - Only when the rule genuinely doesn't apply, don't use it just to make the linter happy. Always add a comment explaining why the exception is necessary.
- **`@ts-expect-error`** - Only for known TypeScript limitations with an explanatory comment. Always include a reason for the exception.
- **`eslint-disable`** - We don't use ESLint directly; all linting is handled by Biome. If you encounter an ESLint rule that needs to be disabled, discuss it with the team first and document the reasoning.

The goal is balance: strict enough to prevent bugs, flexible enough to not block legitimate patterns.

## Editor & AI Configuration

### EditorConfig

Create `.editorconfig` at the workspace root:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = tab
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
indent_style = space
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_style = space
```

### AI Agent Configuration

These files help AI coding assistants understand project conventions.

#### Claude (CLAUDE.md)

```markdown
# Project Guidelines

## Code Style
- Use TypeScript with strict mode
- Follow Biome formatting (tabs, no semicolons where optional)
- Prefer functional patterns over classes

## Testing
- Unit tests with Vitest, E2E with Playwright
- Test files: `*.test.ts` or `*.test.tsx`

## Commits
- Use conventional commits: `feat:`, `fix:`, `docs:`, etc.
```

#### Gemini (.gemini/settings.json)

```json
{
  "codeStyle": {
    "language": "typescript",
    "formatter": "biome",
    "indentation": "tabs"
  },
  "testing": {
    "framework": "vitest",
    "e2e": "playwright"
  }
}
```

#### Windsurf (.windsurf/rules.md)

```markdown
# Windsurf Rules

- Extend shared configs from `@regardio/dev`
- Use `pnpm` for package management
- Follow conventional commits
- Prefer minimal, focused edits
```

#### Cursor (.cursor/rules.md)

```markdown
# Cursor Rules

## Project Structure
- Monorepo with pnpm workspaces
- Shared tooling in `packages/dev`

## Coding Standards
- TypeScript strict mode
- Biome for linting and formatting
- Vitest for unit tests, Playwright for E2E

## Workflow
- Run `pnpm lint` before committing
- Use conventional commit messages
```

## Bundled Dependencies

When you add `@regardio/dev` as a dev dependency, you get access to:

- **Testing**: vitest, @vitest/ui, @playwright/test, @testing-library/react, @testing-library/jest-dom, jsdom
- **Linting**: @biomejs/biome, markdownlint-cli2, @commitlint/cli
- **Build**: typescript, tsx, vite, husky
- **Release**: @changesets/cli for versioning and publishing

## Releasing

This package uses [Changesets](https://github.com/changesets/changesets) for versioning and npm publishing.

### Adding a Changeset

When making changes that should be released:

```bash
pnpm changeset
```

### Automated Release (GitHub Action)

When changesets are merged to `main`:

1. A "Version Packages" PR is created with updated version and CHANGELOG
2. Merging that PR publishes to npm

### Manual Release

```bash
pnpm version    # Update version and CHANGELOG
pnpm build      # Build the package
pnpm release    # Publish to npm
```

---

## License

MIT © [Regardio](https://regard.io)

## Contact

- **Website**: [regard.io](https://regard.io)
- **GitHub**: [@regardio](https://github.com/regardio)
- **Email**: [bernd.matzner@regard.io](mailto:bernd.matzner@regard.io)

## Acknowledgments

This project stands on the shoulders of giants. We're deeply grateful to the Open Source community and the maintainers of the tools that make this possible:

- [Biome](https://biomejs.dev/) - The Biome team
- [commitlint](https://commitlint.js.org/) - The commitlint team
- [Husky](https://typicode.github.io/husky/) - typicode and contributors
- [markdownlint](https://github.com/DavidAnson/markdownlint) - David Anson and contributors
- [Playwright](https://playwright.dev/) - Microsoft
- [pnpm](https://pnpm.io/) - Zoltan Kochan and contributors
- [React](https://react.dev/) - Meta and contributors
- [TypeScript](https://www.typescriptlang.org/) - Microsoft and contributors
- [Vite](https://vitejs.dev/) - Evan You and the Vite team
- [Vitest](https://vitest.dev/) - Anthony Fu and the Vitest team

And countless other projects that form the foundation of modern web development. Thank you for sharing your work with the world. 💚
