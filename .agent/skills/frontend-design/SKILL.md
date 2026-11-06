---
name: frontend-design
description: Use when building or restyling UI in apps/swap — produce intentional, distinctive interfaces instead of generic "AI-looking" layouts, while staying inside the existing MUI theme and @icpswap/ui primitives.
---

# Frontend Design

**Aim: an interface a designer would recognise as deliberate — not a default template.**

## Before styling anything

1. **Read the surroundings** — the page under `apps/swap/src/views/*`, the shared primitives in
   `packages/ui`, and the wrappers in `components/Mui`. Reuse theme tokens (spacing, radii, type
   scale) instead of inventing numbers.
2. **Name the intent**: dense trading terminal or calm settings page? Expressiveness must match the
   page's job.
3. **Pick one focal idea** (number-forward hierarchy, a restrained accent, a strong type scale) and
   let everything else stay quiet.

## Rules of thumb

- **Type**: 3–4 sizes per view at most; amounts get tabular/lining figures so columns line up.
- **Spacing**: multiples of 4 from the theme; data tables need generous row padding and alignment.
- **Colour**: theme palette only; accent for the primary action; never rely on colour alone for state.
- **States**: empty / loading / error / partial-data must look designed, not like afterthoughts.
- **Motion**: 120–200 ms, purposeful; respect `prefers-reduced-motion`.
- **Density**: trading data deserves compact, aligned rows; forms deserve breathing room.
- **Themes**: verify light _and_ dark — the app ships both.

## Avoid

- Three generic cards with icon + title + paragraph
- Purple/blue gradients standing in for hierarchy
- Emoji as production iconography
- Centre-everything layouts for data-heavy screens
- A new primitive when `packages/ui` already exposes one

## Verify

- Screenshot the page in both themes; check hover/focus/disabled states
- Long token symbols, `0`, `--` and unknown amounts all look intentional
- No hard-coded English — strings come from `en-US.json` (see `AGENTS.md`)

## Source

Summarised from `anthropics/skills` → `skills/frontend-design` (Anthropic official skills repo —
upstream terms apply; this file is an original summary, not a copy).
