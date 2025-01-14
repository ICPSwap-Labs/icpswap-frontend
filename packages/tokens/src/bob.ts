import { Token } from "@icpswap/swap-sdk";
import { TOKEN_STANDARD } from "@icpswap/types";

export const BOB = new Token({
  address: "7pail-xaaaa-aaaas-aabmq-cai",
  decimals: 8,
  symbol: "BOB",
  name: "BOB",
  logo: "/images/tokens/7pail-xaaaa-aaaas-aabmq-cai.png",
  standard: TOKEN_STANDARD.ICRC2,
  transFee: 1000000,
});
