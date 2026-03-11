import { Token } from "@icpswap/swap-sdk";
import { TOKEN_STANDARD } from "@icpswap/types";

export const ckDoge = new Token({
  address: "efmc5-wyaaa-aaaar-qb3wa-cai",
  decimals: 8,
  symbol: "ckDOGE",
  name: "ckDOGE",
  logo: "/images/tokens/efmc5-wyaaa-aaaar-qb3wa-cai.svg",
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(1_000_000),
});
