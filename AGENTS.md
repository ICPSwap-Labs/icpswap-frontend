# AGENTS.md

Guidance for coding agents (Claude Code, Codex, Cursor, …) working in this repository.
Read this first, then load the matching skill from `.agent/skills/<name>/SKILL.md`.

## What this is

`@icpswap/frontend` — a **pnpm + NX monorepo**.

| Path                                                   | Contents                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `apps/swap`                                            | The main dApp: React + Vite + Recoil, the swap/liquidity/NFT UI        |
| `packages/actor`                                       | Typed canister actors (`@icpswap/actor`)                               |
| `packages/candid`                                      | Generated Candid IDL + TS interfaces (`@icpswap/candid`)               |
| `packages/hooks`                                       | React Query hooks for the ICPSwap API and canisters (`@icpswap/hooks`) |
| `packages/swap-sdk`                                    | UniV3-style math / pool primitives (`@icpswap/swap-sdk`)               |
| `packages/types`, `constants`, `tokens`, `utils`, `ui` | Shared types, constants, token metadata, formatting helpers, UI kit    |

- Toolchain: **Node 22.x**, **pnpm >= 8**, NX, oxlint, oxfmt, vitest.
- Canister ids for mainnet live in `apps/swap/src/canister_ids.json`; runtime config in `apps/swap/.env`.
- The public API base URL is `https://api.icpswap.com` (`packages/constants`).

## Commands

| Command                                 | Purpose                                                          |
| --------------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                              | Run every app in dev mode (`prepare.cjs` + `nx run-many -t dev`) |
| `pnpm build:swap`                       | Build the swap app (skips cache)                                 |
| `pnpm build:packages`                   | Build the shared packages                                        |
| `pnpm lint` / `pnpm lint:fix`           | oxlint over the repo (`.oxlintrc.json`)                          |
| `pnpm format` / `pnpm format:check`     | oxfmt write / verify                                             |
| `pnpm test`                             | vitest across packages (the swap app is excluded)                |
| `pnpm --filter @icpswap/swap typecheck` | `tsc --noEmit` for the swap app                                  |
| `pnpm start:local`                      | Swap app against a local replica                                 |

Git hooks (lefthook): `pre-commit` runs `oxlint` + `oxfmt --check` on staged files, `commit-msg` runs
commitlint (Conventional Commits). Do not bypass hooks with `--no-verify` unless the user asks.

## Conventions

- **Commits**: Conventional Commits (commitlint). Allowed types: `feat`, `fix`, `docs`, `style`,
  `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  One logical change per commit; no drive-by reformatting.
- **Formatting/linting**: run `pnpm lint` and `pnpm format:check` before handing work back.
- **i18n**: source strings live in `apps/swap/src/i18n/locales/source/en-US.json`. New code should use
  **semantic keys** (`t("swap.high.impact")`); avoid introducing new hash-style keys (`t\`Some text\``),
  which are being migrated away from.
- **Amounts**: token quantities are raw `bigint`. Convert with `parseTokenAmount` / `formatTokenAmount`
  (`@icpswap/utils`) — never `Number(raw) / 10 ** decimals` for money.
- **NX cache**: if a build/type result looks stale, `npx nx reset` and re-run with `--skip-nx-cache`.
- Keep new dependencies out of the critical path unless asked; this repo already ships an actor/candid/
  hooks stack for most IC work.

## Skills

Skills are reusable procedures in `.agent/skills/<name>/SKILL.md`. Load the matching one **before**
acting — they encode process, not tips. The set is curated from the 2026 "10 popular skills" write-up
([juejin.cn/post/7660712622825144374](https://juejin.cn/post/7660712622825144374)) and the upstream
repos it points at; each file here is an original summary wired to this repo's commands.

| Skill                                                                       | Use when                                                                                  | Origin                                                                                              |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [`commit-helper`](.agent/skills/commit-helper/SKILL.md)                     | writing, reviewing or splitting a commit message                                          | local                                                                                               |
| [`systematic-debugging`](.agent/skills/systematic-debugging/SKILL.md)       | any bug, failing test, flaky behaviour or "wrong number" — **before** proposing a fix     | [obra/superpowers](https://github.com/obra/superpowers) · MIT · ⭐ ≈ 313k                           |
| [`brainstorming`](.agent/skills/brainstorming/SKILL.md)                     | vague request, or any change to shared packages / canister calls — design first then code | obra/superpowers · MIT                                                                              |
| [`test-driven-development`](.agent/skills/test-driven-development/SKILL.md) | behaviour that a test can assert (amounts, maths, hooks, utils)                           | obra/superpowers · MIT                                                                              |
| [`requesting-code-review`](.agent/skills/requesting-code-review/SKILL.md)   | before handing work back or merging — review the whole diff, not just the compile         | obra/superpowers · MIT                                                                              |
| [`karpathy-guidelines`](.agent/skills/karpathy-guidelines/SKILL.md)         | writing/reviewing/refactoring — surgical diffs, explicit assumptions                      | [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) · MIT |
| [`frontend-design`](.agent/skills/frontend-design/SKILL.md)                 | building or restyling UI — avoid generic "AI look", stay inside the theme                 | [anthropics/skills](https://github.com/anthropics/skills) · `frontend-design`                       |
| [`webapp-testing`](.agent/skills/webapp-testing/SKILL.md)                   | verifying a UI change in a real browser (Playwright / headless Chrome)                    | anthropics/skills · `webapp-testing`                                                                |
| [`skill-creator`](.agent/skills/skill-creator/SKILL.md)                     | adding or editing a skill in `.agent/skills`                                              | anthropics/skills · `skill-creator`                                                                 |

### How this set was chosen

- **Adopted** (7 of the article's 10): the ones that pay off in a React/TS dApp — design intent,
  TDD for `packages/*`, diff review, requirement clarification, browser verification, and the
  meta-skill for growing the set.
- **Skipped on purpose**: `mcp-builder` (this repo ships no MCP servers), `gsd`/"just do it"
  (conflicts with the review discipline we want for a financial dApp), `gstack` and `composio`
  (external-tool integrations this frontend does not use).
- **No file**: Claude Code's built-in `/security-review` is a command, not a skill — run it on the
  diff before a PR that touches auth, wallet or token flows.
- **Licensing**: `obra/superpowers` and `andrej-karpathy-skills` are MIT. `anthropics/skills` has no
  root LICENSE, so the three files derived from it are original summaries with upstream links rather
  than copied text. Keep the `## Source` block when editing these files.

### Adding another skill

Do **not** use `npx skills add <repo>` here: project skills must live in `.agent/skills/` and be
committed. Copy the upstream `SKILL.md`, trim it to this repo's commands/paths, keep the attribution
and upstream link, then add a row above. Use `skill-creator` for the format.

## Working agreements

1. **Read before writing**: open the surrounding package/hook first; grep for existing usages before
   adding a new abstraction.
2. **Small diffs**: fix the requested thing; propose larger refactors instead of smuggling them in.
3. **Verify, then claim**: `lint` + `format:check` + relevant `test`/`typecheck` before saying "done".
   See `systematic-debugging` Phase 4 for the exact commands.
4. **Report honestly**: if something could not be verified (needs a wallet, a local replica, or mainnet
   state), say so explicitly instead of implying success.
5. **No secrets**: never print or commit values from `apps/swap/.env` or npm tokens.
