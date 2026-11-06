---
name: brainstorming
description: Use when a request is underspecified or before building any non-trivial feature. Turns a vague ask into an approved design by asking one question at a time — no code until the user approves.
---

# Brainstorming

**Core rule: no implementation until the user approves a design.**

## When to use

- A new feature, page or component whose requirements are unclear
- The request admits more than one reasonable interpretation
- The change touches shared packages (`@icpswap/hooks`, `@icpswap/utils`, `@icpswap/ui`) or canister calls
- You notice the urge to "just start coding"

Skip it for: typo fixes, a single well-scoped bug with an obvious cause, or a pure question.

## Steps

1. **Restate the goal in one sentence** and ask whether that is right.
2. **Ask one question at a time** — multiple-choice style — and stop as soon as goal, scope and
   acceptance criteria are unambiguous.
3. **Name the constraints you already know**: i18n keys go in `en-US.json`, amounts are raw `bigint`,
   canister `query` vs `update`, NX cache, bundle size, wallet-less rendering.
4. **Propose 2–3 options** with tradeoffs (effort, risk, blast radius). Recommend one and say why.
5. **Write the design**: files to touch, data flow, edge cases, how it will be verified.
6. **Wait for approval**, then implement — see `test-driven-development` and `systematic-debugging`.

## Output template

```md
Goal: ...
In scope / out of scope: ...
Approach: A (recommended) vs B vs C — tradeoffs
Files: ...
Verification: ...
Open questions: ...
```

## Anti-patterns

- Asking ten questions at once
- Silently choosing one interpretation and building it
- Writing code first, then asking "does this look right?"
- Inventing a new abstraction for a single call site

## Source

Summarised from `obra/superpowers` → `skills/brainstorming` (MIT, upstream ≈313k ⭐).
<https://github.com/obra/superpowers>
