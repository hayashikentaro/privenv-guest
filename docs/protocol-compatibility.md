# Protocol Compatibility

`privenv-guest` and `privenv-host` must agree on the JSON shapes for `EffectRequest`, `EffectResponse`, and safe manifests.

For now, the protocol is duplicated in both repositories as documentation and local TypeScript types. This keeps each package independent while the protocol is still small and early.

## Current Process

Until a shared protocol package exists:

- changes to `docs/protocol.md` must be mirrored manually across repositories
- changes should be coordinated through an explicit copied spec, issue, PR text, or release note
- local fixtures in this repository should reflect the copied protocol shape
- `privenv-guest` must not inspect `privenv-host` to verify compatibility

If a Guest-side change needs Host-side details, stop and request an explicit copied spec or a shared package instead of inspecting the Host repository.

## Future Shared Package

Future work may introduce a shared package such as `@privenv/protocol`.

That package could own:

- `EffectRequest`
- `EffectResponse`
- `RedactionSummary`
- safe manifest types
- protocol conformance fixtures

Until then, duplicated local specs are intentional.

## Boundary Reminder

Protocol compatibility does not loosen the Guest boundary. `privenv-guest` still reads `privenv.manifest.json` only, creates `EffectRequest` only, and never reads Host-owned files or raw secret values.
