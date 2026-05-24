# AGENTS.md

Guidance for future Codex agents working in `privenv-guest`.

## Repository Boundary

- Work only in this repository: `privenv-guest`.
- Do not inspect sibling repositories.
- Do not inspect `privenv-host`.
- Do not inspect `privenv-protocol`.
- Do not infer requirements from sibling repositories or unrelated projects.
- If you need Host details, stop and report that need instead of inspecting `privenv-host`.
- Do not inspect `privenv-host` to compare protocol compatibility. Request an explicit copied spec or shared protocol package instead.
- Do not inspect `privenv-protocol` to compare protocol compatibility. Use the published `@privenv/protocol` package and explicit release notes or copied specs.
- Do not update architecture snapshots by inspecting `privenv-host`; use only local docs and explicit copied specs.
- If you are not in `privenv-guest`, stop and report it.

## Current Stage

- This repository has a minimal TypeScript Guest-side toolkit skeleton.
- The skeleton can read `privenv.manifest.json`, list capabilities, create safe `EffectRequest` JSON, and reject forbidden request params.
- Shared protocol types and validators come from `@privenv/protocol`.
- Guest-specific file loading and CLI behavior remain local.
- Do not implement Host runtime.
- Do not implement transport to Host unless explicitly asked.
- Do not implement stdio client unless explicitly asked.
- Do not implement passthrough behavior unless explicitly asked.

## Guest-Only Scope

- Preserve the Guest-only scope in every document, type, test, and design change.
- The Guest is untrusted and reads `privenv.manifest.json` only.
- The Guest creates `EffectRequest` JSON only.
- The Guest must never read `.env`, `.env.*`, `privenv.host.json`, `.privenv/vault.json`, `.privenv/audit.log.jsonl`, browser sessions, or raw secret material.
- Never add APIs that read raw secrets.
- Never introduce `getSecret()`, `getEnv()`, `rawEnv()`, raw vault readers, or raw `.env` readers.

## Package Hygiene

- Package checks must keep Host-owned files out of npm pack output.
- Do not package `.env`, `.env.*`, `.privenv/`, `privenv.host.json`, vault files, audit logs, `src/`, `tests/`, or `dist/tests/`.
- Do not add deploy, npm publish, or secret-requiring CI behavior unless explicitly requested.

## Examples and Tests

- Keep examples fixture-only and obviously fake.
- Never commit realistic credentials, tokens, SSH keys, OAuth tokens, PII, browser sessions, or production-looking secrets.
- Passthrough mode is conceptual only and not for AI agent execution.
