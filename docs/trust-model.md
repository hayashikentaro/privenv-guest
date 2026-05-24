# Trust Model

The Guest is untrusted by design.

A Guest may be useful, autonomous, and connected to an AI workflow, but it must not be trusted with secrets. The Host is the trusted boundary that owns and materializes secret values only when executing approved effects.

## Trusted Subject: Host

The Host owns:

- secrets and vault storage
- Host config
- audit logs
- redaction
- policy
- execution context
- approved effect execution

## Untrusted Subject: Guest

The Guest may:

- read `privenv.manifest.json`
- list declared capabilities
- create `EffectRequest` JSON
- receive redacted `EffectResponse` JSON

The Guest must never read:

- `.env`
- `.env.*`
- `privenv.host.json`
- `.privenv/vault.json`
- `.privenv/audit.log.jsonl`
- raw secrets
- PII
- tokens or OAuth tokens
- SSH keys
- browser sessions

## Boundary Rule

Guest-facing APIs describe capabilities and effects. Any API that returns raw secret values to the Guest violates the trust model.

Forbidden APIs include:

- `getSecret()`
- `getEnv()`
- `rawEnv()`
- raw vault readers
- raw `.env` readers
