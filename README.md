# privenv-guest

`privenv-guest` is the untrusted Guest-side component of privenv.

privenv separates two subjects:

- **Host**: the trusted side. The Host owns secrets, config, vault, audit logs, redaction, policy, and execution context. The Host executes approved effects and returns redacted `EffectResponse` JSON.
- **Guest**: the untrusted side. The Guest may be an AI agent, Codex, Claude Code, Cursor agent, LLM runtime, or AI container. The Guest reads only Host-generated safe manifests and creates `EffectRequest` JSON.

Core principle:

> Guests never read secrets directly. Guests request effects executed by the Host.

## Initial Scope

`privenv-guest` focuses on:

- reading `privenv.manifest.json`
- listing safe capabilities
- creating `EffectRequest` JSON
- validating that Guest requests do not include raw command, env, timeout, or secret fields
- documenting Guest boundary and operational modes

This repository is documentation-only for now. Do not add runtime code, `package.json`, or dependencies until explicitly requested.

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

## Modes

- **protected**: Guest uses a safe manifest, sends `EffectRequest` to Host, and never reads secrets.
- **demo**: Guest may use fixture manifests and examples; no real secrets.
- **passthrough**: no untrusted Guest boundary is active. Passthrough is for trusted production/runtime use only, is not safe for AI agent execution, and is not implemented yet.

## Transport

Phase 1 is stdio JSON request/response with the Host. Phase 2 may add a future transport such as Unix domain socket. Transport is documented only in this repository for now.

## Documentation

- [Concept](docs/concept.md)
- [Trust Model](docs/trust-model.md)
- [Guest Boundary](docs/guest-boundary.md)
- [Protocol](docs/protocol.md)
- [Manifest Spec](docs/manifest-spec.md)
- [Modes](docs/modes.md)
- [MVP Scope](docs/mvp-scope.md)
- [Examples](docs/examples.md)
- [Security Principles](docs/security-principles.md)
- [Test Strategy](docs/test-strategy.md)

## License

Apache-2.0
