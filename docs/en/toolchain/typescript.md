---

title: TypeScript Configuration
type: guide
status: published
summary: TypeScript setup and configuration for Regardio projects
related: [biome, vitest]
locale: en-US
---

# TypeScript Configuration

Strict TypeScript configuration for type-safe, maintainable code.

## Impulse

TypeScript projects are easier to maintain when type expectations stay clear across packages and applications.

- Inconsistent compiler settings create surprising differences between projects
- Loose type checking hides mistakes until runtime
- Shared presets reduce repeated setup and review friction

## Signal

The most stable projects tend to treat TypeScript configuration as part of the architecture, not as a local convenience.

- Strict checking catches mistakes before code reaches production
- Separate presets help different project types keep a shared baseline
- Build-specific configuration keeps development and production concerns distinct

## Effect

We considered a few ways to define TypeScript usage.

- Per-project configuration allows flexibility, but it increases drift
- A single universal config is simple, but it does not fit every runtime equally well
- Shared presets with focused extensions balance consistency and practical differences

## Accord

We use strict shared TypeScript presets and keep project-specific configuration minimal and explicit.

- Extend from `@regardio/dev` presets instead of rebuilding config from scratch
- Separate build output concerns from day-to-day type checking
- Keep strict settings enabled so types remain trustworthy

## Action

Choose the preset that matches your project and apply the examples below as the starting point.

### Presets

| Preset | Use Case |
|--------|----------|
| `@regardio/dev/typescript/base.json` | Node.js packages, libraries |
| `@regardio/dev/typescript/react.json` | React applications and components |
| `@regardio/dev/typescript/build.json` | Build-specific settings (extends base) |

### Configuration

#### tsconfig.json

```json
{
  "extends": "@regardio/dev/typescript/base.json",
  "include": ["src/**/*.ts"]
}
```

For React projects:

```json
{
  "extends": "@regardio/dev/typescript/react.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

#### tsconfig.build.json

Separate build config for production output:

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

### Strict Settings

The base config enables strict TypeScript checking:

- `strict: true` - All strict type-checking options
- `noUncheckedIndexedAccess: true` - Adds `undefined` to index signatures
- `exactOptionalPropertyTypes: true` - Distinguishes between `undefined` and missing
- `noImplicitReturns: true` - All code paths must return a value
- `noFallthroughCasesInSwitch: true` - Prevents switch fallthrough bugs

### Scripts

```json
{
  "scripts": {
    "build": "exec-tsc --project tsconfig.build.json",
    "typecheck": "exec-tsc --noEmit"
  }
}
```

Run `typecheck` regularly during development to catch type errors early.

## Essence

This guide gives Regardio projects a shared TypeScript baseline.

- Types behave more predictably across packages and applications
- Build and development concerns stay easier to reason about
- Teams can review exceptions as explicit choices rather than inherited drift

Related documents:

- [Biome](./biome.md) — Linting and formatting
- [Vitest](./vitest.md) — Unit and integration testing for TypeScript projects

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [tsconfig Reference](https://www.typescriptlang.org/tsconfig)
