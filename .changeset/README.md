# Changesets

This folder is used by `@changesets/cli` to manage versioning and changelog generation.

## Adding a Changeset

When you make changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:

1. Choose the semver bump type (patch/minor/major)
2. Write a summary of the changes

The changeset file will be committed with your PR.

## Releasing

When changesets are merged to `main`, the GitHub Action will:

1. Create a "Version Packages" PR with updated version and CHANGELOG
2. When that PR is merged, the package is published to npm

## Manual Release

To release manually:

```bash
pnpm changeset version  # Update version and CHANGELOG
pnpm build              # Build the package
pnpm changeset publish  # Publish to npm
```

## More Information

- [Changesets Documentation](https://github.com/changesets/changesets)
