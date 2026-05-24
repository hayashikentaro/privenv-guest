import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const forbidden = [
  /["']\.env["']/,
  /["']\.env\.\*["']/,
  new RegExp(`["']${["privenv", ".", "host", ".", "json"].join("")}["']`),
  new RegExp(`["']${[".", "privenv", "/", "vault", ".", "json"].join("")}["']`),
  new RegExp(["get", "Secret"].join("")),
  new RegExp(["get", "Env"].join("")),
  new RegExp(["raw", "Env"].join(""))
];

test("source does not read forbidden Host-owned files or expose raw secret APIs", () => {
  for (const file of listFiles(join(process.cwd(), "src"))) {
    const content = readFileSync(file, "utf8");
    for (const pattern of forbidden) {
      assert.equal(pattern.test(content), false, `${file} must not match ${pattern}`);
    }
  }
});

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}
