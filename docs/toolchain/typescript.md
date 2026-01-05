# TypeScript Configuration

Strict TypeScript configuration for type-safe, maintainable code.

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

## Why Strict?

1. **Catch bugs at compile time** - Not at runtime in production
2. **Self-documenting code** - Types express intent
3. **Refactoring confidence** - Compiler catches breaking changes
4. **Better IDE support** - Accurate autocomplete and error detection

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

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [tsconfig Reference](https://www.typescriptlang.org/tsconfig)
