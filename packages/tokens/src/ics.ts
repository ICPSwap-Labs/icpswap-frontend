import { Token } from "@icpswap/swap-sdk";
import { TokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { ICS_CANISTER_ID } from "@icpswap/constants";

export const ICS_TOKEN_INFO: TokenInfo = {
  symbol: "ICS",
  name: "ICPSwap Token",
  decimals: 8,
  canisterId: ICS_CANISTER_ID,
  transFee: BigInt(1000000),
  totalSupply: BigInt(200000000000000),
  standardType: TOKEN_STANDARD.ICRC1,
  logo: `/images/tokens/${ICS_CANISTER_ID}.png`,
};

export const ICS = new Token({
  address: ICS_TOKEN_INFO.canisterId,
  decimals: ICS_TOKEN_INFO.decimals,
  symbol: ICS_TOKEN_INFO.symbol,
  name: ICS_TOKEN_INFO.name,
  logo: ICS_TOKEN_INFO.logo,
  standard: TOKEN_STANDARD.ICRC1,
  transFee: Number(ICS_TOKEN_INFO.transFee),
});
