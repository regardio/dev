# @regardio/dev

## [1.20.2] - 2026-04-04

- docs: applying Regardio System principles to our documentation

## [1.20.1] - 2026-04-01

- docs: coherent structure
- docs: working towards a definitive ADR-style documentationt template

## [1.20.0] - 2026-03-31

- fix: also fix changelog
- fix: fix package.json after modifications
- fix: proper linting
- refactor: release workflows verify data, not modify code

## [1.19.0] - 2026-03-31

- refactor: documentation
- chore: deps
- chore: deps
- chore: deps

## [1.18.3] - 2026-03-25

- fix: path to husky

## [1.18.2] - 2026-03-25

- chore: deps
- fix: simplify db docs
- chore: deps

## [1.18.1] - 2026-03-20

- fix: inferrable type annotations are desirable with dts
- chore: deps
- chore: deps
- feat: explicit types for UserConfig
- ci: workflow replacing workspace dependencies

## [1.18.0] - 2026-03-18

- chore: deps

## [1.17.1] - 2026-03-17

- ci: sync main after merge

## [1.17.0] - 2026-03-17

- ci: simplify shipping

## [1.16.3] - 2026-03-17

- refactor: remove ts test
- refactor: remove exec-ts wrapper
- chore: deps
- chore: deps

## [1.16.2] - 2026-03-02

- chore: deps

## [1.16.1] - 2026-02-28

- fix: ship should test, not report

## [1.16.0] - 2026-02-28

- refactor: ship tools

## [1.15.1] - 2026-02-26

- chore: add private package guard to release.yml

## [1.15.0] - 2026-02-26

- refactor: remove changesets, lock file
- chore: deps
- Merge pull request #4 from regardio/dependabot/npm_and_yarn/ajv-8.18.0
- chore(deps): bump ajv from 8.17.1 to 8.18.0

## [1.14.3] - 2026-02-25

- fix: guard clean.ts spawn behind main-module check to prevent process.exit leaking into tests

## [1.14.2] - 2026-02-25

- fix: add NODE_AUTH_TOKEN to npm publish step in all release workflows

## [1.14.1] - 2026-02-25

- fix: fall back to stdin when /dev/tty unavailable in confirm()
- fix: truncate long commit body lines to satisfy commitlint 100 char limit
- chore: update all packages — flow: scripts, release.yml on production branch, remove fix from b...
- fix: remove fix from build script — runs as side effect, dirtying working tree

## [1.14.0] - 2026-02-25

- fix: exclude bin/ from coverage, rename scripts to flow:release/ship/hotfix
- chore: rename pnpm scripts to flow:release, flow:ship, flow:hotfix
- fix: sync staging after shipping to production
- feat: add flow scripts with confirmation prompt and fix release bugs
- refactor: structure and test
- feat: enhance workflows, breaking changes
- fix: properly run fix after build

## 1.13.8

### Patch Changes

- fix: exclude biome sorting for package.json

## 1.13.7

### Patch Changes

- fix: exclude biome sorting for package.json

## 1.13.6

### Patch Changes

- fix: biome can also check package.json

## 1.13.5

### Patch Changes

- feat: biome 2.4 config

## 1.13.4

### Patch Changes

- feat: biome 2.4

## 1.13.3

### Patch Changes

- extended documentation

## 1.13.2

### Patch Changes

- dependencies updates

## 1.13.1

### Patch Changes

- fix: md036 is too strict for our users

## 1.13.0

### Minor Changes

- consistent markdownlint defaults

## 1.12.1

### Patch Changes

- fix: remove lock file

## 1.12.0

### Minor Changes

- refactor: remove post-build script

## 1.11.4

### Patch Changes

- fix: vitest config as const

## 1.11.3

### Patch Changes

- fix: vitest config as const

## 1.11.2

### Patch Changes

- fix: remove vitest type annotations to avoid cross-package type conflicts

## 1.11.1

### Patch Changes

- fix option for lint-package

## 1.11.0

### Minor Changes

- coverage reports, revised sort order in package.json files, documentation

## 1.10.3

### Patch Changes

- release workflow

## 1.10.2

### Patch Changes

- strip /index from generated exports

## 1.10.1

### Patch Changes

- executable

## 1.10.0

### Minor Changes

- post build exports

## 1.9.4

### Patch Changes

- markdownlint config

## 1.9.3

### Patch Changes

- fix install issues

## 1.9.2

### Patch Changes

- postcss dependency

## 1.9.1

### Patch Changes

- add fix step to release flow

## 1.9.0

### Minor Changes

- markdown lint config

## 1.8.0

### Minor Changes

- markdown lint config

## 1.7.1

### Patch Changes

- add flow-changeset bin wrapper

## 1.7.0

### Minor Changes

- Add modular documentation structure and fix husky setup

## 1.6.1

### Patch Changes

- Update markdownlint config

## 1.6.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

- Move devDependencies to dependencies, add flow-release command

### Patch Changes

- Add lockfile sync to flow-release workflow

- Add GitHub Release creation to workflow, install latest npm for OIDC support

- Update markdownlint config

- Update markdownlint config

## 1.5.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

- Move devDependencies to dependencies, add flow-release command

### Patch Changes

- Add lockfile sync to flow-release workflow

- Add GitHub Release creation to workflow, install latest npm for OIDC support

- Update markdownlint config

## 1.4.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

### Patch Changes

- Add lockfile sync to flow-release workflow

- Add GitHub Release creation to workflow, install latest npm for OIDC support

## 1.3.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

### Patch Changes

- Add lockfile sync to flow-release workflow

## 1.2.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

## 1.1.0

### Minor Changes

- Move devDependencies to dependencies, add flow-release command

## 1.0.0

### Major Changes

- [`c28bdc8`](https://github.com/regardio/dev/commit/c28bdc8924a664839d74e1d1e05b3b67ba9b3d29) Thanks [@bmatzner](https://github.com/bmatzner)! - Initial release of the Regardio QA tooling
