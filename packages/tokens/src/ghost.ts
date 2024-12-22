import { Token } from "@icpswap/swap-sdk";
import { TokenInfo , TOKEN_STANDARD } from "@icpswap/types";

export const GHOST_TOKEN_ID = "4c4fd-caaaa-aaaaq-aaa3a-cai";

export const GHOST_TOKEN_INFO: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC1,
  name: "GHOST",
  decimals: 8,
  symbol: "GHOST",
  canisterId: GHOST_TOKEN_ID,
  totalSupply: BigInt(100000000000000000),
  transFee: BigInt(100000000),
  logo: `/images/tokens/${GHOST_TOKEN_ID}.png`,
};

export const GHOST = new Token({
  address: GHOST_TOKEN_INFO.canisterId,
  decimals: GHOST_TOKEN_INFO.decimals,
  symbol: GHOST_TOKEN_INFO.symbol,
  name: GHOST_TOKEN_INFO.name,
  logo: GHOST_TOKEN_INFO.logo,
  standard: TOKEN_STANDARD.ICRC1,
  transFee: Number(GHOST_TOKEN_INFO.transFee),
});
