import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { auditRepository, renderMarkdown } from "../src/audit.mjs";

async function makeRepository(t) {
  const root = await mkdtemp(join(tmpdir(), "detectiverx-test-"));
  t.after(async () => rm(root, { recursive: true, force: true }));
  return root;
}

async function addFile(root, path, content) {
  const destination = join(root, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
  return destination;
}

test("detects mutable workflow actions, missing permissions, and missing lockfiles", async (t) => {
  const root = await makeRepository(t);
  await addFile(
    root,
    ".github/workflows/ci.yml",
    [
      "name: CI",
      "on: push",
      "jobs:",
      "  build:",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "",
    ].join("\n"),
  );
  await addFile(
    root,
    "package.json",
    JSON.stringify({ name: "sample", dependencies: { example: "1.0.0" }, scripts: { test: "node --test" } }),
  );

  const report = await auditRepository(root);
  assert.ok(report.findings.some((item) => item.title.includes("immutable commit")));
  assert.ok(report.findings.some((item) => item.title.includes("token permissions")));
  assert.ok(report.findings.some((item) => item.title.includes("lockfile")));
  await addFile(root, ".github/workflows/deploy.yml", "permissions: write-all\\n");
  const expanded = await auditRepository(root);
  assert.ok(expanded.findings.some((item) => item.title.includes("write-all")));
  assert.equal(report.mode, "read-only-static");
});

test("reports credential filenames without reading or disclosing their contents", async (t) => {
  const root = await makeRepository(t);
  const secret = "never-print-this-test-secret-123456789";
  await addFile(root, ".env.production", `API_KEY=${secret}\n`);

  const report = await auditRepository(root);
  const serialized = JSON.stringify(report);
  assert.ok(report.findings.some((item) => item.title.includes("Credential-bearing file")));
  assert.equal(serialized.includes(secret), false);
  assert.ok(report.findings.some((item) => item.evidence.includes("File contents were not read")));
});

test("redacts credential-like assignments in ordinary text files", async (t) => {
  const root = await makeRepository(t);
  const secret = "ghp_examplebutlongenoughtobeclassified123456";
  await addFile(root, "config.txt", `API_KEY=${secret}\n`);

  const report = await auditRepository(root);
  const serialized = JSON.stringify(report);
  assert.ok(report.findings.some((item) => item.title === "Possible hard-coded credential"));
  assert.equal(serialized.includes(secret), false);
});

test("does not follow symbolic links outside the repository", async (t) => {
  const root = await makeRepository(t);
  const outside = await makeRepository(t);
  const secret = "outside-secret-value-should-not-be-read-123";
  const target = await addFile(outside, "private.txt", `API_KEY=${secret}\n`);
  await symlink(target, join(root, "linked-secret.txt"));

  const report = await auditRepository(root);
  assert.equal(JSON.stringify(report).includes(secret), false);
  assert.equal(report.findings.some((item) => item.path === "linked-secret.txt"), false);
  assert.ok(report.stats.skippedFiles >= 1);
});


test("detects private-key headers and allows sanitized environment examples", async (t) => {
  const root = await makeRepository(t);
  await addFile(root, "keys/private.txt", "-----BEGIN PRIVATE KEY-----\\nredacted-material\\n");
  await addFile(root, ".env.example", "API_KEY=your-placeholder-value\\n");
  const report = await auditRepository(root);
  assert.ok(report.findings.some((item) => item.title === "Private key material detected"));
  assert.equal(report.findings.some((item) => item.path === ".env.example"), false);
  assert.equal(JSON.stringify(report).includes("redacted-material"), false);
});
test("accepts a clean manifest when a lockfile and test script exist", async (t) => {
  const root = await makeRepository(t);
  await addFile(
    root,
    "package.json",
    JSON.stringify({ name: "clean", dependencies: {}, scripts: { test: "node --test" } }),
  );
  await addFile(root, "pnpm-lock.yaml", "lockfileVersion: '9.0'\n");

  const report = await auditRepository(root);
  assert.equal(report.summary.total, 0);
  assert.match(renderMarkdown(report), /No findings were detected/);
});

test("reports when configured safety limits prevent a complete scan", async (t) => {
  const root = await makeRepository(t);
  await addFile(root, "a.txt", "first");
  await addFile(root, "b.txt", "second");

  const report = await auditRepository(root, { limits: { maxFiles: 1 } });
  assert.equal(report.stats.limitReached, true);
  assert.ok(report.findings.some((item) => item.title.includes("safety limit")));
});

test("CLI prints JSON and never writes a report unless --output is explicit", async (t) => {
  const root = await makeRepository(t);
  await addFile(root, "README.md", "# Example\n");
  const cli = resolve("src/cli.mjs");
  const result = spawnSync(process.execPath, [cli, "--root", root, "--format", "json"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.mode, "read-only-static");
  assert.equal(report.summary.total, 0);
  assert.equal(result.stderr, "");
});
