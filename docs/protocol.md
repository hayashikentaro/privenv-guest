# Protocol

Phase 1 uses stdio JSON request/response with the Host. Phase 2 may add a future transport such as Unix domain socket.

This repository documents the Guest-side protocol only. It does not implement transport yet.

## EffectRequest

```ts
interface EffectRequest {
  id: string;
  type: "effect.request";
  capabilityId: string;
  params?: Record<string, unknown>;
  metadata?: {
    guestName?: string;
    guestRunId?: string;
    reason?: string;
  };
}
```

A Guest-created `EffectRequest` must reference a capability ID from `privenv.manifest.json`.

`params` must not include:

- `command`
- `program`
- `args`
- `argv`
- `shell`
- `env`
- `timeout`
- `timeoutMs`
- secret values

The Guest must never create secret-read requests.

## EffectResponse

```ts
interface EffectResponse {
  requestId: string;
  type: "effect.response";
  ok: boolean;
  result?: {
    exitCode?: number;
    stdout?: string;
    stderr?: string;
    redactions?: RedactionSummary[];
  };
  error?: {
    code: string;
    message: string;
  };
  auditId: string;
}

interface RedactionSummary {
  stream: "stdout" | "stderr" | "error";
  count: number;
  reason: "secret" | "sensitive-pattern" | "policy";
}
```

The Guest must treat all output as Host-redacted output. If raw secret material appears, that is a boundary violation.
