import { Token } from "@icpswap/swap-sdk";
import { TokenInfo, TOKEN_STANDARD } from "@icpswap/types";

export const ckUSDTTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "ckUSDT",
  decimals: 6,
  symbol: "ckUSDT",
  canisterId: "cngnf-vqaaa-aaaar-qag4q-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(10),
  logo: `/images/tokens/cngnf-vqaaa-aaaar-qag4q-cai.svg`,
};

export const ckUSDT = new Token({
  address: ckUSDTTokenInfo.canisterId,
  decimals: ckUSDTTokenInfo.decimals,
  symbol: ckUSDTTokenInfo.symbol,
  name: ckUSDTTokenInfo.name,
  logo: ckUSDTTokenInfo.logo,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(ckUSDTTokenInfo.transFee),
});
