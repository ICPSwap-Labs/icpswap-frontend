---
name: skill-creator
description: Use when adding or editing a skill under .agent/skills — enforces the frontmatter contract, a router-style description, a small SKILL.md, and optional references/ or scripts/.
---

# Skill Creator

**A skill is a procedure, not documentation.** If a model would not follow it step by step, it is a
README, not a skill.

## File layout

```
.agent/skills/<kebab-case-name>/
  SKILL.md          # required, keep under ~200 lines
  references/*.md   # optional, loaded only when a step needs them
  scripts/*         # optional, run black-box; run --help instead of reading the source
```

## Frontmatter contract

```yaml
---
name: kebab-case-name # must equal the directory name
description: Use when <trigger> — <effect>. # a router rule, not marketing copy
---
```

The `description` decides whether the skill loads at all: name the _situations_ ("Use when a bug
appears…", "Use when styling UI…"), not the benefits.

## Writing rules

1. **Open with the law** — the one rule that must not be broken (e.g. "no code before approval").
2. **Numbered, imperative steps**, one action each.
3. **Point at real commands and paths** in this repo (`pnpm lint`, `apps/swap/src/...`).
4. **List anti-patterns** — what the model tends to get wrong here.
5. **End with verification** — a command plus the expected output.
6. Push long tables and checklists into `references/` so the core stays short.

## Checklist before registering

- [ ] directory name equals frontmatter `name`
- [ ] `description` contains "Use when" and a concrete trigger
- [ ] no secrets, no machine-specific absolute paths
- [ ] every command works when copy-pasted
- [ ] added to the Skills table in `AGENTS.md`

## Source

Summarised from `anthropics/skills` → `skills/skill-creator` (Anthropic official skills repo;
upstream terms apply — this file is an original summary).
