# privenv-guest

`privenv-guest` is the untrusted Guest-side component of privenv.

privenv separates two subjects:

- **Host**: the trusted side. The Host owns secrets, config, vault, audit logs, redaction, policy, and execution context. The Host executes approved effects and returns redacted `EffectResponse` JSON.
- **Guest**: the untrusted side. The Guest may be an AI agent, Codex, Claude Code, Cursor agent, LLM runtime, or AI container. The Guest reads only Host-generated safe manifests and creates `EffectRequest` JSON.

Core principle:

> Guests never read secrets directly. Guests request effects executed by the Host.

## Current Status

This repository now contains a minimal TypeScript Guest-side toolkit skeleton.

Implemented:

- read `privenv.manifest.json`
- list safe capabilities
- create safe `EffectRequest` JSON
- reject forbidden request params
- validate manifest safety shape

Not implemented:

- Host runtime
- transport to Host
- stdio client
- passthrough behavior
- secret reading of any kind

## Quick Start

Install dependencies, then run the local checks:

```sh
npm install
npm run typecheck
npm test
npm run pack:check
```

Create or obtain a Host-generated `privenv.manifest.json`, then list capabilities:

```sh
privenv-guest list
```

Create an `EffectRequest` for a capability:

```sh
privenv-guest request cmd.npm.test
```

The request is printed to stdout. It is not sent to a Host yet because transport is not implemented. The Guest package never reads Host-owned files such as `privenv.host.json`, `.privenv/vault.json`, or `.privenv/audit.log.jsonl`.

## Development Checks

Run the same checks locally that CI runs on every push and pull request:

```sh
npm run typecheck
npm test
npm run pack:check
```

CI uses Node.js 20 and does not publish packages, deploy, require repository secrets, implement transport, or contact a Host.

## CLI Commands

### `privenv-guest list`

Reads `privenv.manifest.json` from the current working directory and prints safe capability metadata as JSON.

### `privenv-guest request <capabilityId>`

Reads `privenv.manifest.json`, verifies the capability exists, and prints `EffectRequest` JSON.

Requests do not include `params` by default.

## Guest Boundary

The Guest must never read:

- `.env`
- `.env.*`
- `privenv.host.json`
- `.privenv/vault.json`
- `.privenv/audit.log.jsonl`
- raw secrets, PII, tokens, OAuth tokens, SSH keys, or browser sessions

The Guest reads `privenv.manifest.json` only and sends `EffectRequest` only.

`privenv-guest` must not expose `getSecret()`, `getEnv()`, `rawEnv()`, raw vault readers, or raw `.env` readers.

## Initial Scope

`privenv-guest` focuses on:

- reading `privenv.manifest.json`
- listing safe capabilities
- creating `EffectRequest` JSON
- validating that Guest requests do not include raw command, env, timeout, or secret fields
- documenting Guest boundary and operational modes

## Modes

- **protected**: Guest uses a safe manifest, sends `EffectRequest` to Host, and never reads secrets.
- **demo**: Guest may use fixture manifests and examples; no real secrets.
- **passthrough**: no untrusted Guest boundary is active. Passthrough is for trusted production/runtime use only, is not safe for AI agent execution, and is not implemented yet.

## Protocol Compatibility

`privenv-guest` and `privenv-host` must agree on `EffectRequest`, `EffectResponse`, and safe manifest shapes. For now, protocol docs and types are duplicated locally. Do not inspect `privenv-host` to compare protocol; use an explicit copied spec or future shared package instead.

## Transport

Phase 1 is stdio JSON request/response with the Host. Phase 2 may add a future transport such as Unix domain socket. Transport is documented only in this repository for now and is not implemented yet.

## Documentation

- [Architecture Snapshot](docs/architecture-snapshot.md)
- [Concept](docs/concept.md)
- [Trust Model](docs/trust-model.md)
- [Guest Boundary](docs/guest-boundary.md)
- [Protocol](docs/protocol.md)
- [Protocol Compatibility](docs/protocol-compatibility.md)
- [Manifest Spec](docs/manifest-spec.md)
- [Modes](docs/modes.md)
- [MVP Scope](docs/mvp-scope.md)
- [Examples](docs/examples.md)
- [Security Principles](docs/security-principles.md)
- [Test Strategy](docs/test-strategy.md)

## License

Apache-2.0
