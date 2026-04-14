---
name: commit-msg-helper
description: Generate Conventional Commit messages from git changes with clear subject/body structure. Use when the user asks to write, suggest, refine, or generate a commit message.
---

# Commit Message Helper

## Quick Start

When asked to generate a commit message:

1. Inspect changes with:
   - `git status`
   - `git diff`
   - `git diff --staged`
2. Determine the primary intent of the change.
3. Output one recommended commit message in the required format.
4. If changes are unrelated, recommend split commits before writing the final message.

## Type Mapping

Use these defaults:

- `feat`: adds user-facing behavior
- `fix`: resolves a bug or regression
- `refactor`: internal change without behavior change
- `perf`: improves performance
- `docs`: documentation-only change
- `test`: adds/updates tests
- `build`: build/dependency/tooling change
- `chore`: maintenance work

## Message Rules

- Subject must be imperative and specific.
- Subject should be <= 72 characters.
- Subject must not end with a period.
- Message must match the actual diff.
- Do not add footer unless the user explicitly requests one.

## Output Format

Use exactly this structure:

```text
<type>(<scope>): <subject>

<optional body focused on why and impact>
```

## Scope Guidance

- Use a concise scope from changed area (for example: `swap`, `ui`, `agent`, `build`).
- If scope is unclear, omit scope instead of guessing.

## Split Commit Guidance

If multiple unrelated changes are present:

1. State that changes should be split.
2. Propose commit grouping by intent.
3. Then provide one message per group.

## Example Outputs

```text
docs(agent): add commit helper skill for consistent AI commits

Document a reusable commit workflow so generated messages stay aligned
with project conventions.
```

```text
fix(swap): prevent empty token symbol from breaking quote requests

Guard quote payload construction to skip invalid token metadata and avoid
backend request failures during edge-case token loads.
```
