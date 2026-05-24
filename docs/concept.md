# Concept

`privenv-guest` is the untrusted Guest-side component of privenv.

privenv separates Host and Guest domains for AI-era development:

- **Host** is trusted. It owns secrets, config, vault, audit logs, redaction, policy, and execution context.
- **Guest** is untrusted. It reads only Host-generated safe manifests and creates `EffectRequest` JSON.

The core principle is:

> Guests never read secrets directly. Guests request effects executed by the Host.

The Guest can help an AI agent understand which capabilities are available without giving that agent access to `.env`, vault files, tokens, PII, SSH keys, OAuth tokens, browser sessions, or Host-owned config.

## Guest Role

The Guest:

- reads `privenv.manifest.json`
- lists capabilities from that manifest
- creates `EffectRequest` JSON using a capability ID
- validates that requests do not include forbidden raw execution or secret fields
- receives redacted `EffectResponse` JSON

The Guest does not execute Host effects itself.

## Host Role

The Host:

- owns secret material
- owns `privenv.host.json`
- owns `.privenv/vault.json`
- owns audit logs
- resolves policy and execution context
- executes approved effects
- redacts outputs before returning responses

## Non-Secret Interface

The Guest-facing interface is capability-based, not secret-based. A Guest should ask for an effect like `cmd.npm.test`, not for a token or env var value.
