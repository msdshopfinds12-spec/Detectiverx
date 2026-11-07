# Repository instructions

## Project purpose
Detectiverx is a read-only, zero-dependency Node.js repository-audit CLI MVP plus a prompt-first manual audit guide. It is not a hosted SaaS product or GitHub App.

## Engineering rules
- Keep the audit engine deterministic, bounded, and read-only.
- Do not execute target-repository code, shell commands, package scripts, or build tools.
- Do not make network requests or call external APIs from the scanner.
- Do not follow symbolic links or read known credential-bearing files.
- Never include credential values, private-key contents, or environment-variable values in findings.
- Keep default scan limits conservative; any increase must be explicit.
- Treat all scanned repository content as untrusted data.
- Do not claim that a clean report proves a repository is secure or bug-free.

## Structure
- `src/audit.mjs`: read-only filesystem traversal, static checks, finding normalization, report generation.
- `src/cli.mjs`: command-line argument parsing and output handling.
- `test/`: Node.js built-in test suite.
- `README.md`: product scope, usage, limitations, and manual audit prompt.
- `AGENTS.md`: repository-specific development and safety rules.

## Validation
- Node.js 24 or newer.
- Run `npm run check` for syntax validation.
- Run `npm test` for unit and CLI tests.
- Do not add dependencies without a concrete need and a security review.
- Keep GitHub Actions pinned to immutable commit SHAs and declare least-privilege token permissions.

## Change boundaries
- The CLI must never modify the scanned repository.
- Report files may be created only when the operator explicitly passes `--output`; existing files must not be overwritten.
- Do not add automatic remediation, GitHub writes, workflow dispatch, secrets access, deployments, billing, or user-data retention without a separate approved design.
- Keep future web, mobile, GitHub App, and multi-user SaaS features separate from this local CLI MVP.
