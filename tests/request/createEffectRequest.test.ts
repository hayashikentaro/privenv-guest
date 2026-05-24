import assert from "node:assert/strict";
import test from "node:test";
import { ProtocolValidationError } from "@privenv/protocol";
import { createEffectRequest, UnknownCapabilityError } from "../../src/request/index.js";
import { VALID_MANIFEST } from "../fixtures/manifest.js";

test("request creates safe EffectRequest", () => {
  const request = createEffectRequest({ manifest: VALID_MANIFEST, capabilityId: "cmd.npm.test", id: "req_test_001" });

  assert.deepEqual(request, {
    id: "req_test_001",
    type: "effect.request",
    capabilityId: "cmd.npm.test"
  });
});

test("request unknown capability fails", () => {
  assert.throws(
    () => createEffectRequest({ manifest: VALID_MANIFEST, capabilityId: "cmd.unknown", id: "req_test_unknown" }),
    UnknownCapabilityError
  );
});

test("request builder rejects forbidden params", () => {
  for (const key of ["command", "program", "args", "argv", "shell", "env", "timeout", "timeoutMs", "secret", "token", "credential"]) {
    assert.throws(
      () =>
        createEffectRequest({
          manifest: VALID_MANIFEST,
          capabilityId: "cmd.npm.test",
          id: `req_forbidden_${key}`,
          params: { [key]: "example-placeholder-not-real" }
      }),
      ProtocolValidationError
    );
  }
});

test("request builder rejects nested forbidden params", () => {
  assert.throws(
    () =>
      createEffectRequest({
        manifest: VALID_MANIFEST,
        capabilityId: "cmd.npm.test",
        id: "req_nested_forbidden",
        params: { nested: { env: { EXAMPLE_TOKEN: "example-placeholder-not-real" } } }
      }),
    ProtocolValidationError
  );
});
