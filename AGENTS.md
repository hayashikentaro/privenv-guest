# AGENTS.md

Guidance for future Codex agents working in `privenv-guest`.

## Repository Boundary

- Work only in this repository: `privenv-guest`.
- Do not inspect sibling repositories.
- Do not inspect `privenv-host`.
- Do not infer requirements from sibling repositories or unrelated projects.
- If you need Host details, stop and report that need instead of inspecting `privenv-host`.
- If you are not in `privenv-guest`, stop and report it.

## Current Stage

- This repository is documentation-only.
- Do not add runtime implementation unless explicitly asked.
- Do not create `package.json` unless explicitly asked.
- Do not install dependencies unless explicitly asked.

## Host/Guest Boundary

- Preserve the Host/Guest boundary in every document and design change.
- The Guest is untrusted and reads `privenv.manifest.json` only.
- The Guest creates `EffectRequest` JSON only.
- The Guest must never read `.env`, `.env.*`, `privenv.host.json`, `.privenv/vault.json`, `.privenv/audit.log.jsonl`, browser sessions, or raw secret material.
- Never add APIs that read raw secrets.
- Never introduce `getSecret()`, `getEnv()`, `rawEnv()`, raw vault readers, or raw `.env` readers.

## Examples and Tests

- Keep examples fixture-only and obviously fake.
- Never commit realistic credentials, tokens, SSH keys, OAuth tokens, PII, browser sessions, or production-looking secrets.
- Passthrough mode is conceptual only and not for AI agent execution.
