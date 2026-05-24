import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { runCli } from "../../src/cli/index.js";
import { VALID_MANIFEST } from "../fixtures/manifest.js";

function writeManifest(cwd: string): void {
  writeFileSync(join(cwd, "privenv.manifest.json"), JSON.stringify(VALID_MANIFEST), "utf8");
}

test("list returns capability metadata", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-cli-list-"));
  writeManifest(cwd);

  const result = await runCli({ args: ["list"], cwd });

  assert.equal(result.exitCode, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.type, "capability.list");
  assert.equal(payload.capabilities[0].id, "cmd.npm.test");
  assert.equal(payload.capabilities[1].env[0].name, "EXAMPLE_SERVICE_TOKEN");
  assert.equal(payload.capabilities[1].env[0].exposedToGuest, false);
});

test("request command creates EffectRequest JSON", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-cli-request-"));
  writeManifest(cwd);

  const result = await runCli({ args: ["request", "cmd.npm.test"], cwd });

  assert.equal(result.exitCode, 0);
  const request = JSON.parse(result.stdout);
  assert.equal(request.type, "effect.request");
  assert.equal(request.capabilityId, "cmd.npm.test");
  assert.equal("params" in request, false);
});

test("request command rejects unknown capability", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-cli-request-unknown-"));
  writeManifest(cwd);

  const result = await runCli({ args: ["request", "cmd.unknown"], cwd });

  assert.equal(result.exitCode, 1);
  const error = JSON.parse(result.stdout);
  assert.equal(error.type, "guest.error");
  assert.equal(error.error.code, "request.unknown_capability");
});
