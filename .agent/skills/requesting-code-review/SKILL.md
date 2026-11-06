---
name: requesting-code-review
description: Use when finishing a task, handing work back, or preparing to merge — review the whole diff against the original request, blocking on behaviour, amounts, i18n and hook correctness rather than style.
---

# Requesting Code Review

**Review early, review often. "It compiles" is not a review.**

## Get the diff

```bash
git status --short
git diff              # unstaged work
git diff --staged     # what is about to be committed
git diff origin/main  # branch versus upstream
```

## Two modes

1. **Self-review (default)** — read your own diff top to bottom, line by line, before committing.
2. **Fresh eyes** — dispatch a subagent with only `git diff` plus the original request, and ask for
   _blocking_ issues. Do not hand it your reasoning; let it form an independent view.

## Checklist for this repo

- [ ] every changed line traces to the request — no drive-by reformatting
- [ ] behaviour matches the request, including empty list / zero amount / unknown token
- [ ] amounts stay raw `bigint`; `parseTokenAmount` / `formatTokenAmount`; no float maths on money
- [ ] new UI strings added to `apps/swap/src/i18n/locales/source/en-US.json` with semantic keys
- [ ] React: correct hook dependency arrays, no state updates after unmount, no query storms
- [ ] canister/API errors surface to the user instead of being swallowed; loading states handled
- [ ] types: no `any` crept in; exported surfaces typed
- [ ] new behaviour is covered by a test (`pnpm test`) or explicitly reported as untested
- [ ] `pnpm lint`, `pnpm format:check`, `pnpm --filter @icpswap/swap typecheck`
- [ ] commit message follows Conventional Commits (see `commit-helper`)

## Blocking vs nit

**Block** on: wrong behaviour, data loss, wrong amounts, unhandled errors, broken types.
**Mention, do not block** on: naming taste, micro-optimisations, unrelated refactors.

## Source

Summarised from `obra/superpowers` → `skills/requesting-code-review` (MIT).
