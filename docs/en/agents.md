---

title: AI Agent Guidelines
type: guide
status: published
summary: Instructions for AI coding assistants working with Regardio projects
related: [coding-standards, react-standards, development-principles]
locale: en-US
---

# AI Agent Guidelines

Baseline expectations for AI coding assistants working in Regardio projects. Follow the linked standards — they apply equally to agent and human contributions.

## How Agents Should Work

- **Scope changes tightly** - Only change what the task requires. Do not refactor adjacent code, add features, or reorganize files unless asked.
- **Read before writing** - Understand existing patterns in the file and its neighbors before editing. Match the style you find.
- **Avoid unnecessary complexity** - Only implement what is explicitly required. Do not introduce abstractions, helpers, or utilities speculatively.
- **No emojis** - Unless explicitly requested.
- **Preserve comments and documentation** - Do not add or remove comments unless the task calls for it.
- **Explain uncertainty** - If something is ambiguous, say so rather than guessing.

## Implementation Workflow

When working on any non-trivial task, follow this sequence:

1. **Understand the business logic** — Gather context before writing code. Read relevant domain documents. Know what is actually needed; do not implement what was not asked for.
2. **Evaluate existing solutions** — Check for well-maintained libraries or utilities before writing custom code. Do not reinvent; do not introduce a dependency without verifying it exists and is actively maintained.
3. **Define tests first** — Identify what tests describe the expected behavior before implementing. Tests are a contract. Do not modify tests to make them pass.
4. **Implement with reusability in mind** — Prefer simple, readable code. Duplicate until a clear pattern emerges, then extract. Avoid speculative abstractions.
5. **Stop if it gets complicated** — Growing complexity despite good preparation is a signal. Surface the difficulty, reconsider the approach, and back out rather than pushing through.
6. **Document intent, stay lean** — Comments explain *why*, not *what*. Check existing documentation and business logic context before starting work.

## Standards

- [Coding Standards](./standards/coding.md) — TypeScript, React, and general coding patterns
- [React and TypeScript Standards](./standards/react.md) — Component, hook, and state patterns
- [SQL Schema Standards](./standards/sql.md) — PostgreSQL naming, structure, and access control
- [Development Principles](./standards/principles.md) — Code quality, architecture, security
- [API Standards](./standards/api.md) — API design and implementation
- [Naming Conventions](./standards/naming.md) — Naming across TypeScript, SQL, CSS, Git
- [Testing Approach](./standards/testing.md) — Testing philosophy and patterns
- [Commit Conventions](./standards/commits.md) — Conventional commits and changelog generation
- [Documentation Standard](./standards/documentation.md) — Document structure and conventions
- [Writing](./standards/writing.md) — Voice, tone, and language

## Commands

```bash
pnpm fix        # Fix and lint everything
pnpm lint       # Lint only
pnpm test       # Run tests
pnpm typecheck  # Type check
```

Run `typecheck` and `lint` before marking a task complete.
