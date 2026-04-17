---

title: TypeScript Configuration
type: guide
status: published
summary: TypeScript setup and configuration for Regardio projects
related: [biome, vitest]
locale: en-US
---

# TypeScript Configuration

Strict shared TypeScript presets for Regardio projects. Extend from `@regardio/dev` instead of rebuilding config from scratch. Keep strict settings enabled.

## Presets

| Preset | Use Case |
|--------|----------|
| `@regardio/dev/typescript/base.json` | Node.js packages, libraries |
| `@regardio/dev/typescript/react.json` | React applications and components |
| `@regardio/dev/typescript/build.json` | Build-specific settings (extends base) |

## Configuration

### tsconfig.json

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

### tsconfig.build.json

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

## Strict Settings

The base config enables strict TypeScript checking:

- `strict: true` - All strict type-checking options
- `noUncheckedIndexedAccess: true` - Adds `undefined` to index signatures
- `exactOptionalPropertyTypes: true` - Distinguishes between `undefined` and missing
- `noImplicitReturns: true` - All code paths must return a value
- `noFallthroughCasesInSwitch: true` - Prevents switch fallthrough bugs

## Scripts

```json
{
  "scripts": {
    "build": "exec-tsc --project tsconfig.build.json",
    "typecheck": "exec-tsc --noEmit"
  }
}
```

Run `typecheck` regularly during development to catch type errors early.

Related documents:

- [Biome](./biome.md) — Linting and formatting
- [Vitest](./vitest.md) — Unit and integration testing for TypeScript projects

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [tsconfig Reference](https://www.typescriptlang.org/tsconfig)
