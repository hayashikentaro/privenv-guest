import { isJsonObject } from "../types/json.js";

export class RequestValidationError extends Error {
  readonly code = "request.validation_error";
}

export const FORBIDDEN_PARAM_KEYS = new Set([
  "command",
  "program",
  "args",
  "argv",
  "shell",
  "env",
  "timeout",
  "timeoutMs",
  "secret",
  "token",
  "credential"
]);

export function validateRequestParams(params: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (params === undefined) {
    return undefined;
  }
  if (!isJsonObject(params)) {
    throw new RequestValidationError("EffectRequest params must be a JSON object when provided.");
  }

  validateObject(params, "params");
  return { ...params };
}

function validateObject(value: Record<string, unknown>, path: string): void {
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_PARAM_KEYS.has(key)) {
      throw new RequestValidationError(`${path}.${key} is forbidden in Guest-created EffectRequest params.`);
    }
    if (typeof child === "string" && containsSecretLikeValue(child)) {
      throw new RequestValidationError(`${path}.${key} contains a suspicious secret-like value.`);
    }
    if (isJsonObject(child)) {
      validateObject(child, `${path}.${key}`);
    }
    if (Array.isArray(child)) {
      child.forEach((entry, index) => validateArrayEntry(entry, `${path}.${key}[${index}]`));
    }
  }
}

function validateArrayEntry(value: unknown, path: string): void {
  if (typeof value === "string" && containsSecretLikeValue(value)) {
    throw new RequestValidationError(`${path} contains a suspicious secret-like value.`);
  }
  if (isJsonObject(value)) {
    validateObject(value, path);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => validateArrayEntry(entry, `${path}[${index}]`));
  }
}

function containsSecretLikeValue(value: string): boolean {
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
