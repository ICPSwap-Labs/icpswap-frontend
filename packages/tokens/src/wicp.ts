import { Token } from "@icpswap/swap-sdk";
import { TokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { WICP_CANISTER_ID } from "@icpswap/constants";

export const WRAPPED_ICP_TOKEN_INFO: TokenInfo = {
  standardType: TOKEN_STANDARD.EXT,
  name: "Wrapped ICP",
  decimals: 8,
  symbol: "WICP",
  canisterId: WICP_CANISTER_ID,
  totalSupply: BigInt(100000000000000000),
  transFee: BigInt(0),
  logo: `/images/tokens/${WICP_CANISTER_ID}.jpeg`,
};

export const WRAPPED_ICP = new Token({
  address: WRAPPED_ICP_TOKEN_INFO.canisterId,
  decimals: WRAPPED_ICP_TOKEN_INFO.decimals,
  symbol: WRAPPED_ICP_TOKEN_INFO.symbol,
  name: WRAPPED_ICP_TOKEN_INFO.name,
  logo: WRAPPED_ICP_TOKEN_INFO.logo,
  standard: TOKEN_STANDARD.EXT,
  transFee: Number(WRAPPED_ICP_TOKEN_INFO.transFee),
});
