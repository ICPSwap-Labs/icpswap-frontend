---
name: brainstorming
description: Use only when a request is genuinely ambiguous or the change touches shared packages / canister calls. Turns a vague ask into an approved design — no code until the user approves. Skip for single-file, clearly scoped changes.
---

# Brainstorming

**Core rule: no implementation until the user approves a design — but only for the changes listed below.**

## When to use

- The request admits more than one materially different interpretation
- The change crosses packages or touches `@icpswap/hooks`, `@icpswap/utils`, `@icpswap/ui`, or canister calls
- The change alters user-visible money flows (swap, liquidity, fees) or auth/wallet behaviour

Skip it for: typo fixes, copy/i18n key edits, styling tweaks, a single well-scoped bug with an
obvious cause, work that fits in one file, or a pure question. When in doubt, prefer just doing it.

## Steps

1. **Restate the goal in one sentence** and ask whether that is right.
2. **Ask at most one round of questions** — multiple-choice, up to 3 independent questions in that
   round — and stop as soon as goal, scope and acceptance criteria are unambiguous. Do not spend more
   than one round chasing detail that can be decided during implementation.
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
