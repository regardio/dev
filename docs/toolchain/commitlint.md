# Commitlint

Enforce conventional commit messages for consistent changelogs.

## Why Commitlint?

- **Consistent history** - Readable, searchable git log
- **Automated changelogs** - Generate release notes from commits
- **Clear communication** - Commit type conveys intent
- **CI integration** - Reject non-conforming commits

## Configuration

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

## Commit Format

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

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

### Examples

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

## Rules

The preset enforces:

- **Header max length**: 100 characters
- **Body leading blank**: Blank line before body
- **Footer leading blank**: Blank line before footer
- **Type enum**: Must be one of the allowed types

## Git Hooks

Commitlint runs automatically via Husky on commit. See [Husky](./husky.md) for setup.

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
