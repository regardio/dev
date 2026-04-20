---

title: "@regardio/dev — Claude Context"
type: guide
status: published
summary: Entry point for Claude when working on universal standards and toolchain
locale: en-US
---

# @regardio/dev — Claude Context

## What This Is

`@regardio/dev` is the **universal standards hub** for the Regardio workspace. Everything in `docs/en/` applies across all projects unless explicitly overridden. When another repo (ensemble, channels, packages/*) documents a standard, it builds on this one — it does not replace it.

## Authority

These docs are the **single source of truth** for:

- Coding patterns (TypeScript, React, general)
- Naming, commits, writing voice
- API, SQL, testing standards
- Toolchain configuration (Biome, Vitest, Playwright, TypeScript, etc.)

If you find a standard contradicted elsewhere, this file wins. Flag the contradiction.

## Structure

```text
docs/en/
├── agents.md              # AI assistant instructions (the full version)
├── standards/             # Universal rules — 11 files (coding, naming, api, sql, testing, writing, ...)
└── tools/                 # Toolchain configuration — 9 files (biome, typescript, vitest, ...)
```

## When You're Here

You're probably doing one of:

- Editing a standard or toolchain config → update the relevant file in `docs/en/` and the root `README.md` index if you add or remove a document
- Adding a new preset (e.g. biome, tsconfig) → place under the package root, document it in `docs/en/tools/*.md`, extend from `@regardio/dev/<preset>`
- Consuming a standard from elsewhere → link to `packages/dev/docs/en/...`, not `docs/concepts/...` (that path no longer exists)

## Canonical Paths (Use These in Links)

From other repos, link using the full path from meta-repo root:

```text
packages/dev/docs/en/standards/{coding,naming,commits,api,sql,testing,react,writing,principles,documentation}.md
packages/dev/docs/en/tools/{biome,typescript,vitest,playwright,commitlint,husky,markdownlint,releases,dependencies}.md
```

Legacy `docs/concepts/` and `docs/en/toolchain/` paths no longer exist.

## Quick Reference

See [docs/en/README.md](./docs/en/README.md) for the full index, commands, and preset-extension snippets.
