---

title: Markdownlint
type: guide
status: published
summary: Linting and formatting for Markdown files
related: [biome]
locale: en-US
---

# Markdownlint

Lints Markdown structure and formatting. Rules are centralized in `@regardio/dev`; use the `lint-md` wrapper instead of calling the tool directly.

## Configuration

Create `.markdownlint.json` in your package root:

```json
{
  "extends": "@regardio/dev/markdownlint"
}
```

## Scripts

```json
{
  "scripts": {
    "fix:md": "lint-md --fix \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\"",
    "lint:md": "lint-md \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\""
  }
}
```

## CLI Wrapper

Use `lint-md` instead of `markdownlint-cli2` directly:

```bash
lint-md "**/*.md"              # Check all Markdown files
lint-md --fix "**/*.md"        # Auto-fix issues
```

## Key Rules

| Rule | Description |
|------|-------------|
| MD001 | Heading levels increment by one |
| MD003 | Consistent heading style (ATX) |
| MD009 | No trailing spaces |
| MD012 | No multiple consecutive blank lines |
| MD022 | Headings surrounded by blank lines |
| MD032 | Lists surrounded by blank lines |
| MD041 | First line should be a top-level heading |

## Ignoring Rules

For specific files or sections:

```markdown
<!-- markdownlint-disable MD013 -->
This line can be very long without triggering a warning.
<!-- markdownlint-enable MD013 -->
```

Or in config for specific files:

```json
{
  "extends": "@regardio/dev/markdownlint",
  "ignores": ["CHANGELOG.md"]
}
```

Related documents:

- [Documentation](../standards/documentation.md) — Structure and conventions
- [Biome](./biome.md) — Fast, unified linting and formatting

### Resources

- [Markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
