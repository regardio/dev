---

title: Markdownlint
type: guide
status: published
summary: Linting and formatting for Markdown files
related: [biome]
locale: en-US
---

# Markdownlint

Consistent, readable Markdown documentation.

## Impulse

Documentation becomes harder to trust when Markdown structure and formatting drift between files.

- Inconsistent headings and spacing make documents harder to scan
- Formatting noise creates avoidable review work
- Shared Markdown rules help documentation feel coherent across repositories

## Signal

Markdownlint helps surface the small structural issues that accumulate over time.

- Automated checks catch common formatting mistakes early
- Shared rules improve readability without depending on personal editor habits
- A wrapper command keeps usage consistent across packages

## Effect

We considered a few ways to keep Markdown healthy.

- Manual review can catch many issues, but it is uneven and repetitive
- Local formatting preferences are flexible, but they weaken consistency
- A shared linting baseline keeps documents predictable while still allowing explicit exceptions

## Accord

We use Markdownlint as the default quality check for Markdown files in Regardio projects.

- Keep the baseline rules centralized in `@regardio/dev`
- Use wrapper commands instead of direct tool calls where possible
- Make exceptions explicit when a document genuinely needs them

## Action

Adopt the shared configuration and scripts below so Markdown checks run the same way everywhere.

### Why Markdownlint?

- **Consistency** - Uniform formatting across all docs
- **Readability** - Clean, well-structured Markdown
- **Compatibility** - Works with all Markdown renderers
- **Automation** - Catch issues before commit

### Configuration

Create `.markdownlint.json` in your package root:

```json
{
  "extends": "@regardio/dev/markdownlint"
}
```

### Scripts

```json
{
  "scripts": {
    "fix:md": "lint-md --fix \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\"",
    "lint:md": "lint-md \"**/*.md\" \"**/*.mdx\" \"!**/node_modules/**\" \"!**/dist/**\""
  }
}
```

### CLI Wrapper

Use `lint-md` instead of `markdownlint-cli2` directly:

```bash
lint-md "**/*.md"              # Check all Markdown files
lint-md --fix "**/*.md"        # Auto-fix issues
```

### Key Rules

| Rule | Description |
|------|-------------|
| MD001 | Heading levels increment by one |
| MD003 | Consistent heading style (ATX) |
| MD009 | No trailing spaces |
| MD012 | No multiple consecutive blank lines |
| MD022 | Headings surrounded by blank lines |
| MD032 | Lists surrounded by blank lines |
| MD041 | First line should be a top-level heading |

### Ignoring Rules

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

## Essence

This guide gives Markdown documentation a shared structural baseline.

- Files stay easier to read and review
- Formatting differences become automated checks instead of repeated discussion
- Exceptions remain intentional and visible in the source

Related documents:

- [Documentation Standard](../documentation.md) — Template and standard for Regardio
  documentation following the six-step structure
- [Biome](./biome.md) — Fast, unified linting and formatting

### Resources

- [Markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)
