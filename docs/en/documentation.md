---

title: Documentation Standard
type: concept
status: published
summary: Template and standard for Regardio documentation following the six-step structure
related: [coding-standards, development-principles]
locale: en-US
---

# Documentation Standard

*[Deutsch](../../de/documentation.md)*

This document is its own example. Each section below describes what belongs there — and then demonstrates it.

---

## Impulse

*What tension or gap makes this document necessary?*

Documentation accumulates in proportion to the complexity it responds to. The problem is not too little writing — it is writing that does not answer the question a reader actually has. Templates help, but only when each section carries a distinct purpose.

The six steps of the Regardio System — Impulse, Signal, Effect, Accord, Action, Essence — are not phases of a process to be filled in sequence. They are six different angles on the same subject. This template applies them as a thinking structure, not a checklist.

---

## Signal

*What do readers need to understand before the decision makes sense?*

Documentation in this project follows the Regardio System's step sequence because that sequence corresponds to how decisions actually unfold: something prompts inquiry, inquiry surfaces context, context reveals options, options lead to a choice, the choice requires action, and the action eventually proves or disproves the reasoning.

Durable architecture records preserve reasoning, not just conclusions. A document that records only the decision is a dead end. A document that records the tension that provoked it remains navigable long after the context has changed.

Each step section should be as long as it needs to be and no longer. A document with a rich Signal and a thin Action is fine if the context is complex and the implementation is straightforward. The reverse is equally valid. Sections exist to guide thinking, not to impose symmetry.

**Frontmatter fields:**

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Noun phrase, not a question |
| `type` | yes | `entity`, `concept`, `architecture`, `decision`, `guide` |
| `summary` | yes | One sentence, no hedging |
| `status` | no | `draft`, `active`, `deprecated` |
| `id` | entities only | Numeric identifier |
| `alias` | entities only | Short string used in code |
| `related` | no | Filenames without extension |
| `locale` | no | `en-US`, `de-DE` |

---

## Effect

*What are the real options, and what does each one cost?*

Three structural approaches appear across the ADR landscape:

**A single narrative section** — write the whole document as continuous prose. This works when the author already understands the problem deeply and the document is primarily a record. It fails when the author is still working out the decision, because the structure of the prose cannot signal which parts are context, which are reasoning, and which are conclusion.

**A fixed set of labeled sections** — impose a template with named headings. This helps readers navigate and helps writers know what to address. It fails when section headings are generic (Background, Discussion, Decision), because each section still admits any kind of content and the writer must invent the shape from scratch.

**Step-mapped sections with explicit questions** — each section has a heading that names the step and a question that defines what belongs there. This is the approach taken here. The question is not decorative; it is the diagnostic tool the writer uses to decide what to include and what to cut.

The risk of the third approach is that sections can still expand without discipline if the question is answered and then elaborated indefinitely. The mitigation is to treat each question as a constraint: once answered, move on.

---

## Accord

*What structure have we settled on, and why?*

Documents in this project use the six Regardio steps as section headings, each accompanied by a guiding question. The guiding question appears in italic directly below the heading and is not removed in finished documents — it remains visible as a reading aid.

A section may be omitted if it has nothing to add. A document recording a purely technical decision may have no Signal worth writing (the context is obvious) and a thin Essence (no surprises in outcome). Omitting those sections is correct; filling them with padding is not.

Cross-references use relative paths. Language alternates are linked in italic directly below the document title. Related documents are listed in the Essence section, not in a separate appendix.

---

## Action

*What does writing or revising a document actually involve?*

Start with the Impulse. Write one or two sentences that name the tension the document responds to. If you cannot name the tension, the document is not ready to be written.

Move to Signal only once Impulse is settled. Signal is for context that the reader genuinely needs — not everything relevant, only what changes how the reader understands the decision. Cut anything that would be obvious to the intended audience.

Effect documents options with their trade-offs. If there was only ever one option, say so briefly and skip the section. If there were genuine alternatives, each one deserves a sentence on what it enables and what it costs.

Accord records the direction chosen and the reasoning. This is the section most likely to be read in isolation, so it should be self-contained: a reader who skips everything else should still be able to understand what was decided and why, in broad terms.

Action describes what changes as a result. For a guide, this is the procedural content. For an architecture decision, it may be a list of affected components or a migration path. Keep it specific enough to act on.

Essence closes the document with what the decision produced and what remains open. Link to related documents here.

**Formatting conventions:**

- **Bold** for Regardio System terms at first introduction in a document
- *Italic* for guiding questions under section headings, and for language alternates
- Code blocks with language identifiers for all code
- Tables for structured comparisons; prose for everything else
- No emojis

**Voice:**

Write from inside the subject, not above it. Avoid: *must*, *revolutionary*, *potential*, *leverage*, *optimize*. Prefer: *notice*, *explore*, *might*, *could*, *tends to*, *pattern*.

---

## Essence

*What does this document produce, and what remains open?*

A document written with this template makes the reasoning behind a decision traceable. Someone reading it a year later can see what the problem was, what was considered, and why the chosen direction made sense at the time — which is all that a decision record can honestly offer.

What this template does not do: it does not guarantee good writing, and it does not prevent sections from growing too long. Both of those require editorial judgment that no template can substitute for.

Related documents:

- [Coding Standards](./coding.md) — TypeScript and React patterns
- [Development Principles](./principles.md) — Universal coding standards
- [Writing in English](../writing.md) — Voice, tone, and language
- [Schreiben auf Deutsch](../../de/writing.md) — Stimme, Ton und Sprache
- [API Design Standards](./api.md) — API design and implementation guidelines

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
