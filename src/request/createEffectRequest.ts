import { randomUUID } from "node:crypto";
import { findCapability } from "../manifest/index.js";
import type { GuestManifest } from "../manifest/index.js";
import type { EffectRequest } from "../protocol/index.js";
import { validateRequestParams } from "../validation/index.js";

export class UnknownCapabilityError extends Error {
  readonly code = "request.unknown_capability";
}

export interface CreateEffectRequestInput {
  manifest: GuestManifest;
  capabilityId: string;
  id?: string;
  params?: Record<string, unknown>;
  metadata?: EffectRequest["metadata"];
}

export function createEffectRequest(input: CreateEffectRequestInput): EffectRequest {
  if (!findCapability(input.manifest, input.capabilityId)) {
    throw new UnknownCapabilityError(`Unknown capabilityId: ${input.capabilityId}`);
  }

  const params = validateRequestParams(input.params);
  const request: EffectRequest = {
    id: input.id ?? `req_${randomUUID()}`,
    type: "effect.request",
    capabilityId: input.capabilityId
  };

  if (params !== undefined) {
    request.params = params;
  }
  if (input.metadata !== undefined) {
    request.metadata = { ...input.metadata };
  }

  return request;
}
