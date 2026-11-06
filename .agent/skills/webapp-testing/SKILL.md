---
name: webapp-testing
description: Use when a UI change must be verified in a real browser — start the dev server, drive the page with Playwright (or a headless-Chrome one-shot), assert what is visible, and capture console errors and screenshots.
---

# Webapp Testing

**Verify what the user sees, not only what the unit test asserts.**

## Start the app

```bash
pnpm dev                                  # nx runs every app; the swap app serves on Vite's default 5173
pnpm --filter @icpswap/swap dev           # swap app only
```

Wait until the dev server prints its URL before driving it.

## Drive it

Prefer Playwright when available:

```bash
pnpm dlx playwright@latest --version      # check availability, do not add it to the repo casually
```

No Playwright? A headless-Chrome one-shot screenshot is enough for layout and console checks:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1440,1200 --virtual-time-budget=8000 \
  --screenshot=/tmp/page.png --user-data-dir=/tmp/chrome-shot "http://127.0.0.1:5173/#/swap"
```

## What to check on an ICPSwap page

- **Console**: no uncaught errors. `Missing i18n string key` means a translation is absent.
- **Data**: amounts are formatted (not raw `bigint`), unknown values show `--`, never `NaN`/`undefined`.
- **Wallet-less**: every page must render read-only without a connected wallet.
- **Themes & viewport**: check light/dark and a narrow (~375 px) layout — mobile styles kick in at 640 px.
- **Routing**: hash routes (`/#/swap`, `/#/liquidity`) load directly, not only via in-app navigation.

## Report

State the URL, what you clicked, what appeared, and attach the screenshot. If the browser could not
run, say so — never infer a visual result from source code.

## Source

Summarised from `anthropics/skills` → `skills/webapp-testing` (Playwright toolkit; upstream terms apply).
