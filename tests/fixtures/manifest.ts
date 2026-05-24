import type { GuestManifest } from "../../src/manifest/index.js";

export const VALID_MANIFEST: GuestManifest = {
  version: "0.1",
  capabilities: [
    {
      id: "cmd.npm.test",
      kind: "command",
      description: "Run npm test.",
      command: { program: "npm", args: ["test"] },
      env: []
    },
    {
      id: "cmd.example.with.env",
      kind: "command",
      description: "Run npm test with an example Host-owned env reference.",
      command: { program: "npm", args: ["test"] },
      env: [{ name: "EXAMPLE_SERVICE_TOKEN", source: "secret", exposedToGuest: false }]
    }
  ]
};

export const FAKE_VALUES = ["example-placeholder-not-real", "fixture-value-not-a-secret", "fake-demo-token-not-real"];
