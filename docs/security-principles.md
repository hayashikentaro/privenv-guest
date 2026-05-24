# Security Principles

Security in `privenv-guest` starts with accepting that the Guest is untrusted.

## Principles

1. Guests never read secrets directly.
2. Guests request effects executed by the Host.
3. Guests read `privenv.manifest.json` only.
4. Guests create `EffectRequest` only.
5. Guests never read Host config, vault, audit logs, `.env`, browser sessions, or raw secret material.
6. Guests never receive raw secret values.
7. Passthrough is not for AI agent execution.

## Forbidden APIs

`privenv-guest` must not expose:

- `getSecret()`
- `getEnv()`
- `rawEnv()`
- raw vault readers
- raw `.env` readers
- browser session readers
- token readers

## Forbidden Request Params

Guest-created `EffectRequest.params` must not include:

- `command`
- `program`
- `args`
- `argv`
- `shell`
- `env`
- `timeout`
- `timeoutMs`
- secret values

## Safe Output

Guest output should show capability metadata, request IDs, and redacted Host responses. It should not display or persist raw secrets.
