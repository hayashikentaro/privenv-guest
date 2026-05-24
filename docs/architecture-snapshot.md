# Architecture Snapshot

This snapshot records the current architecture direction for `privenv-guest` without inspecting sibling repositories.

## Current Repos

### privenv-guest

`privenv-guest` is the untrusted Guest-side component.

It currently:

- reads Host-generated safe manifest files: `privenv.manifest.json`
- lists capabilities from the safe manifest
- creates `EffectRequest` JSON
- rejects forbidden request params such as raw command, env, timeout, and secret fields
- depends on `@privenv/protocol` for shared protocol types and validators
- never reads `.env`, `privenv.host.json`, `.privenv/vault.json`, audit logs, browser sessions, or raw secrets
- has no transport implementation yet
- has no passthrough implementation yet

The package is a Guest-side toolkit. It does not execute Host effects.

### privenv-host

Conceptually, `privenv-host` is the trusted Host-side component.

By the local Guest-side design contract, the Host:

- owns Host config, vault, audit logs, redaction, policy, and execution context
- generates the safe manifest consumed by the Guest
- handles `EffectRequest`
- returns redacted `EffectResponse`
- is currently assumed to be simulate-only by this Guest snapshot
- has no real command execution assumed by this Guest snapshot

This document does not claim implementation details from `privenv-host` beyond the explicit design contract documented locally in this repository.

## Current Protocol

`privenv-guest` and `privenv-host` must agree on:

- `EffectRequest`
- `EffectResponse`
- `RedactionSummary`
- safe manifest shape

Shared protocol types and validators now come from `@privenv/protocol`.

Guest-specific manifest file loading, capability listing, request creation, CLI behavior, and error formatting remain local to `privenv-guest`.

Protocol updates should be handled by updating the `@privenv/protocol` package version and reviewing explicit release notes or copied specs. Guest work must not inspect `privenv-host` or the `privenv-protocol` repository to verify compatibility.

## Current Workflow

### Guest-side workflow

```sh
privenv-guest list
privenv-guest request <capabilityId>
```

Conceptually:

```text
read privenv.manifest.json
list capabilities
create EffectRequest
send EffectRequest to Host by an external/stdin workflow later
receive redacted EffectResponse
```

Transport is not implemented yet. The CLI prints request JSON; it does not send it to a Host.

### Host-side conceptual workflow

```text
Host generates privenv.manifest.json
Host receives EffectRequest
Host returns redacted EffectResponse
```

This Host-side workflow is only the local design contract from the Guest perspective.

## Explicit Non-Goals

Current non-goals:

- no transport to Host yet
- no Host runtime
- no Host-owned file reads
- no passthrough behavior
- no raw secret APIs such as `getSecret()`, `getEnv()`, or `rawEnv()`
- no `.env` reading
- no browser, session, or cookie handling in the current MVP
- no local duplicated shared protocol type or validator ownership

## Next Decision Points

Open decisions include:

- whether to implement stdio transport orchestration
- whether Guest should remain transportless longer
- when to update to newer `@privenv/protocol` versions
- how passthrough should be represented at an upper layer
- how future browser, session, or cookie capabilities should be represented without giving Guest credentials
