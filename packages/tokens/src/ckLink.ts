import { Token } from "@icpswap/swap-sdk";
import { TokenInfo, TOKEN_STANDARD } from "@icpswap/types";

export const ckLinkTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "ckLINK",
  decimals: 18,
  symbol: "ckLINK",
  canisterId: "g4tto-rqaaa-aaaar-qageq-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(100000000000000),
  logo: `/images/tokens/g4tto-rqaaa-aaaar-qageq-cai.png`,
};

export const ckLink = new Token({
  address: ckLinkTokenInfo.canisterId,
  decimals: ckLinkTokenInfo.decimals,
  symbol: ckLinkTokenInfo.symbol,
  name: ckLinkTokenInfo.name,
  logo: ckLinkTokenInfo.logo,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(ckLinkTokenInfo.transFee),
});
