import type { Percent } from "@icpswap/swap-sdk";

export default function FormattedPriceImpact({ priceImpact }: { priceImpact: Percent | undefined }) {
  if (!priceImpact) return "0.00%";

  // `Trade.priceImpact` is positive for an unfavourable trade (it is `(spot - actual) / spot`),
  // so show the magnitude instead of flipping the sign, which used to render "0.30%" as "-0.30%".
  const magnitude = priceImpact.lessThan(0) ? priceImpact.multiply(-1) : priceImpact;

  return `${magnitude.toFixed(2)}%`;
}
