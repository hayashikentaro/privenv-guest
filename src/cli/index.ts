#!/usr/bin/env node

import { loadGuestManifestFromCwd } from "../manifest/index.js";
import { createEffectRequest } from "../request/index.js";

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

async function main(): Promise<void> {
  const result = await runCli({ args: process.argv.slice(2), cwd: process.cwd() });
  if (result.stderr.length > 0) {
    process.stderr.write(result.stderr);
  }
  process.stdout.write(result.stdout);
  process.exitCode = result.exitCode;
}

export async function runCli(input: { args: string[]; cwd: string }): Promise<CliResult> {
  const parsed = parseArgs(input.args);
  if (!parsed.ok) {
    return { stdout: "", stderr: `${parsed.message}\n`, exitCode: 1 };
  }

  try {
    const manifest = await loadGuestManifestFromCwd(input.cwd);
    if (parsed.command === "list") {
      return { stdout: `${JSON.stringify({ type: "capability.list", capabilities: manifest.capabilities })}\n`, stderr: "", exitCode: 0 };
    }

    const request = createEffectRequest({ manifest, capabilityId: parsed.capabilityId });
    return { stdout: `${JSON.stringify(request)}\n`, stderr: "", exitCode: 0 };
  } catch (error) {
    const code = error instanceof Error && "code" in error && typeof error.code === "string" ? error.code : "guest.error";
    const message = error instanceof Error ? error.message : "Unknown Guest error.";
    return {
      stdout: `${JSON.stringify({ ok: false, type: "guest.error", error: { code, message } })}\n`,
      stderr: "",
      exitCode: 1
    };
  }
}

function parseArgs(args: string[]):
  | { ok: true; command: "list" }
  | { ok: true; command: "request"; capabilityId: string }
  | { ok: false; message: string } {
  const [command, capabilityId, ...extra] = args;
  if (command === "list" && capabilityId === undefined && extra.length === 0) {
    return { ok: true, command: "list" };
  }
  if (command === "request" && typeof capabilityId === "string" && capabilityId.length > 0 && extra.length === 0) {
    return { ok: true, command: "request", capabilityId };
  }
  return { ok: false, message: "Usage: privenv-guest list | privenv-guest request <capabilityId>" };
}

if (process.argv[1]?.endsWith("dist/src/cli/index.js") || process.argv[1]?.endsWith("src/cli/index.ts")) {
  await main();
}
