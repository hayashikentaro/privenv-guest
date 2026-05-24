import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  PROTOCOL_VERSION,
  validateEffectRequest,
  validateEffectResponse,
  validateGuestManifest as validateSharedGuestManifest,
  validateRequestParams as validateSharedRequestParams
} from "@privenv/protocol";
import { validateGuestManifest } from "../../src/manifest/index.js";
import { createEffectRequest } from "../../src/request/index.js";

const fixtureDir = join(process.cwd(), "tests", "fixtures", "protocol");
const fixtureFiles = [
  "effect-request.valid.json",
  "effect-response.success.json",
  "effect-response.error.json",
  "manifest.valid.json"
];

test("shared protocol version is available", () => {
  assert.equal(PROTOCOL_VERSION.startsWith("0.1"), true);
});

test("valid EffectRequest fixture can be created by request builder", () => {
  const manifest = validateGuestManifest(readFixture("manifest.valid.json"));
  const fixture = validateEffectRequest(readFixture("effect-request.valid.json"));
  const created = createEffectRequest({
    manifest,
    capabilityId: fixture.capabilityId,
    id: fixture.id,
    metadata: fixture.metadata
  });

  assert.deepEqual(created, fixture);
});

test("EffectResponse success fixture matches local protocol shape", () => {
  const response = validateEffectResponse(readFixture("effect-response.success.json"));

  assert.equal(response.ok, true);
  assert.equal(response.type, "effect.response");
  assert.equal(response.result?.exitCode, 0);
});

test("EffectResponse error fixture matches local protocol shape", () => {
  const response = validateEffectResponse(readFixture("effect-response.error.json"));

  assert.equal(response.ok, false);
  assert.equal(response.type, "effect.response");
  assert.equal(response.error?.code, "fixture.error");
});

test("manifest fixture loads successfully", () => {
  const manifest = validateGuestManifest(readFixture("manifest.valid.json"));

  assert.equal(manifest.version, "0.1");
  assert.equal(manifest.capabilities[0]?.id, "cmd.npm.test");
});

test("manifest fixture loads through shared validateGuestManifest", () => {
  const manifest = validateSharedGuestManifest(readFixture("manifest.valid.json"));

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
  const request = validateEffectRequest(readFixture("effect-request.valid.json"));

  validateSharedRequestParams(request.params);
  assert.equal("params" in request, false);
});

test("shared validateRequestParams rejects forbidden params recursively", () => {
  assert.throws(
    () => validateSharedRequestParams({ nested: { env: { EXAMPLE_SERVICE_TOKEN: "fake-placeholder" } } }),
    /request params must not include env/
  );
});

function readFixture(name: string): unknown {
  return JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
}
