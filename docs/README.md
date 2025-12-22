# Developer Documentation

**Foundational development standards for Regardio projects.**

This documentation covers universal principles, conventions, and practices that apply across all
Regardio codebases. For project-specific implementation details, see the respective project
documentation.

## Documents

| Document | Description |
|----------|-------------|
| [Development Principles](./development-principles.md) | Universal coding standards: code quality, architecture, error handling, security |
| [Testing Philosophy](./testing-philosophy.md) | Testing strategy, patterns, and best practices |
| [Naming Conventions](./naming-conventions.md) | Consistent naming patterns for TypeScript, SQL, CSS, Git |
| [AI Agent Guidelines](./ai-agents.md) | Instructions for Claude, Codex, Cursor, Windsurf, Gemini |

## Quick Reference

### For New Developers

1. Read [Development Principles](./development-principles.md) for foundational standards
2. Review [Naming Conventions](./naming-conventions.md) for consistent code style
3. Understand [Testing Philosophy](./testing-philosophy.md) for quality assurance approach

### For AI Coding Agents

Read [AI Agent Guidelines](./ai-agents.md) for comprehensive instructions. Key points:

- **TypeScript**: Strict mode, avoid `any`, functional patterns, camelCase
- **SQL**: snake_case naming, `p_` parameter prefixes, `v_` local variables
- **React**: Functional components, avoid `useEffect`, single state objects
- **Testing**: Business logic validation, Arrange-Act-Assert, descriptive names
- **Git**: Conventional commits, kebab-case branch names

## Tooling

For configuration presets and CLI utilities, see the main [@regardio/dev README](../README.md).
