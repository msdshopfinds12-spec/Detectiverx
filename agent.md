# AGENTS.md

## Project purpose
This repository is a Python project. Favor correctness, clarity, and maintainability over clever shortcuts.

## Working conventions
- Keep changes small, focused, and easy to review.
- Prefer explicit, readable Python over overly clever abstractions.
- Follow the existing code style, naming, and module structure already used in the repo.
- Avoid introducing new dependencies unless there is a clear, justified need.
- Preserve backward compatibility unless the task explicitly requires breaking changes.

## Development workflow
- Use the project’s existing tooling and virtual environment setup.
- Run the smallest relevant validation command before finishing.
- Prefer targeted tests for the touched behavior over broad suites.
- If a bug fix is needed, confirm the root cause before changing logic.
- Document configuration changes, required environment variables, and setup assumptions.

## Python-specific guidance
- Keep functions and methods predictable and side-effect aware.
- Use type hints and clear naming where the project already does so.
- Favor existing project patterns for config, logging, and error handling.
- Handle exceptions explicitly; avoid swallowing errors silently.
- Keep imports organized and remove unused dependencies or code.

## Testing
- Add or update tests for bug fixes and new functionality.
- Prefer focused test coverage for changed behavior.
- If a test fails, fix the underlying cause rather than patching around symptoms.

## AI usage guidance
- Do not invent APIs, config values, or environment variables.
- Verify assumptions against the repo’s actual code and docs.
- When a task is ambiguous, ask for clarification before making breaking changes.
- Keep patches minimal and aligned with the repo’s existing style.

## Repo-specific rules
- Use `pytest` for tests.
- Run `ruff check .` before finalizing Python changes.
- Use `python -m app` for local startup when applicable.

## Quality bar
- Code should be readable and maintainable.
- Behavior must be validated with the relevant test or command.
- Keep logging, errors, and configuration traceable and understandable.
