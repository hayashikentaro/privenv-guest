# Protocol Compatibility

`privenv-guest` and `privenv-host` must agree on the JSON shapes for `EffectRequest`, `EffectResponse`, and safe manifests.

`privenv-guest` now depends on `@privenv/protocol` for shared protocol types and validators. This reduces protocol drift while keeping Guest-specific behavior local.

## Current Process

Protocol changes should be handled through package version updates:

- update the `@privenv/protocol` dependency version deliberately
- read package release notes or an explicit copied spec
- update local fixtures when the shared protocol shape changes
- keep Guest-specific file loading and CLI behavior in this repository
- `privenv-guest` must not inspect `privenv-host` to verify compatibility
- `privenv-guest` must not inspect the `privenv-protocol` repository to verify compatibility

If a Guest-side change needs Host-side or protocol implementation details, stop and request an explicit copied spec or package release information instead of inspecting sibling repositories.

## Shared Package

`@privenv/protocol` owns:

- `EffectRequest`
- `EffectResponse`
- `RedactionSummary`
- safe manifest types
- protocol validators

Local protocol fixtures remain as compatibility examples and regression tests.

## Boundary Reminder

Protocol compatibility does not loosen the Guest boundary. `privenv-guest` still reads `privenv.manifest.json` only, creates `EffectRequest` only, and never reads Host-owned files or raw secret values.
