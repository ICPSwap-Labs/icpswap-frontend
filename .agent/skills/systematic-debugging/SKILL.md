---
name: systematic-debugging
description: Use when any bug, test failure, flaky behaviour, or unexpected output appears — before proposing or applying a fix. Enforces root-cause investigation instead of symptom patching.
---

# Systematic Debugging

**Core principle: always find the root cause before attempting a fix. A symptom fix is a failure.**

> Adapted for this repository from [`obra/superpowers`](https://github.com/obra/superpowers)
> (`skills/systematic-debugging`, MIT, copyright © 2025 Jesse Vincent — the most-starred
> agent-skills collection on GitHub, ~313k ⭐). Trimmed, and wired to this repo's `pnpm` / `nx`
> commands and the usual failure modes of an IC dApp.

## The Iron Law

```
NO FIXES WITHOUT ROOT-CAUSE INVESTIGATION FIRST
```

If you have not finished Phase 1, you are not allowed to propose a fix.

## When to use

Use for **any** technical issue: failing test, production bug, wrong number in the UI, build
failure, flaky behaviour, "it works locally but not on the preview".

Use it _especially_ when: the fix looks obvious, you are in a hurry, you already tried one or two
fixes, or you do not fully understand the code path yet.

## Phase 1 — Root-cause investigation

1. **Read the error completely.** Stack trace, line numbers, file paths, canister id + method,
   HTTP status, revert codes. Do not skim; the answer is usually printed there.
2. **Reproduce deterministically.** Smallest possible steps. Note the environment: `apps/swap/.env`
   (`VITE_*`), network `ic` vs `local`, branch, and whether it only happens after a build.
3. **Trace the data flow** instead of guessing: input → transform → render / canister call. Print or
   assert the intermediate values at each hop.
4. **Check the boring causes first** — they are the cheapest to rule out:
   - stale NX cache → `npx nx reset`, then rebuild with `--skip-nx-cache`
   - stale `node_modules` / generated `packages/candid` output
   - a missing i18n key (the UI renders the raw key; console logs `Missing i18n string key`)
   - token amount decimals: values are raw `bigint` — convert with `parseTokenAmount` /
     `formatTokenAmount` from `@icpswap/utils`, never by hand-rolling `10 ** decimals`
   - query vs update call: a "stale" number is often a `query` that is not certified/refreshed

## Phase 2 — Pattern analysis

- Find a **working analogue** in the repo (same `packages/*` pattern, same hook, same component tree).
- **Diff** working vs broken and list every difference, including the ones that "cannot matter".
- Understand the dependencies: workspace deps, `tsconfig` paths, provider order, canister map in
  `apps/swap/src/canister_ids.json`.

## Phase 3 — Hypothesis and testing

- State exactly one hypothesis: _"X is the root cause because Y."_ Write it down.
- Test it with the **smallest possible change**, one variable at a time.
- Hypothesis wrong? Form a new one. Do **not** stack a second fix on top of the first.
- Do not know? Say so and inspect more (or ask). Confident-sounding guessing costs more time.

## Phase 4 — Implementation

- **Add the failing check first**: a unit test (`pnpm test`, vitest lives in `packages/*`) or, if
  there is no harness, a minimal reproduction script you delete afterwards.
- **One fix**, addressing the root cause. No "while I'm here" refactors, no bundled formatting.
- **Verify before claiming done**:
  ```bash
  pnpm lint                              # oxlint
  pnpm format:check                      # oxfmt
  pnpm test                              # vitest across packages
  pnpm --filter @icpswap/swap typecheck  # tsc --noEmit for the swap app
  pnpm build:swap                        # only when build/env/bundling is involved
  ```
- Fix did not work? Count your attempts. 1–2 → return to Phase 1 with the new information.
  **3 or more → stop and question the architecture** (each fix revealing a new coupled problem is
  an architecture signal, not a hypothesis failure). Discuss with the user before attempt #4.

## Red flags — stop and go back to Phase 1

- "Quick fix now, investigate later"
- "Let me just try changing X"
- "I'll make these three changes and see"
- "Skip the test, I verified manually"
- "It's probably X" — without tracing the data flow
- "One more fix attempt" when you already tried two
- Each fix reveals a new problem somewhere else

## Source

- Upstream: <https://github.com/obra/superpowers> · `skills/systematic-debugging/SKILL.md`
- License: MIT (see the upstream `LICENSE`; keep this notice when redistributing)
- Stars as of 2026-11: ~313k ⭐ (repo-level metric)
