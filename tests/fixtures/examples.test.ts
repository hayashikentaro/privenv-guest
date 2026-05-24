import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const examples = readFileSync(join(process.cwd(), "docs", "examples.md"), "utf8");

test("documentation JSON examples are parseable", () => {
  const jsonBlocks = [...examples.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => match[1]);

  assert.equal(jsonBlocks.length, 3);
  for (const block of jsonBlocks) {
    JSON.parse(block);
  }
});

test("examples use obviously fake values only", () => {
  assert.doesNotMatch(examples, /sk-[A-Za-z0-9_-]{8,}|AKIA[A-Z0-9]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._-]+|postgres:\/\//i);
});
