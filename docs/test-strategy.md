# Test Strategy

This repository has no runtime code yet. Future tests should protect the Guest boundary.

## Principles

- Never use real secrets in tests.
- Use fixture-only and obviously fake values.
- Manifest fixtures must not contain secret values.
- EffectRequest fixtures must not contain raw command, env, timeout, or secret fields in params.
- Passthrough examples must be conceptual and explicitly not for AI agent execution.

## Future Test Areas

When runtime code is added, tests should verify:

- manifest parsing accepts safe manifests
- manifest parsing rejects secret-looking values
- capability listing uses manifest data only
- EffectRequest creation uses `capabilityId` only
- request validation rejects forbidden params: `command`, `program`, `args`, `argv`, `shell`, `env`, `timeout`, `timeoutMs`
- no API exposes `getSecret()`, `getEnv()`, `rawEnv()`, raw vault readers, or raw `.env` readers

## Fixture Values

Use values like:

```text
example-placeholder-not-real
fixture-value-not-a-secret
fake-demo-token-not-real
```

Do not use realistic token formats, private keys, production URLs with credentials, copied browser cookies, or personal data.
