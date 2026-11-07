#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { auditRepository, renderMarkdown } from "./audit.mjs";

function usage() {
  return `Detectiverx — read-only repository audit

Usage:
  node src/cli.mjs [options]

Options:
  --root <path>             Repository directory to inspect (default: current directory)
  --format <markdown|json>  Report format (default: markdown)
  --output <path>           Create a new report file; existing files are never overwritten
  --max-files <number>      Maximum files to inspect (default: 10000)
  --max-file-bytes <number> Maximum size of one file (default: 1048576)
  --max-total-bytes <number> Maximum total bytes read (default: 52428800)
  --max-depth <number>      Maximum directory depth (default: 12)
  --help                    Show this help

Safety:
  - Does not execute repository code or install dependencies.
  - Does not make network requests or call GitHub APIs.
  - Skips symlinks and common dependency/build directories.
  - Redacts detected credential values from reports.
  - Writes a report only when --output is explicitly supplied.
`;
}

function parsePositiveInteger(value, flag) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} must be a positive safe integer.`);
  }
  return parsed;
}

function parseArguments(args) {
  const options = {
    root: process.cwd(),
    format: "markdown",
    output: null,
    limits: {},
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === "--help" || flag === "-h") {
      options.help = true;
      continue;
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }

    if (flag === "--root") options.root = resolve(value);
    else if (flag === "--format") options.format = value;
    else if (flag === "--output") options.output = resolve(value);
    else if (flag === "--max-files") options.limits.maxFiles = parsePositiveInteger(value, flag);
    else if (flag === "--max-file-bytes") options.limits.maxFileBytes = parsePositiveInteger(value, flag);
    else if (flag === "--max-total-bytes") options.limits.maxTotalBytes = parsePositiveInteger(value, flag);
    else if (flag === "--max-depth") options.limits.maxDepth = parsePositiveInteger(value, flag);
    else throw new Error(`Unknown option: ${flag}.`);
    index += 1;
  }

  if (!["markdown", "json"].includes(options.format)) {
    throw new Error("--format must be either markdown or json.");
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const report = await auditRepository(options.root, { limits: options.limits });
  const output =
    options.format === "json"
      ? `${JSON.stringify(report, null, 2)}\n`
      : renderMarkdown(report);

  if (options.output) {
    await writeFile(options.output, output, { encoding: "utf8", flag: "wx" });
    process.stdout.write(`Report created: ${options.output}\n`);
  } else {
    process.stdout.write(output);
  }

  if (report.summary.critical > 0 || report.summary.high > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`Detectiverx error: ${error.message}\n`);
  process.exitCode = 2;
});
