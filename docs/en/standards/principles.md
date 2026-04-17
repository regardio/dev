---

title: "Principles"
description: "The shared ground Regardio projects stand on — six clusters of principles that carry across languages and repos."
publishedAt: 2026-04-17
order: 3
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

Regardio spans several codebases and several languages. What keeps them legible to each other is a short list of principles held in common — enough shared ground that a contributor moving between projects finds the same habits in force, and enough room left for each codebase to speak its own idiom.

Six clusters, a handful of items each.

## Code quality

- Readable code over clever code
- Consistent naming within each language — `camelCase` in TypeScript, `snake_case` in SQL
- Small functions with a single responsibility
- Explicit choices over implicit defaults

## Architecture

- Modules decouple from each other; dependencies are deliberate
- Duplication resolves into an abstraction only when the pattern is clear
- Interfaces describe what a module does, not how it does it
- Concerns separate along the seams the domain suggests

## Error handling

- Input is validated early; failures surface with a clear message
- Validation covers correctness and security in the same pass
- Logic stays separated from side effects so it remains testable
- Dependencies can fail; the code degrades gracefully when they do

## Performance

- Data structures match the shape of the work
- Measurement comes before optimisation
- Resources — memory, connections, file handles — are released on the path that acquired them
- Scale is considered at design time, not retrofitted

## Security

- Client data is untrusted by default; server-side validation is the line
- Privileges stay narrow; access is opened deliberately
- Defence is layered; a single check never stands alone
- Openness is an opt-in, not the default posture

## Maintainability

- Patterns repeat across the codebase so that reading one teaches reading the rest
- Commits are atomic and speak to one change at a time
- Refactoring is continuous; debt is paid down rather than accumulated

## Implementation workflow

Non-trivial work tends to follow this sequence — not as a ritual, but because skipping a step usually costs more later than it saves now:

1. **Understand the business logic first.** The deepest defects come from misunderstood requirements. Read the relevant domain document; know what is needed now rather than what might be needed later.
2. **Look for existing solutions.** Well-maintained libraries are evaluated before custom code is written. Dependencies are vetted for design quality, test coverage, and recent activity.
3. **Write the tests as specification.** The behaviour a change produces is described as tests before the change is written. Tests are the contract; the code is measured against them.
4. **Implement with reusability in mind, not reusability as the goal.** Duplicate until the pattern is clear, then extract. Wrong abstractions cost more than duplication.
5. **Stop and reconsider when complexity grows.** Difficulty that keeps growing despite good preparation is a signal. Back out, simplify, or question the approach.
6. **Document intent, not mechanics.** Comments explain *why*; the code explains *what*. Existing context is checked before new prose is added.

## Collaboration

- Every change passes through review
- Code quality is shared, not owned
- Decisions that involve a real trade-off leave a trace in the project's `docs/en` tree

## Related

- [Coding](./coding.md) — TypeScript and general patterns
- [Testing](./testing.md) — Testing philosophy
- [Documentation Standard](./documentation.md) — How documents are shaped
- [Writing](./writing.md) — Voice, tone, language

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
