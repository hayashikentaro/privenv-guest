# Examples

All examples use obviously fake values. Do not put real credentials, tokens, PII, OAuth tokens, SSH keys, browser session data, or production-looking secrets in Guest examples.

## privenv.manifest.json

The Guest reads this Host-generated safe manifest.

```json
{
  "version": "0.1",
  "capabilities": [
    {
      "id": "cmd.npm.test",
      "kind": "command",
      "description": "Run npm test.",
      "command": {
        "program": "npm",
        "args": ["test"]
      },
      "env": []
    },
    {
      "id": "cmd.example.with.env",
      "kind": "command",
      "description": "Run npm test with an example Host-owned env reference.",
      "command": {
        "program": "npm",
        "args": ["test"]
      },
      "env": [
        {
          "name": "EXAMPLE_SERVICE_TOKEN",
          "source": "secret",
          "exposedToGuest": false
        }
      ]
    }
  ]
}
```

The manifest may contain env names, but never env values.

## Capability Listing

A Guest may display manifest capabilities like this:

```text
cmd.npm.test              Run npm test.
cmd.example.with.env      Run npm test with an example Host-owned env reference.
```

The listing is derived from `privenv.manifest.json` only.

## EffectRequest

```json
{
  "id": "req_001",
  "type": "effect.request",
  "capabilityId": "cmd.npm.test",
  "metadata": {
    "guestName": "example-guest",
    "guestRunId": "example-run-001",
    "reason": "example protected request"
  }
}
```

The request does not include `command`, `program`, `args`, `argv`, `shell`, `env`, `timeout`, `timeoutMs`, or secret values.

## EffectResponse

```json
{
  "requestId": "req_001",
  "type": "effect.response",
  "ok": true,
  "result": {
    "exitCode": 0,
    "stdout": "fake host output\n",
    "stderr": "",
    "redactions": []
  },
  "auditId": "audit_req_001"
}
```

The Guest sees redacted Host output only.

## Protected Mode

```text
Guest reads privenv.manifest.json
Guest selects cmd.npm.test
Guest sends EffectRequest
Host executes approved effect
Host returns redacted EffectResponse
```

Protected mode is the right model for AI agent execution.

## Demo Mode

```text
Guest reads fixture manifest
Guest creates fixture EffectRequest
Host or example harness returns fixture EffectResponse
No real secrets exist
```

Demo mode is for examples and tests only.

## Passthrough Mode

```text
Trusted runtime chooses passthrough explicitly
No untrusted Guest boundary is active
No AI agent receives secret access through privenv-guest
```

Passthrough is conceptual and not implemented. It is not safe for AI agent execution.
