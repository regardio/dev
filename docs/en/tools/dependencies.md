---

title: Dependency Handling
type: guide
status: published
summary: Safe dependency updates and supply-chain controls for Regardio workspaces
related: [releases, typescript, vitest]
locale: en-US
---

# Dependency Handling

Dependency update workflow and supply-chain controls for Regardio workspaces. Automated updates are combined with pnpm guardrails; the lockfile is authoritative.

## Update workflow

- Use `pnpm ncu` to prepare workspace dependency upgrades
- Install through `pnpm` so workspace-level safety settings are applied
- Run the normal verification flow after updates:

The root `ncu` script uses a 1-day cooldown so it does not propose versions that are newer than the workspace release-age policy.

```bash
pnpm audit
pnpm build
pnpm lint
pnpm test
pnpm typecheck
```

For larger automated upgrade passes, use the existing safety wrapper:

```bash
pnpm safe-upgrade
```

## Workspace safety settings

The root `pnpm-workspace.yaml` defines the main supply-chain controls.

### Allow-listed dependency builds

Regardio keeps dependency build scripts restricted through `onlyBuiltDependencies`.

This means dependencies cannot start running build or postinstall steps unless they are already trusted and listed explicitly. If a package that previously needed no build step suddenly adds one in a compromised release, pnpm will not execute it automatically.

When a legitimate dependency genuinely needs a build step, add it deliberately to the allow-list and review why it is required.

### Block exotic transitive dependencies

```yaml
blockExoticSubdeps: true
```

This prevents transitive dependencies from resolving through git URLs, tarballs, or other non-registry sources.

### Delay newly published versions

```yaml
minimumReleaseAge: 1440
```

We wait 24 hours before pnpm may install a newly published version. This gives time for compromised packages to be detected and removed before they reach the workspace.

The root `ncu` script mirrors this with `--cooldown 1`, which helps align version selection with the install policy. pnpm still remains the authoritative enforcement point during installation.

### Prevent trust downgrades

```yaml
trustPolicy: no-downgrade
```

If a package release becomes less trustworthy than earlier releases, pnpm rejects the installation instead of silently accepting the downgrade.

`npm-check-updates` does not enforce trust policy, build-script allow-lists, or exotic transitive source restrictions. Those safeguards only take effect when `pnpm install` resolves and installs dependencies.

## Lockfile discipline

- Commit `pnpm-lock.yaml`
- Review lockfile changes together with manifest changes
- Prefer normal installs over ad hoc per-package package manager commands so the workspace lock remains authoritative

## Reviewing dependency updates

When an automated update lands, review:

- whether the package is direct or transitive
- whether the update adds or changes a build requirement
- whether the package affects runtime, build tooling, or release tooling
- whether overrides should be added for newly disclosed vulnerabilities

## Shipping dependency changes

Dependency updates follow the same release gates as any other change.

- verify locally before shipping
- keep changelog subjects clear when a release is primarily dependency maintenance
- use provenance when publishing public packages

## When to make an exception

Exceptions should stay explicit and rare.

Examples:

- adding a package to `onlyBuiltDependencies`
- introducing a workspace override for a vulnerable transitive dependency
- reducing the release-age delay for a security-critical emergency update

When an exception is necessary, document the reason in the change itself so later readers can understand why the safer default was not enough.

Related documents:

- [Release Workflow](./releases.md) — Automated release process for Regardio packages
- [Testing Approach](../standards/testing.md) — Testing philosophy and patterns for Regardio projects
- [TypeScript Configuration](./typescript.md) — TypeScript setup and configuration for Regardio projects
