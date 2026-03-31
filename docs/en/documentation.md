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

Brief introduction to the topic. What moves us? Why does this exist?

- Background and motivation for this document
- The need or problem being addressed
- Who this serves and when to use it

## Rationale

What do we want to achieve? Core reasoning and principles.

- Goals and intentions of this approach
- Why this structure serves clarity
- Approaches considered before deciding

## Options

What are the parts? What did we consider?

- Alternative approaches evaluated
- Trade-offs identified between options
- Key decision points that led to current approach

## Decision

What did we decide? The chosen approach.

- The specific solution or pattern adopted
- Key stakeholders and scope
- Boundaries and constraints of this decision

## Implementation

How do we execute? Technical details and structure.

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

Documentation follows the six fields of the Regardio System:

1. **Context** (Quellen) - Why does this exist?
2. **Rationale** (Vorhaben) - What are we pursuing?
3. **Options** (Facetten) - What did we consider?
4. **Decision** (Kreise) - What did we decide?
5. **Implementation** (Pläne) - How do we execute?
6. **Consequences** (Brücken) - How does this connect?

Not all documents need all sections. Adapt to fit:

- **Entity docs**: Context, Decision, Implementation, Consequences
- **Architecture docs**: Context, Rationale, Options, Decision, Implementation, Consequences
- **Concept docs**: Context, Rationale, Implementation
- **Guide docs**: Context, Implementation, Consequences

Section names can be adapted naturally. Structure guides thinking, not formatting.

### Writing Style

Follow System style guides:

- Derive, don't describe - show how thoughts connect
- Observe, don't prescribe - describe patterns, not rules
- Use concrete language over abstractions
- Avoid: must, revolutionary, potential, leverage, optimize
- Prefer: notice, explore, might, could, pattern, rhythm

### Cross-References

- Link to related entities: `[Entity](./entity.md)`
- Reference schemas: `` [`path/to/schema.sql`](path) ``
- Include language alternates: `*[Deutsch](../de/file.md)*`
- Reference System docs: `[Field](../../../../packages/system/docs/en/field.md)`

### Formatting

- **Bold** for System terms at first introduction
- *Italic* for emphasis or foreign language equivalents
- Code blocks with language identifiers
- Tables for structured comparisons
- No emojis

## Consequences

How does this connect? Impact and implications.

- Impact of this approach on documentation quality
- Trade-offs between structure and flexibility
- Related documents and cross-references
- Future considerations for documentation evolution

### Related Documents

- [Coding](./coding.md) - TypeScript and React patterns
- [Principles](./principles.md) - Universal coding standards
- [Writing in English](../writing.md) - Voice, tone, and language
- [Schreiben auf Deutsch](../../de/writing.md) - Stimme, Ton und Sprache

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
