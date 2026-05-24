import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { validateGuestManifest } from "../../src/manifest/index.js";
import type { EffectRequest, EffectResponse, RedactionSummary } from "../../src/protocol/index.js";
import { createEffectRequest } from "../../src/request/index.js";
import { validateRequestParams } from "../../src/validation/index.js";

const fixtureDir = join(process.cwd(), "tests", "fixtures", "protocol");
const fixtureFiles = [
  "effect-request.valid.json",
  "effect-response.success.json",
  "effect-response.error.json",
  "manifest.valid.json"
];

test("valid EffectRequest fixture can be created by request builder", () => {
  const manifest = validateGuestManifest(readFixture("manifest.valid.json"));
  const fixture = assertEffectRequest(readFixture("effect-request.valid.json"));
  const created = createEffectRequest({
    manifest,
    capabilityId: fixture.capabilityId,
    id: fixture.id,
    metadata: fixture.metadata
  });

  assert.deepEqual(created, fixture);
});

test("EffectResponse success fixture matches local protocol shape", () => {
  const response = assertEffectResponse(readFixture("effect-response.success.json"));

  assert.equal(response.ok, true);
  assert.equal(response.type, "effect.response");
  assert.equal(response.result?.exitCode, 0);
});

test("EffectResponse error fixture matches local protocol shape", () => {
  const response = assertEffectResponse(readFixture("effect-response.error.json"));

  assert.equal(response.ok, false);
  assert.equal(response.type, "effect.response");
  assert.equal(response.error?.code, "fixture.error");
});

test("manifest fixture loads successfully", () => {
  const manifest = validateGuestManifest(readFixture("manifest.valid.json"));

  assert.equal(manifest.version, "0.1");
  assert.equal(manifest.capabilities[0]?.id, "cmd.npm.test");
});

test("protocol fixtures contain no secret-like values", () => {
  for (const file of fixtureFiles) {
    const content = readFileSync(join(fixtureDir, file), "utf8");
    assert.doesNotMatch(content, /fixture_secret_value_\d+|test_only_token_do_not_use/i);
    assert.doesNotMatch(content, /sk-[A-Za-z0-9_-]{8,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._-]+|postgres:\/\//i);
  }
});

test("request fixture contains no forbidden params", () => {
  const request = assertEffectRequest(readFixture("effect-request.valid.json"));

  validateRequestParams(request.params);
  assert.equal("params" in request, false);
});

function readFixture(name: string): unknown {
  return JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
}

function assertEffectRequest(value: unknown): EffectRequest {
  assertJsonObject(value);
  assert.equal(value.type, "effect.request");
  assert.equal(typeof value.id, "string");
  assert.equal(typeof value.capabilityId, "string");
  if ("params" in value) {
    assertJsonObject(value.params);
  }
  if ("metadata" in value && value.metadata !== undefined) {
    assertJsonObject(value.metadata);
  }
  return value as unknown as EffectRequest;
}

function assertEffectResponse(value: unknown): EffectResponse {
  assertJsonObject(value);
  assert.equal(value.type, "effect.response");
  assert.equal(typeof value.requestId, "string");
  assert.equal(typeof value.ok, "boolean");
  assert.equal(typeof value.auditId, "string");

  if (value.ok === true) {
    assertJsonObject(value.result);
    if ("redactions" in value.result && value.result.redactions !== undefined) {
      assert.equal(Array.isArray(value.result.redactions), true);
      const redactions = value.result.redactions as unknown[];
      for (const redaction of redactions) {
        assertRedactionSummary(redaction);
      }
    }
  } else {
    assertJsonObject(value.error);
    assert.equal(typeof value.error.code, "string");
    assert.equal(typeof value.error.message, "string");
  }

  return value as unknown as EffectResponse;
}

function assertRedactionSummary(value: unknown): RedactionSummary {
  assertJsonObject(value);
  assert.equal(value.stream === "stdout" || value.stream === "stderr" || value.stream === "error", true);
  assert.equal(typeof value.count, "number");
  assert.equal(value.reason === "secret" || value.reason === "sensitive-pattern" || value.reason === "policy", true);
  return value as unknown as RedactionSummary;
}

function assertJsonObject(value: unknown): asserts value is Record<string, unknown> {
  assert.equal(typeof value, "object");
  assert.notEqual(value, null);
  assert.equal(Array.isArray(value), false);
}
