---

title: Commitlint
type: guide
status: published
summary: Enforce conventional commit messages
related: [husky]
locale: en-US
---

# Commitlint

Enforce conventional commit messages for consistent changelogs.

## Impulse

Commit history becomes harder to trust when message structure depends on memory or individual preference.

- Inconsistent commit subjects weaken changelogs and release notes
- Different local habits make git history harder to scan
- Shared validation reduces review friction around commit style

## Signal

Commit messages do more than label a change. They shape release automation and help future readers understand what happened.

- A consistent type system makes history easier to search
- Automated tooling depends on predictable commit structure
- Clear commit messages improve communication across teams and time

## Effect

There are a few plausible ways to handle commit conventions.

- A written convention without enforcement is easy to adopt, but it drifts quickly
- Fully local team conventions can work, but they do not travel well across repositories
- Shared validation gives enough structure to keep history coherent without expanding review overhead

## Accord

We use Commitlint to keep commit messages aligned with the conventional format across Regardio projects.

- Keep the rules centralized in `@regardio/dev`
- Use automation to validate format at the edge of the workflow
- Treat commit subjects as public project history, not private notes

### Why Commitlint?

- **Consistent history** - Readable, searchable git log
- **Automated changelogs** - Generate release notes from commits
- **Clear communication** - Commit type conveys intent
- **CI integration** - Reject non-conforming commits

## Action

Configure Commitlint at the workspace root and use the format and examples below as the baseline.

### Configuration

At the workspace root, create `.commitlintrc.json`:

```json
{
  "extends": ["@regardio/dev/commitlint"]
}
```

Or use a JavaScript config:

```javascript
// commitlint.config.cjs
module.exports = require('@regardio/dev/commitlint');
```

### Commit Format

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Other changes (tooling, etc.) |
| `revert` | Revert a previous commit |

#### Examples

```bash
feat: add user authentication
fix: resolve login redirect loop
docs: update API documentation
refactor: simplify payment processing
test: add unit tests for date utilities
chore: update dependencies
feat(auth): implement OAuth2 flow
fix(api): handle null response gracefully
```

### Rules

The preset enforces:

- **Header max length**: 100 characters
- **Body leading blank**: Blank line before body
- **Footer leading blank**: Blank line before footer
- **Type enum**: Must be one of the allowed types

### Git Hooks

Commitlint runs automatically via Husky on commit. See [Husky](./husky.md) for setup.

## Essence

This guide gives commit history a shared shape that supports both people and automation.

- Changelogs stay easier to generate and trust
- Teams can read git history with less guesswork
- Commit conventions become a stable habit instead of an occasional reminder

Related documents:

- [Commit Conventions](../commits.md) — Conventional commits and changelog generation
- [Husky](./husky.md) — Git hooks for quality gates

### Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
