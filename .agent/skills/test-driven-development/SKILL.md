---
name: test-driven-development
description: Use when implementing behaviour that can be asserted by a test — write the failing test first, then the smallest change that passes, then refactor. Best fit for packages/* (vitest) and pure logic.
---

# Test-Driven Development

**Red → green → refactor. No production code before a failing test.**

## Where tests live in this repo

- `packages/*` run **vitest** (`pnpm test` → `nx run-many -t test --exclude=@icpswap/swap`).
  Colocate `*.test.ts` next to the source — e.g. `packages/utils/src/principal.test.ts`.
- `apps/swap` has a `vitest` script (no suite yet): add `*.test.ts` beside the module and run
  `pnpm --filter @icpswap/swap test`.
- Best TDD targets: amounts/`bigint` maths, tick & price maths (`@icpswap/swap-sdk`), sorting,
  filtering, i18n key plumbing. React component tests need jsdom — check for an existing setup first
  instead of adding one.

## The loop

1. **Red** — write the smallest failing test that states the requirement in behaviour terms.
2. **Run it** — confirm it fails _for the right reason_ (assertion, not import/type error).
3. **Green** — the minimal code that makes it pass. Nothing speculative.
4. **Refactor** — with the test green, tidy names/structure without changing behaviour.
5. **Verify** — `pnpm test`, then `pnpm lint`, `pnpm format:check`, and
   `pnpm --filter @icpswap/swap typecheck` if types changed.

## Repo-specific traps

- **`bigint` amounts**: assert exact raw values; never compare floats for money.
- **i18n**: assert the key (`toHaveBeenCalledWith("swap.high.impact")`), not the English text.
- **Canister code**: never call mainnet in a test — inject a fake actor / stub `fetch`.
- **Time**: pass explicit timestamps; do not depend on `Date.now()`.
- **NX cache**: if a re-run looks identical when it should not, `--skip-nx-cache` / `npx nx reset`.

## Source

Summarised from `obra/superpowers` → `skills/test-driven-development` (MIT).
