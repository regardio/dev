# AI Coding Agent Guidelines

**Instructions for AI coding assistants working with Regardio projects.**

This document provides universal guidance for Claude, Codex, Cursor, Windsurf, Gemini, and other
AI coding agents. Project-specific context should be documented separately.

## Core Principles

Follow the [Development Principles](./development-principles.md) and [Naming Conventions](./naming-conventions.md).
Key points for AI agents:

- **Write clean, explicit TypeScript** - Avoid `any`, use strict mode
- **Avoid obvious comments** - Code should be self-documenting
- **Avoid unnecessary complexity** - Only implement what's explicitly required
- **Use implicit type inference** - Unless impossible
- **Handle errors gracefully** - Use try/catch with appropriate error types
- **No emojis** - Unless explicitly requested

## TypeScript Standards

### Type Safety

- Enable strict TypeScript type checking
- Define explicit interfaces for data structures
- Avoid `any` type except when absolutely necessary
- Use proper type assertions when needed

### Code Structure

- Group related functionality in modules
- **Use explicit exports in package.json** rather than barrel files
- Keep modules focused on single responsibility
- Extract common logic into utility functions

### Function Design

- Write small, focused functions
- Use proper parameter typing
- Implement proper error handling
- Return explicit types

## React Standards

### Components

- Use functional components with hooks
- Create small, focused components with single responsibility
- Define explicit prop interfaces with TypeScript
- Prefer composition over inheritance

### Hooks

- Provide proper dependency arrays for `useEffect` and `useMemo`
- Extract reusable logic into custom hooks (follow `use` naming convention)
- Implement proper cleanup in `useEffect`
- **`useEffect` is a code smell** - Avoid if possible, justify when used

### State

- Keep state as close to its usage as possible
- Prefer single state object over many separate `useState` calls
- Use `useReducer` for complex state logic

### Testing

- Add `data-test` attributes for E2E tests where appropriate

## SQL / Database Standards

### Naming

- Use `snake_case` for all database identifiers
- Prefix function parameters with `p_`, local variables with `v_`
- Use descriptive names that reflect purpose

### Structure

- Write focused, single-purpose functions
- Implement proper error handling
- Document function behavior with comments
- Follow multi-tenancy patterns where applicable

## Code Quality Commands

```bash
pnpm lint          # Run all linting
pnpm typecheck     # TypeScript type checking
pnpm test          # Run tests
```

Run `typecheck` regularly. Run linting when task is complete.

## Build & Development

```bash
pnpm dev           # Start development servers
pnpm build         # Build all packages
pnpm generate      # Code generation tasks
```

## Security

- Avoid security vulnerabilities (XSS, SQL injection, OWASP Top 10)
- Implement proper validation at system boundaries
- Use proper access control patterns
- Never hardcode secrets or API keys

## Documentation

- Document complex logic with comments
- Use JSDoc for TypeScript functions when helpful
- Keep README files updated
