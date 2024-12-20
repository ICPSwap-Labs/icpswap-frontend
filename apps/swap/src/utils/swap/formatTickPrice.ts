import { Price, Token } from "@icpswap/swap-sdk";

import { formatPrice } from "./formatCurrencyAmount";

export enum Bound {
  LOWER = "LOWER",
  UPPER = "UPPER",
}

export function formatTickPrice(
  price: Price<Token, Token> | undefined,
  atLimit: { [bound in Bound]?: boolean | undefined },
  direction: Bound,
  placeholder?: string,
) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? "0" : "∞";
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatPrice(price);
}
