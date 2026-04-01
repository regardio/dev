---

title: Biome
type: guide
status: published
summary: Fast, unified linting and formatting for JavaScript and TypeScript
related: [typescript, markdownlint]
locale: en-US
---

# Biome

Fast, unified linting and formatting for JavaScript and TypeScript.

## Context

This guide begins with the tension it responds to: code quality checks are easiest to trust when formatting and linting stay consistent across packages.

- Separate tools for formatting and linting increase configuration drift
- Slow feedback loops make quality checks easier to postpone
- Shared defaults help teams keep code review focused on behavior rather than style

## Rationale

From there, the guide points to the observations that make Biome useful in practice.

- A single tool can cover common formatting and linting needs
- Fast execution supports regular local checks
- A shared wrapper keeps behavior stable across the monorepo

## Considerations

These observations open a few plausible ways to approach code quality checks.

- Combining many independent tools gives flexibility, but it increases maintenance effort
- Project-specific setups can fit local preferences, but they fragment the developer experience
- A shared Biome preset creates a common baseline with less repeated configuration

## Decision

This guide then makes the direction explicit so readers can see what we are choosing and why.

- Keep configuration centralized through `@regardio/dev`
- Use wrapper commands so packages behave consistently
- Let package-specific exceptions remain explicit and rare

## Implementation

With that direction in place, the remainder of the document shows how to apply it in day-to-day work.

### Why Biome?

- **Speed** - 10-100x faster than ESLint + Prettier
- **Unified** - Single tool for linting and formatting
- **Zero config** - Sensible defaults out of the box
- **TypeScript-first** - Built with TypeScript in mind

### Configuration

Create `biome.jsonc` in your package root:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "extends": ["@regardio/dev/biome"]
}
```

### Scripts

```json
{
  "scripts": {
    "fix": "exec-s fix:pkg fix:md fix:biome",
    "fix:biome": "lint-biome check --write --unsafe .",
    "lint": "exec-s lint:md lint:biome",
    "lint:biome": "lint-biome check ."
  }
}
```

### CLI Wrapper

Use `lint-biome` instead of `biome` directly. This wrapper ensures consistent behavior across the monorepo.

```bash
lint-biome check .           # Check for issues
lint-biome check --write .   # Fix auto-fixable issues
lint-biome format .          # Format only
```

### Package.json Handling

The Biome preset excludes `package.json` files from processing. Instead, use `lint-package` which:

1. Sorts package.json using the well-known field order
2. Fixes exports condition order (`types` before `default` for TypeScript)

```bash
lint-package              # Sort package.json in current directory
lint-package path/to/pkg  # Sort specific package.json
```

This is automatically run as part of `pnpm fix`.

### Rule Categories

The preset enables rules across categories:

- **Correctness** - Catch bugs and incorrect code
- **Style** - Consistent code formatting
- **Complexity** - Prevent overly complex code
- **Performance** - Identify performance issues
- **Security** - Flag potential security vulnerabilities

### Ignoring Rules

When a rule genuinely doesn't apply, use inline comments:

```typescript
// biome-ignore lint/complexity/noForEach: forEach is clearer here for side effects
items.forEach(item => process(item));
```

Always include a reason explaining why the exception is necessary.

### Editor Integration

Install the Biome extension for your editor:

- **VS Code**: [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- **JetBrains**: Built-in support via settings

## References

- [Biome Documentation](https://biomejs.dev/)
- [Rules Reference](https://biomejs.dev/linter/rules/)
