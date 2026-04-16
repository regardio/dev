---

title: AI Agent Guidelines
type: guide
status: published
summary: Instructions for AI coding assistants working with Regardio projects
related: [coding-standards, react-standards, development-principles]
locale: en-US
---

# AI Agent Guidelines

Instructions for AI coding assistants working with Regardio projects.

## Impulse

AI coding assistants are most helpful when they work from shared project expectations instead of improvising repository conventions.

- Agent output can drift quickly without clear standards
- Small inconsistencies compound when assistants touch many files and technologies
- Shared guidance helps agents support the project without becoming disruptive

## Signal

Agent work is not separate from normal engineering work. It changes code, docs, tests, and release quality in the same system.

- Type safety, code structure, and error handling matter as much for agent-written code as for human-written code
- React, SQL, testing, and security patterns need to remain consistent across contributions
- Documentation and commit quality shape how maintainable agent work stays over time

## Effect

There are several ways to guide AI assistants.

- Very generic prompts are flexible, but they do not anchor repo-specific expectations
- Highly detailed per-task instructions can work, but they are hard to repeat consistently
- A shared project guide gives agents a stable baseline while still leaving room for task-specific direction

## Accord

We use a shared set of agent guidelines so AI assistants work within Regardio's coding, testing, and documentation standards.

- Prefer explicit, maintainable TypeScript
- Keep changes focused on what the task actually requires
- Treat security, testing, and documentation as part of the same quality bar

## Action

Use the guidance below when an AI assistant writes, edits, reviews, or explains code in Regardio projects. For detailed coding, naming, testing, and tooling standards, follow the linked documents.

### How Agents Should Work

- **Scope changes tightly** - Only change what the task requires. Do not refactor adjacent code, add features, or reorganize files unless asked.
- **Read before writing** - Understand existing patterns in the file and its neighbors before editing. Match the style you find.
- **Avoid unnecessary complexity** - Only implement what is explicitly required. Do not introduce abstractions, helpers, or utilities speculatively.
- **No emojis** - Unless explicitly requested.
- **Preserve comments and documentation** - Do not add or remove comments unless the task calls for it.
- **Explain uncertainty** - If something is ambiguous, say so rather than guessing.

### Standards to Follow

Agents are expected to follow the same standards as human contributors. These are documented separately:

- [Coding Standards](./coding/coding.md) — TypeScript, React, and general coding patterns
- [React and TypeScript Standards](./coding/react.md) — Component, hook, and state patterns
- [SQL Schema Standards](./coding/sql.md) — PostgreSQL naming, structure, and access control
- [Development Principles](./coding/principles.md) — Code quality, architecture, security
- [API Standards](./coding/api.md) — API design and implementation
- [Naming Conventions](./conventions/naming.md) — Naming across TypeScript, SQL, CSS, Git
- [Testing Approach](./conventions/testing.md) — Testing philosophy and patterns
- [Commit Conventions](./conventions/commits.md) — Conventional commits and changelog generation
- [Documentation Standard](./conventions/documentation.md) — Document structure and conventions
- [Writing](./conventions/writing.md) — Voice, tone, and language

### Commands

```bash
pnpm build         # Build all packages
pnpm dev           # Start development
pnpm fix           # Run all fixes and linting
pnpm lint          # Run linting only
pnpm test          # Run tests
pnpm typecheck     # TypeScript type checking
```

Run `typecheck` regularly. Run linting when task is complete.

## Essence

This guide gives AI assistants a project-specific baseline for writing and editing code in Regardio.

- Agent output stays closer to the same standards as human work
- Reviewers can expect a more consistent level of code quality
- Repository conventions remain visible instead of being rediscovered task by task

All related documents are listed in the [Standards to Follow](#standards-to-follow) section above.
