import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isJsonObject } from "../types/json.js";
import { ManifestLoadError, ManifestValidationError } from "./errors.js";
import type { GuestManifest, ManifestCapability, ManifestEnvReference } from "./types.js";

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

  return validateGuestManifest(parsed);
}

export function validateGuestManifest(value: unknown): GuestManifest {
  if (!isJsonObject(value)) {
    throw new ManifestValidationError("Guest manifest must be a JSON object.");
  }
  if (typeof value.version !== "string" || value.version.length === 0) {
    throw new ManifestValidationError("Guest manifest version must be a non-empty string.");
  }
  assertSafeString(value.version, "version");
  if (!Array.isArray(value.capabilities)) {
    throw new ManifestValidationError("Guest manifest capabilities must be an array.");
  }

  return {
    version: value.version,
    capabilities: value.capabilities.map((capability, index) => validateCapability(capability, index))
  };
}

export function findCapability(manifest: GuestManifest, capabilityId: string): ManifestCapability | undefined {
  return manifest.capabilities.find((capability) => capability.id === capabilityId);
}

function validateCapability(value: unknown, index: number): ManifestCapability {
  if (!isJsonObject(value)) {
    throw new ManifestValidationError(`Capability at index ${index} must be an object.`);
  }

  const id = readSafeString(value.id, `capabilities[${index}].id`);
  const description = readSafeString(value.description, `capabilities[${index}].description`);
  if (value.kind !== "command") {
    throw new ManifestValidationError(`Capability ${id} kind must be "command".`);
  }

  let command: ManifestCapability["command"];
  if ("command" in value && value.command !== undefined) {
    if (!isJsonObject(value.command)) {
      throw new ManifestValidationError(`Capability ${id} command must be an object.`);
    }
    const program = readSafeString(value.command.program, `capabilities[${index}].command.program`);
    if (!Array.isArray(value.command.args)) {
      throw new ManifestValidationError(`Capability ${id} command.args must be an array.`);
    }
    const args = value.command.args.map((arg, argIndex) => readSafeString(arg, `capabilities[${index}].command.args[${argIndex}]`));
    command = { program, args };
  }

  if (!Array.isArray(value.env)) {
    throw new ManifestValidationError(`Capability ${id} env must be an array.`);
  }
  const env = value.env.map((entry, envIndex) => validateEnvReference(entry, id, envIndex));

  return { id, kind: "command", description, command, env };
}

function validateEnvReference(value: unknown, capabilityId: string, index: number): ManifestEnvReference {
  if (!isJsonObject(value)) {
    throw new ManifestValidationError(`Capability ${capabilityId} env[${index}] must be an object.`);
  }
  if (typeof value.name !== "string" || value.name.length === 0) {
    throw new ManifestValidationError(`Capability ${capabilityId} env[${index}].name must be a non-empty string.`);
  }
  if (value.source !== undefined && value.source !== "secret") {
    throw new ManifestValidationError(`Capability ${capabilityId} env[${index}].source must be "secret" when present.`);
  }
  if (value.exposedToGuest !== false) {
    throw new ManifestValidationError(`Capability ${capabilityId} env[${index}].exposedToGuest must be false.`);
  }

  const allowedKeys = new Set(["name", "source", "exposedToGuest"]);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      throw new ManifestValidationError(`Capability ${capabilityId} env[${index}] contains unsupported field "${key}".`);
    }
  }

  return { name: value.name, source: value.source === "secret" ? "secret" : undefined, exposedToGuest: false };
}

function readSafeString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new ManifestValidationError(`${path} must be a non-empty string.`);
  }
  assertSafeString(value, path);
  return value;
}

function assertSafeString(value: string, path: string): void {
  if (containsSuspiciousSecretLikeString(value)) {
    throw new ManifestValidationError(`${path} contains a suspicious secret-like value.`);
  }
}

function containsSuspiciousSecretLikeString(value: string): boolean {
  return [
    /fixture_secret_value_\d+/i,
    /test_only_token_do_not_use/i,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\bsk-[A-Za-z0-9_-]{8,}/,
    /bearer\s+[A-Za-z0-9._-]{8,}/i,
    /password\s*[:=]\s*[^\s]+/i,
    /token\s*[:=]\s*[^\s]+/i,
    /secret\s*[:=]\s*[^\s]+/i
  ].some((pattern) => pattern.test(value));
}
