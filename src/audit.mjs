import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open, readdir } from "node:fs/promises";
import { basename, extname, join, relative, resolve, sep } from "node:path";

const DEFAULT_LIMITS = Object.freeze({
  maxFiles: 10_000,
  maxFileBytes: 1_048_576,
  maxTotalBytes: 50 * 1_048_576,
  maxDepth: 12,
});

const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  ".venv",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "vendor",
  "venv",
]);

const SECRET_DIRECTORY_PATTERN = /(^|\/)(?:\.aws|\.azure|\.docker|\.kube|\.ssh|\.terraform|\.vercel|\.config\/(?:gh|gcloud)|secrets?|credentials?|private[_-]?keys?)(?:\/|$)/i;
const SECRET_FILENAME_PATTERNS = [
  /^\.env(?:\.(?!example$|sample$|template$)[^/]+)?$/i,
  /^\.npmrc(?:\.[^/]*)?$/i,
  /^\.pypirc$/i,
  /^\.netrc$/i,
  /^\.git-credentials$/i,
  /^\.yarnrc(?:\.yml)?$/i,
  /^(?:id_rsa|id_ed25519|credentials\.json|service[-_]?account\.json)$/i,
  /\.(?:pem|key|p12|pfx|jks|keystore|tfstate|token)$/i,
];

const PRIVATE_KEY_PATTERN =
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i;
const SECRET_ASSIGNMENT_PATTERN =
  /^\s*(?:export\s+)?([A-Z0-9_]*(?:API[_-]?KEY|ACCESS[_-]?KEY|SECRET[_-]?KEY|TOKEN|SECRET|PASSWORD|DATABASE_URL|PRIVATE_KEY))\s*[:=]\s*["']?([^"'\s#]{20,})/i;

const SEVERITY_RANK = Object.freeze({
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
});

function normalizeLimits(overrides = {}) {
  const limits = {};
  for (const [key, fallback] of Object.entries(DEFAULT_LIMITS)) {
    const candidate = overrides[key];
    limits[key] =
      Number.isSafeInteger(candidate) && candidate > 0 ? candidate : fallback;
  }
  return limits;
}

function isExampleEnvironmentFile(path) {
  return /(^|\/)\.env(?:\.[^/]+)?\.(?:example|sample|template)$/i.test(path);
}

function secretFilenameType(path) {
  const normalized = path.replaceAll("\\", "/");
  const fileName = normalized.split("/").at(-1) ?? "";
  if (isExampleEnvironmentFile(normalized)) return null;
  if (SECRET_DIRECTORY_PATTERN.test(normalized)) return "credential or secret directory";
  if (SECRET_FILENAME_PATTERNS.some((pattern) => pattern.test(fileName))) {
    return fileName.startsWith(".env") ? "environment file" : "credential-bearing file";
  }
  return null;
}

function isPlaceholder(value) {
  return /^(?:your[-_ ]|replace[-_ ]|change[-_ ]|example|sample|dummy|placeholder|changeme|test|<)/i.test(
    value,
  );
}

function stableFindingId(finding) {
  return createHash("sha256")
    .update(
      [
        finding.severity,
        finding.path,
        finding.line ?? "",
        finding.title,
      ].join(":"),
    )
    .digest("hex")
    .slice(0, 12);
}

function addFinding(findings, finding) {
  const normalized = {
    confidence: "high",
    line: null,
    ...finding,
  };
  normalized.id = stableFindingId(normalized);
  findings.push(normalized);
}

function inspectSecretContent(text, path, findings) {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (PRIVATE_KEY_PATTERN.test(line)) {
      addFinding(findings, {
        severity: "critical",
        path,
        line: index + 1,
        title: "Private key material detected",
        evidence: "A private-key header is present. The matched content is intentionally redacted.",
        recommendation:
          "Remove the key from the repository, rotate it with its issuer, and store the replacement in a secret manager.",
      });
      continue;
    }

    const match = line.match(SECRET_ASSIGNMENT_PATTERN);
    if (match && !isPlaceholder(match[2])) {
      addFinding(findings, {
        severity: "high",
        path,
        line: index + 1,
        title: "Possible hard-coded credential",
        evidence: `A value is assigned to ${match[1]}. The value is intentionally redacted.`,
        recommendation:
          "Move the credential to the deployment secret store, rotate it, and ensure the file is excluded from version control.",
      });
    }
  }
}

function inspectWorkflow(text, path, findings) {
  const lines = text.split(/\r?\n/);
  let hasPermissions = false;
  let writeAll = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*permissions\s*:/i.test(line)) hasPermissions = true;
    if (/^\s*(?:permissions:\s*)?write-all\s*$/i.test(line)) writeAll = true;

    const usesMatch = line.match(/^\s*(?:-\s*)?uses:\s*([^\s#]+)/i);
    if (!usesMatch) continue;

    const action = usesMatch[1];
    if (action.startsWith("./") || action.startsWith("docker://")) continue;
    const separator = action.lastIndexOf("@");
    const ref = separator > 0 ? action.slice(separator + 1) : "";
    if (!/^[a-f0-9]{40}$/i.test(ref)) {
      addFinding(findings, {
        severity: "medium",
        path,
        line: index + 1,
        title: "GitHub Action is not pinned to an immutable commit",
        evidence: `The workflow references ${action} instead of a full 40-character commit SHA.`,
        recommendation:
          "Pin the action to a reviewed full commit SHA and retain the upstream version as a comment.",
      });
    }
  }

  if (!hasPermissions) {
    addFinding(findings, {
      severity: "medium",
      path,
      title: "Workflow does not declare token permissions",
      evidence: "No permissions block was found in this workflow.",
      recommendation:
        "Declare top-level read-only permissions and grant write scopes only to the individual job that requires them.",
    });
  }

  if (writeAll) {
    addFinding(findings, {
      severity: "high",
      path,
      title: "Workflow grants write-all token permissions",
      evidence: "The workflow contains a write-all permission declaration.",
      recommendation:
        "Replace write-all with the smallest explicit permission set required by each job.",
    });
  }
}

function inspectPackageManifest(text, path, isRoot, filePaths, findings) {
  let manifest;
  try {
    manifest = JSON.parse(text);
  } catch {
    addFinding(findings, {
      severity: "high",
      path,
      title: "Invalid package.json",
      evidence: "The package manifest could not be parsed as JSON.",
      recommendation: "Repair the JSON and validate it with node --check or a JSON parser.",
    });
    return;
  }

  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.optionalDependencies,
  };

  for (const [name, version] of Object.entries(dependencies)) {
    if (typeof version !== "string") continue;
    if (version === "*" || version.toLowerCase() === "latest") {
      addFinding(findings, {
        severity: "medium",
        path,
        title: "Dependency uses an unbounded version",
        evidence: `${name} is declared with the version range ${version}.`,
        recommendation:
          "Use a reviewed version range and commit the package manager's lockfile.",
      });
    }
    if (/^(?:git\+|github:|https?:|file:)/i.test(version)) {
      addFinding(findings, {
        severity: "medium",
        path,
        title: "Dependency is not resolved from a registry version",
        evidence: `${name} uses a direct URL, Git, or local path reference.`,
        recommendation:
          "Review the source and integrity of this dependency, or prefer a registry release with a lockfile integrity hash.",
      });
    }
  }

  if (!isRoot) return;

  const lockfiles = [
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lock",
    "bun.lockb",
  ];
  if (
    Object.keys(dependencies).length > 0 &&
    !lockfiles.some((file) => filePaths.has(file))
  ) {
    addFinding(findings, {
      severity: "medium",
      path,
      title: "Package manifest has no recognized lockfile",
      evidence: "Dependencies are declared but no root npm, pnpm, Yarn, or Bun lockfile was found.",
      recommendation:
        "Generate and commit the lockfile used by CI and production builds.",
    });
  }

  if (manifest.scripts && !manifest.scripts.test) {
    addFinding(findings, {
      severity: "low",
      path,
      title: "No test script is declared",
      evidence: "The root package manifest does not define a test script.",
      recommendation:
        "Add a deterministic test command and run it in continuous integration.",
    });
  }
}

export async function auditRepository(rootPath, options = {}) {
  const root = resolve(rootPath);
  const rootStat = await lstat(root);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new Error("The audit root must be an existing, non-symlink directory.");
  }

  const limits = normalizeLimits(options.limits);
  const findings = [];
  const filePaths = new Set();
  const packageManifests = [];
  const stats = {
    scannedFiles: 0,
    skippedFiles: 0,
    totalBytes: 0,
    limitReached: false,
  };

  async function walk(directory, depth) {
    if (depth > limits.maxDepth) {
      stats.skippedFiles += 1;
      stats.limitReached = true;
      return;
    }

    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      if (stats.scannedFiles >= limits.maxFiles) {
        stats.limitReached = true;
        return;
      }

      const absolutePath = join(directory, entry.name);
      const relativePath = relative(root, absolutePath).split(sep).join("/");

      if (entry.isSymbolicLink()) {
        stats.skippedFiles += 1;
        continue;
      }

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name.toLowerCase())) continue;
        await walk(absolutePath, depth + 1);
        if (stats.limitReached && stats.scannedFiles >= limits.maxFiles) return;
        continue;
      }

      if (!entry.isFile()) continue;
      stats.scannedFiles += 1;
      filePaths.add(relativePath);

      const secretType = secretFilenameType(relativePath);
      if (secretType) {
        addFinding(findings, {
          severity: "high",
          path: relativePath,
          title: "Credential-bearing file is present in the scanned repository",
          evidence: `The filename or directory indicates a ${secretType}. File contents were not read.`,
          recommendation:
            "Remove the file from version control, rotate any exposed credentials, and keep only sanitized example files.",
        });
        continue;
      }

      let fileStat;
      try {
        fileStat = await lstat(absolutePath);
      } catch {
        stats.skippedFiles += 1;
        continue;
      }

      if (fileStat.size > limits.maxFileBytes) {
        stats.skippedFiles += 1;
        stats.limitReached = true;
        continue;
      }
      if (stats.totalBytes + fileStat.size > limits.maxTotalBytes) {
        stats.skippedFiles += 1;
        stats.limitReached = true;
        continue;
      }

      let buffer;
      let handle;
      try {
        const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
        handle = await open(absolutePath, flags);
        const openedStat = await handle.stat();
        if (!openedStat.isFile() || openedStat.size > limits.maxFileBytes) {
          stats.skippedFiles += 1;
          stats.limitReached = openedStat.size > limits.maxFileBytes;
          continue;
        }
        buffer = await handle.readFile();
      } catch {
        stats.skippedFiles += 1;
        continue;
      } finally {
        await handle?.close().catch(() => {});
      }

      stats.totalBytes += buffer.length;
      if (buffer.includes(0)) {
        stats.skippedFiles += 1;
        continue;
      }

      const text = buffer.toString("utf8");
      const extension = extname(relativePath).toLowerCase();
      const fileName = basename(relativePath).toLowerCase();

      inspectSecretContent(text, relativePath, findings);

      if (
        relativePath.startsWith(".github/workflows/") &&
        (extension === ".yml" || extension === ".yaml")
      ) {
        inspectWorkflow(text, relativePath, findings);
      }

      if (fileName === "package.json") {
        packageManifests.push({ path: relativePath, text });
      }
    }
  }

  await walk(root, 0);
  for (const manifest of packageManifests) {
    inspectPackageManifest(
      manifest.text,
      manifest.path,
      manifest.path === "package.json",
      filePaths,
      findings,
    );
  }

  if (stats.limitReached) {
    addFinding(findings, {
      severity: "low",
      confidence: "high",
      path: ".",
      title: "Repository scan reached a configured safety limit",
      evidence:
        "Some files or directories were skipped because a file-count, file-size, total-size, or depth limit was reached.",
      recommendation:
        "Review the scan statistics and rerun with explicitly increased limits if the repository is trusted and a broader scan is required.",
    });
  }

  findings.sort((left, right) => {
    const severity = SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity];
    return severity || left.path.localeCompare(right.path) || (left.line ?? 0) - (right.line ?? 0);
  });

  return {
    schemaVersion: 1,
    mode: "read-only-static",
    rootName: basename(root),
    generatedAt: new Date().toISOString(),
    stats,
    summary: {
      critical: findings.filter((item) => item.severity === "critical").length,
      high: findings.filter((item) => item.severity === "high").length,
      medium: findings.filter((item) => item.severity === "medium").length,
      low: findings.filter((item) => item.severity === "low").length,
      informational: findings.filter((item) => item.severity === "informational").length,
      total: findings.length,
    },
    findings,
    limitations: [
      "Static checks only; this tool does not execute repository code or install dependencies.",
      "No network access or GitHub API integration is performed.",
      "A clean report does not prove that a repository is secure or bug-free.",
      "Symlinks and excluded build/dependency directories are not followed.",
      "Dependency advisories require a separately verified lockfile vulnerability scan.",
    ],
  };
}

export function renderMarkdown(report) {
  const lines = [
    "# Detectiverx Audit Report",
    "",
    `- Mode: ${report.mode}`,
    `- Repository folder: ${report.rootName}`,
    `- Generated: ${report.generatedAt}`,
    `- Files scanned: ${report.stats.scannedFiles}`,
    `- Files skipped: ${report.stats.skippedFiles}`,
    "",
    "## Summary",
    "",
    `- Critical: ${report.summary.critical}`,
    `- High: ${report.summary.high}`,
    `- Medium: ${report.summary.medium}`,
    `- Low: ${report.summary.low}`,
    `- Informational: ${report.summary.informational}`,
    `- Total findings: ${report.summary.total}`,
    "",
    "## Findings",
    "",
  ];

  if (report.findings.length === 0) lines.push("No findings were detected by the configured static checks.");
  for (const finding of report.findings) {
    const location = finding.line ? `${finding.path}:${finding.line}` : finding.path;
    lines.push(
      `### [${finding.severity.toUpperCase()}] ${finding.title}`,
      "",
      `- Location: ${location}`,
      `- Confidence: ${finding.confidence}`,
      `- Evidence: ${finding.evidence}`,
      `- Recommendation: ${finding.recommendation}`,
      "",
    );
  }

  lines.push("## Limitations", "");
  for (const limitation of report.limitations) lines.push(`- ${limitation}`);
  lines.push("");
  return lines.join("\n");
}
