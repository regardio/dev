# Biome

Fast, unified linting and formatting for JavaScript and TypeScript.

## Why Biome?

- **Speed** - 10-100x faster than ESLint + Prettier
- **Unified** - Single tool for linting and formatting
- **Zero config** - Sensible defaults out of the box
- **TypeScript-first** - Built with TypeScript in mind

## Configuration

Create `biome.jsonc` in your package root:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "extends": ["@regardio/dev/biome"]
}
```

## Scripts

```json
{
  "scripts": {
    "fix": "exec-p fix:*",
    "fix:biome": "lint-biome check --write --unsafe .",
    "lint": "exec-p lint:*",
    "lint:biome": "lint-biome check ."
  }
}
```

## CLI Wrapper

Use `lint-biome` instead of `biome` directly. This wrapper ensures consistent behavior across the monorepo.

```bash
lint-biome check .           # Check for issues
lint-biome check --write .   # Fix auto-fixable issues
lint-biome format .          # Format only
```

## Package.json Handling

The Biome preset excludes `package.json` files from processing. Instead, use `lint-package` which:

1. Sorts package.json using the well-known field order
2. Fixes exports condition order (`types` before `default` for TypeScript)

```bash
lint-package              # Sort package.json in current directory
lint-package path/to/pkg  # Sort specific package.json
```

This is automatically run as part of `pnpm fix`.

## Rule Categories

The preset enables rules across categories:

- **Correctness** - Catch bugs and incorrect code
- **Style** - Consistent code formatting
- **Complexity** - Prevent overly complex code
- **Performance** - Identify performance issues
- **Security** - Flag potential security vulnerabilities

## Ignoring Rules

When a rule genuinely doesn't apply, use inline comments:

```typescript
// biome-ignore lint/complexity/noForEach: forEach is clearer here for side effects
items.forEach(item => process(item));
```

Always include a reason explaining why the exception is necessary.

## Editor Integration

Install the Biome extension for your editor:

- **VS Code**: [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- **JetBrains**: Built-in support via settings

## Resources

- [Biome Documentation](https://biomejs.dev/)
- [Rules Reference](https://biomejs.dev/linter/rules/)
