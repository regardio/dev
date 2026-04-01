---

title: Documentation Standard
type: concept
status: published
summary: Template and standard for Regardio documentation following System structure
related: [coding-standards, development-principles]
locale: en-US
---

# Documentation Standard

Template for Regardio documentation. Replace placeholder text with actual content.

## Context

What problem is this document attempting to solve?

- The problem or tension this document addresses
- Why this problem matters
- Who this serves and when it becomes relevant

## Rationale

What ideas have we pondered to resolve the problem?

- The ideas, thoughts, or lines of inquiry explored
- What was shared, discussed, or surfaced
- How these ideas helped clarify the problem

## Considerations

What options have we taken into account?

- The possible options or responses considered
- Trade-offs between the options
- What each option would change or enable

## Decision

What conclusion have we reached?

- The chosen direction
- The reasoning for choosing it
- The boundaries and constraints of the decision

## Implementation

How do we act upon our decision? What needs to be done to implement this?

### Frontmatter Template

```yaml
---
title: Document Title
type: entity | concept | architecture | decision | guide
status: draft | active | deprecated
id: 300  # For entities only
alias: en  # For entities only
summary: Brief one-line description
related: [entity1, entity2]  # Related documents
locale: en-US | de-DE
---
```

**Required:** `title`, `type`, `summary`
**Optional:** `status`, `id`, `alias`, `related`, `locale`

### Structure Patterns

Documentation follows the six Steps of the Regardio System:

1. **Impulse** - What problem is this document attempting to solve?
2. **Signal** - What ideas have we pondered to resolve the problem?
3. **Effect** - What options have we considered?
4. **Accord** - What decision have we made?
5. **Action** - How do we act upon our decision? What needs to be done to implement this?
6. **Essence** - What solution does this provide? What provides assurance this works?

### Writing Style

Follow System style guides:

- Derive, don't describe - show how thoughts connect
- Observe, don't prescribe - describe patterns, not rules
- Use concrete language over abstractions
- Avoid: must, revolutionary, potential, leverage, optimize
- Prefer: notice, explore, might, could, pattern, rhythm
- **Bold** for System terms at first introduction
- *Italic* for emphasis or foreign language equivalents
- Code blocks with language identifiers
- Tables for structured comparisons
- No emojis

## References

What solution does this provide? What provides assurance this works?

- The resulting solution or outcome
- Why this resolves the problem well
- What provides confidence or assurance that it works
- Remaining implications, follow-up, or proof points

### Cross-References

- Link to related entities: `[Entity](./entity.md)`
- Reference schemas: `` [`path/to/schema.sql`](path) ``
- Include language alternates: `*[Deutsch](../de/file.md)*`
- Reference System docs: `[Field](../../../../packages/system/docs/en/field.md)`

### Related Documents

- [Coding](./coding.md) - TypeScript and React patterns
- [Principles](./principles.md) - Universal coding standards
- [Writing in English](../writing.md) - Voice, tone, and language
- [Schreiben auf Deutsch](../../de/writing.md) - Stimme, Ton und Sprache

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
