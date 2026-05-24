# Modes

`privenv-guest` defines modes conceptually. They are not implemented yet.

## protected

Protected mode is the normal AI-era boundary.

- Guest reads safe manifest.
- Guest lists capabilities.
- Guest sends `EffectRequest` to Host.
- Guest never reads secrets.
- Host returns redacted `EffectResponse`.

Use protected mode when an AI agent or untrusted runtime is active.

## demo

Demo mode uses fixture manifests and examples only.

- no real secrets
- fake placeholder values only
- useful for docs, tests, and demos

Demo mode must not be confused with production secret access.

## passthrough

Passthrough means no untrusted Guest boundary is active.

It is intended for trusted production/runtime use only. It is not safe for AI agent execution. It should be explicit and documented by an upper layer.

Passthrough is not implemented in `privenv-guest` yet, and it is not a Host-side mode.
