---

handle: concepts/documentation
title: Documentation Standard
summary: How we write, organize, and connect documents in this project
facet_type: STEP.ESSENCE
status: PUBLISHED
locale: en-US
---

# Documentation Standard

Every document here is a **Facet** — a record of something worth knowing. Facets collect into **Plans**, which work the way folders do in file systems, but carry more meaning: a Plan has a name and a purpose, and the **Bridges** within it describe how the Facets it contains relate to each other. A cross-reference is a Bridge. Writing documentation is placing Facets in Plans and drawing Bridges between them.

That is not a metaphor. It is the actual structure Ensemble uses, and this document is an example of it.

---

## What a document is

A document is a Facet of type STEP.ESSENCE — something distilled from experience, worth keeping. Its *frontmatter* places it in context the same way a Facet's properties do:

| Field | Notes |
|---|---|
| `title` | Noun phrase — what this is, not what it does |
| `type` | `entity`, `concept`, `architecture`, `decision`, `guide` |
| `facet_type` | The Regardio step or element this document most resembles |
| `summary` | One sentence, without hedging |
| `status` | `draft`, `active`, `deprecated` |
| `id` | For entity documents: numeric identifier |
| `alias` | For entity documents: short string used in code |
| `related` | Filenames without extension — Bridges to other Facets |
| `locale` | `en-US`, `de-DE` |

Only `title` and `summary` are required. Everything else narrows the picture when it helps.

---

## What structure a document has

The Regardio System offers a number of suggestions on how to structure a document to help think of everything.

The six **Steps** of the Regardio System — Impulse, Signal, Effect, Accord, Action, Essence — describe how any cooperative endeavor unfolds. They also describe how a piece of thinking unfolds: something prompts a question, the question needs context, context surfaces options, options lead to a direction, the direction requires action, and eventually something settles that is worth keeping.

Not every document needs all six. A short guide might be mostly Action. A decision record might be mostly Accord, with just enough Impulse to explain why the decision was needed. A concept document might need only Signal and Essence. Use the steps as orientation, not as slots to fill.

When a section has nothing to add, leave it out. A document with three sections that say something is better than one with six that perform thoroughness.

The guiding questions below help locate what belongs where:

**Impulse** — What tension or gap makes this document necessary? One or two sentences that name the problem. If you cannot name it, the document is not ready to be written.

**Signal** — What does the reader need to understand before the rest makes sense? Context that changes how something is read — not everything relevant, only what would otherwise be missing.

**Effect** — What are the real options, and what does each one cost? If there was genuinely only one option, say so in a sentence and move on.

**Accord** — What direction have we settled on, and why? This section should stand on its own: a reader who skips everything else should still be able to follow the reasoning.

**Action** — What does this mean in practice? Procedures, patterns, conventions — specific enough to act on.

**Essence** — What remains when the thinking is done? What this produced, what it did not resolve, and where to go next.

---

## How documents connect

A cross-reference is a Bridge. Every Bridge belongs to a Plan — the collection that gives it meaning. When linking to a related document, name the Plan the link belongs to:

```markdown
[Facets](../system/facet.md) in the [System Overview](../system/)
[Bridge](../entities/bridge.md) in the [Entity Reference](../entities/)
```

This keeps the reference situated. A Facet can appear in multiple Plans, and the same two Facets can be connected differently in different Plans. The Plan name is the context that makes a Bridge readable.

---

## Voice and formatting

Write from inside the subject. The System is something observed, not a method imposed. Derive thought instead of asserting it — show how one idea leads to the next rather than declaring what things are.

**Bold** for Regardio System terms at first introduction, capitalize terms when indicated. *Italic* for any other emphasis. Code blocks with language identifiers. Tables for structured comparisons; prose for connected thought. No emojis.

Avoid: *must*, *critical*, *revolutionary*, *leverage*, *optimize*.

Prefer: *notice*, *explore*, *might*, *tends to*, *pattern*, *rhythm*.

The [Writing in English](./writing.md) guide covers voice and tone in more depth.

---

## Bridges

- [Writing in English](./writing.md) — Voice, tone, and language
- [Schreiben in Deutsch](../de/konventionen/schreiben.md) — Voice, tone, and language
- [Coding Standards](../coding/coding.md) — TypeScript and React patterns
- [Development Principles](../coding/principles.md) — Universal standards

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
