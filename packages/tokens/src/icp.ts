import { Token } from "@icpswap/swap-sdk";
import { TokenInfo } from "@icpswap/types";
import { TOKEN_STANDARD, LEDGER_CANISTER_ID } from "@icpswap/constants";

export const ICP_TOKEN_INFO: TokenInfo = {
  symbol: "ICP",
  name: "Internet Computer",
  decimals: 8,
  canisterId: LEDGER_CANISTER_ID,
  transFee: BigInt(10000),
  totalSupply: BigInt(200000000000000),
  standardType: TOKEN_STANDARD.ICRC2,
  logo: `/images/tokens/${LEDGER_CANISTER_ID}.svg`,
};

export const ICP = new Token({
  address: ICP_TOKEN_INFO.canisterId,
  decimals: ICP_TOKEN_INFO.decimals,
  symbol: ICP_TOKEN_INFO.symbol,
  name: ICP_TOKEN_INFO.name,
  logo: ICP_TOKEN_INFO.logo,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(ICP_TOKEN_INFO.transFee),
});
