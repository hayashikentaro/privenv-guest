import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadGuestManifestFromCwd, ManifestValidationError } from "../../src/manifest/index.js";
import { VALID_MANIFEST } from "../fixtures/manifest.js";

test("valid manifest loads", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-manifest-valid-"));
  writeFileSync(join(cwd, "privenv.manifest.json"), JSON.stringify(VALID_MANIFEST), "utf8");

  const manifest = await loadGuestManifestFromCwd(cwd);

  assert.equal(manifest.version, "0.1");
  assert.equal(manifest.capabilities.length, 2);
  assert.equal(manifest.capabilities[1]?.env[0]?.name, "EXAMPLE_SERVICE_TOKEN");
  assert.equal(manifest.capabilities[1]?.env[0]?.exposedToGuest, false);
});

test("invalid manifest rejected", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-manifest-invalid-"));
  writeFileSync(
    join(cwd, "privenv.manifest.json"),
    JSON.stringify({
      version: "0.1",
      capabilities: [
        {
          id: "cmd.bad",
          kind: "command",
          description: "Bad manifest",
          env: [{ name: "EXAMPLE_TOKEN", exposedToGuest: true }]
        }
      ]
    }),
    "utf8"
  );

  await assert.rejects(() => loadGuestManifestFromCwd(cwd), ManifestValidationError);
});

test("manifest rejects obvious secret-like values", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "privenv-guest-manifest-secret-like-"));
  writeFileSync(
    join(cwd, "privenv.manifest.json"),
    JSON.stringify({
      version: "0.1",
      capabilities: [
        {
          id: "cmd.bad",
          kind: "command",
          description: "token=fixture_secret_value_123",
          env: []
        }
      ]
    }),
    "utf8"
  );

  await assert.rejects(() => loadGuestManifestFromCwd(cwd), /suspicious/);
});
