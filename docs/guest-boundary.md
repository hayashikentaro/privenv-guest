# Guest Boundary

The Guest boundary is intentionally narrow.

## Guest Reads

The Guest reads `privenv.manifest.json` only.

It must never read Host-owned files such as `privenv.host.json`, `.privenv/vault.json`, `.privenv/audit.log.jsonl`, `.env`, or `.env.*`.

## Guest Sends

The Guest sends `EffectRequest` JSON only.

The request selects a Host-approved capability by `capabilityId`. It must not contain raw command or secret material.

Forbidden request fields in `params` include:

- `command`
- `program`
- `args`
- `argv`
- `shell`
- `env`
- `timeout`
- `timeoutMs`
- secret values

## Guest Receives

The Guest receives redacted `EffectResponse` JSON only.

The response must not contain raw secret values, raw env values, vault values, PII, tokens, OAuth tokens, SSH keys, browser sessions, or Host-internal execution context.

## Ownership

The Host owns config, vault, audit, redaction, execution context, and effect execution.

The Guest owns manifest interpretation and request construction.
