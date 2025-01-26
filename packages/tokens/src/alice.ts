import { Token } from "@icpswap/swap-sdk";
import { TOKEN_STANDARD } from "@icpswap/types";

export const ALICE = new Token({
  address: "oj6if-riaaa-aaaaq-aaeha-cai",
  decimals: 8,
  symbol: "ALICE",
  name: "ALICE",
  logo: "/images/tokens/oj6if-riaaa-aaaaq-aaeha-cai.png",
  standard: TOKEN_STANDARD.ICRC2,
  transFee: 100000000,
});
