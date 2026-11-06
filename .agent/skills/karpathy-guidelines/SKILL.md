---
name: karpathy-guidelines
description: Use when writing, reviewing or refactoring code — keeps changes surgical, assumptions explicit and success verifiable. Derived from Andrej Karpathy's notes on the common ways LLMs get coding wrong.
---

# Karpathy Guidelines

Behavioural rules that cut the most common LLM coding failures. Bias: caution over speed — use
judgement for trivial tasks.

## 1. Think before coding

- State your assumptions explicitly; ask when uncertain.
- If several interpretations exist, present them — do not pick silently.
- If a simpler approach exists, say so.
- If something is unclear, stop and name what is confusing.

## 2. Simplicity first

- Minimum code that solves the problem; nothing speculative.
- No configurability or "flexibility" that was not requested.
- No abstraction for a single use site.
- No error handling for impossible states.
- 200 lines that could be 50 → rewrite them.

## 3. Surgical changes

- Touch only what you must; do not "improve" neighbouring code or formatting.
- Match the existing style even if you would do it differently.
- Notice unrelated dead code? Mention it, do not delete it.
- Remove only the orphans **your** change created (imports, variables, helpers).

The test: **every changed line traces directly to the request.**

## 4. Verify against the request

Before saying "done": re-read the original ask, walk each requirement, and run the checks from
`systematic-debugging` Phase 4. Report what you verified and what you could not.

## Source

Summarised from [`forrestchang/andrej-karpathy-skills`](https://github.com/forrestchang/andrej-karpathy-skills)
→ `skills/karpathy-guidelines` (MIT), derived from Andrej Karpathy's observations on LLM coding pitfalls.
