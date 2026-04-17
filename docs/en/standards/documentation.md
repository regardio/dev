---

title: "Documentation Standard"
description: "How Regardio documents its work — for agents to navigate, for humans to reason with, for tests to build on."
publishedAt: 2026-04-17
order: 1
language: "en"
status: "published"
---

## Context

Regardio documentation is read by three audiences at once. Agents use it to answer questions about the system and to write code against a known contract. Humans use it to build a judgement of their own about what the project does and why. Tests use it as the specification the implementation is measured against.

Those audiences do not all need the same shape on every page. An architectural decision reads best as a short chain of reasoning — context, alternatives, what was chosen and why. A naming reference reads best as a catalogue. A quick introduction to a tool reads best as a few paragraphs and a short example. Forcing every document into one template serves the template rather than the content, and what the reader comes away with is ceremony instead of understanding.

What the documentation needs is enough predictability for tooling to rely on — a consistent frontmatter, a recognisable title, a place to find related reading — and enough freedom for each document to take the shape its content asks for.

## Decision

Every Regardio document carries a small shared surface. Underneath, it takes whichever of a few shapes fits the content it carries.

### Shared surface

Every document has the same top:

- **Frontmatter** that identifies the document and lets tooling index it
- **A title** as a heading or implicit from frontmatter
- **An opening that names what the document is for** — one or two sentences, before any sub-headings, so that a reader landing cold knows where they are

Every document has the same bottom:

- **Cross-references** to documents the reader is likely to want next, either inline in the prose or collected under `## Related` at the end

Between the top and the bottom, the document takes the shape its content asks for.

### Shapes the body takes

A few shapes recur. Pick the one the content fits; do not pad the content into a shape it resists.

**Decision record.** When the document captures a choice with real trade-offs, the ADR shape carries the reasoning well: *Status → Context → Decision → Alternatives Considered → Operational Rules → Consequences*. Operational Rules are the part tests bind to. The shape is an option for decision-heavy documents, not a requirement for every document.

**Reference catalogue.** When the content is a set of rules, names, or mappings that readers look up rather than read end-to-end, a catalogue of short sections with examples is the honest form. Naming conventions, file-layout rules, linter settings, and configuration tables read this way.

**Concept or entity note.** When the document describes a thing in the domain — a Channel, a Piece, a Plan — a short run of paragraphs that names the thing, its role, and its relations is usually enough. Two or three headings if the thing has parts worth naming separately.

**Quick introduction.** When the document introduces a tool or a workflow, a few paragraphs and a small example are enough. The reader needs to know what the thing is, when to reach for it, and where to go next. No ADR skeleton is required for a tool page.

**Warm reasoning.** When the document is working something out — a use case, a walkthrough, an explanation of why a piece of the domain behaves the way it does — prose that follows the thought is the right form. Headings appear where they help the reader keep their place, not because structure is owed.

A document can borrow from more than one shape. An architectural document might open with warm reasoning and close with Operational Rules. An entity note might include a short alternatives paragraph when the entity's shape had genuine contenders. The shapes are orientation, not slots.

### Frontmatter

Frontmatter is the part tooling reads. Keep it stable.

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Noun phrase naming the document. Decision records may prefix `"ADR: "`. |
| `description` | yes | One sentence. What this document is for, without hedging. |
| `publishedAt` | yes | ISO date (`YYYY-MM-DD`) the document was first accepted. |
| `status` | yes | `"draft"`, `"published"`, `"superseded"`. |
| `language` | yes | `"en"`, `"de"`. |
| `order` | no | Integer, when a sibling set has a meaningful reading order. |
| `kind` | no | `"adr"`, `"entity"`, `"concept"`, `"architecture"`, `"guide"`, `"use-case"`, `"reference"`. Lets agents and renderers pick the right treatment. |
| `area` | no | `"ensemble"`, `"supabase"`, `"connect"`, `"instrument"`, `"dev"`. Names the implementation the document belongs to. |
| `supersedes` | no | Filename (without extension) of the document this one replaces. |
| `supersededBy` | no | Filename of the document that replaced this one. |

### Tense and stance

Documents describe what the system does, in the present tense, observed rather than advertised. "The publication function returns pieces ordered by `sort_order`." Not "The publication function will return…" and not "We should implement…". The tense holds whether the behaviour is currently built or still being specified; the `status` frontmatter carries the difference.

The stance is observational. A Regardio document is not a pitch. It notices how the system fits together and what follows from that. Reliability, safety, transparency, usefulness, and care for the people the software serves show up through how the reasoning is laid out, not by being claimed. A reader who finishes a document should be able to make their own judgement about whether the system is sound — that is what the prose is for.

### What shows up where

- **Code snippets** appear where they clarify a contract, a data shape, or a naming pattern. Reference catalogues quite properly carry several; decision records rarely need any. A snippet never stands in for the reasoning around it.
- **Names** (files, functions, columns, handles) appear where they are contracts readers rely on. They do not appear as a substitute for describing what something does.
- **Procedural steps** belong in runbooks and READMEs. A domain spec does not read like a cookbook.

### Cross-references

Links carry a short descriptor of what the link leads to, not just a filename:

```markdown
The [Channel](../entities/channel.md) is the publication destination;
the [Publishing Architecture](../architecture/publishing-architecture.md)
describes how callers reach it.
```

`## Related` at the end of a document lists the next pages a reader is likely to want.

### Voice

The [Writing](./writing.md) standard covers voice, tone, and language. This document relies on it rather than repeating it.

## Alternatives Considered

### A single ADR skeleton for every document

**Dismissed because** it presses reference catalogues and tool introductions into a shape that does not suit them. The skeleton adds ceremony where the content is already clear, and readers learn to skim past sections that carry no weight. The skeleton remains available for documents whose content earns it.

### No shared shape at all

**Dismissed because** agents and tooling need something predictable to index against, and readers benefit from landing on any document and knowing roughly where to look. A thin shared surface — frontmatter, opening line, closing references — is enough.

### Separate templates per document kind

**Dismissed because** the kinds blur at the edges. An entity note sometimes carries a decision; a use case sometimes carries a catalogue. A small set of recognisable shapes that documents can borrow from works better than a closed list of templates.

## Operational Rules

### Frontmatter is complete

Every document carries `title`, `description`, `publishedAt`, `status`, and `language`. Tooling that indexes or lists documents relies on these five.

### Opening names the subject

Before the first sub-heading, a reader can tell what the document is for. If the opening does not make this clear, the document is not ready.

### Shape follows content

The body takes the shape the content asks for. A decision record uses the ADR skeleton if that skeleton helps the reasoning; a reference uses a catalogue; an introduction stays short. Where a document borrows from more than one shape, it does so in service of the reader, not in service of the template.

### Tense is present, stance is observational

Documents describe the system as it is, in the present tense. Not-yet-built behaviour is flagged through `status`, not through hedged tense. The prose observes rather than promotes.

### Reasoning is preserved, not rewritten

When a decision is revisited, the existing document is superseded. The old reasoning stays readable so that future readers can see what was known at the time. An in-place rewrite that changes direction without supersession loses the history.

### Code and names earn their place

A snippet appears because it clarifies a contract the prose cannot carry alone. A specific name appears because callers rely on it. Both are tools for the reader, not decoration.

### Tests can point at a document

A behaviour worth testing has a place in a document that names it. The document does not need a section labelled "Operational Rules" for this — it needs prose clear enough that a test can quote it and both the test author and the reviewer know what is being verified.

### One subject per document

A document names one entity, one concept, one decision, one scenario. When a draft sprawls across several, the move is to split it.

## Consequences

### Positive

- Documents read naturally for their content. ADRs feel like ADRs; reference catalogues feel like reference catalogues; introductions stay short.
- Agents and humans find a predictable frontmatter and opening, and the body of each document carries its reasoning in the form that fits.
- The docs stay honest. Observational prose about what the system does leaves room for the reader to form a judgement, rather than prescribing one.
- Tests bind to the prose that describes behaviour, wherever in the document that prose lives.

### Negative

- "Shape follows content" asks for judgement. Contributors unsure of the right shape need a reference document to look at; the existing documents serve that role.
- Without a single template, reviewers sometimes have to say "this would read better as a catalogue" or "this would read better as an ADR". That conversation is part of the standard, not a cost around it.

### Mitigations

- New documents are often patterned on a nearby existing one. A contributor writing a new entity note copies the shape of an adjacent entity note; a contributor writing an ADR copies an adjacent ADR.
- Reviewers point at this document when a draft has picked a shape that resists its content, and help the author find the form the content already has.

## Related

- [Writing](./writing.md) — Voice, tone, language
- [AI Agent Guidelines](../agents.md) — How agents use these documents
- [Principles](./principles.md) — Shared development principles

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
