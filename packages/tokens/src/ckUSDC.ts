import { Token } from "@icpswap/swap-sdk";
import { TokenInfo } from "@icpswap/types";
import { TOKEN_STANDARD } from "@icpswap/constants";

export const ckUSDCTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "ckUSDC",
  decimals: 8,
  symbol: "ckUSDC",
  canisterId: "xevnm-gaaaa-aaaar-qafnq-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(10),
  logo: `/images/tokens/xevnm-gaaaa-aaaar-qafnq-cai.svg`,
};

export const ckUSDC = new Token({
  address: ckUSDCTokenInfo.canisterId,
  decimals: ckUSDCTokenInfo.decimals,
  symbol: ckUSDCTokenInfo.symbol,
  name: ckUSDCTokenInfo.name,
  logo: ckUSDCTokenInfo.logo,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(ckUSDCTokenInfo.transFee),
});

export const ckSepoliaUSDCTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "Chain key Sepolia USD",
  decimals: 6,
  symbol: "ckSepoliaUSDC",
  canisterId: "yfumr-cyaaa-aaaar-qaela-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(4000),
  logo: `/images/tokens/yfumr-cyaaa-aaaar-qaela-cai.png`,
};

export const ckSepoliaUSDC = new Token({
  address: ckSepoliaUSDCTokenInfo.canisterId,
  decimals: ckSepoliaUSDCTokenInfo.decimals,
  symbol: ckSepoliaUSDCTokenInfo.symbol,
  name: ckSepoliaUSDCTokenInfo.name,
  logo: ckSepoliaUSDCTokenInfo.logo,
  standard: ckSepoliaUSDCTokenInfo.standardType,
  transFee: Number(ckSepoliaUSDCTokenInfo.transFee),
});
