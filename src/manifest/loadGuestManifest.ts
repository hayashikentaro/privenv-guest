import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ProtocolValidationError, validateGuestManifest as validateSharedGuestManifest } from "@privenv/protocol";
import type { GuestManifest, ManifestCapability } from "@privenv/protocol";
import { ManifestLoadError, ManifestValidationError } from "./errors.js";

export const GUEST_MANIFEST_FILENAME = "privenv.manifest.json";

export async function loadGuestManifestFromCwd(cwd: string = process.cwd()): Promise<GuestManifest> {
  return loadGuestManifestFile(join(cwd, GUEST_MANIFEST_FILENAME));
}

export async function loadGuestManifestFile(path: string): Promise<GuestManifest> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch {
    throw new ManifestLoadError("Guest manifest must be readable JSON.");
  }

  try {
    return validateGuestManifest(parsed);
  } catch (error) {
    if (error instanceof ProtocolValidationError) {
      throw new ManifestValidationError(`Guest manifest contains suspicious or invalid protocol data: ${error.message}`);
    }
    throw error;
  }
}

export function validateGuestManifest(value: unknown): GuestManifest {
  return validateSharedGuestManifest(value);
}

export function findCapability(manifest: GuestManifest, capabilityId: string): ManifestCapability | undefined {
  return manifest.capabilities.find((capability) => capability.id === capabilityId);
}
