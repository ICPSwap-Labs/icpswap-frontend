import { Token } from "@icpswap/swap-sdk";
import { TokenInfo } from "@icpswap/types";
import { TOKEN_STANDARD } from "@icpswap/constants";

export const ckETHTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "Chain key Ethereum",
  decimals: 18,
  symbol: "ckETH",
  canisterId: "ss2fx-dyaaa-aaaar-qacoq-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(10_000_000_000),
  logo: `/images/tokens/ss2fx-dyaaa-aaaar-qacoq-cai.svg`,
};

export const ckETH = new Token({
  address: ckETHTokenInfo.canisterId,
  decimals: ckETHTokenInfo.decimals,
  symbol: ckETHTokenInfo.symbol,
  name: ckETHTokenInfo.name,
  logo: ckETHTokenInfo.logo,
  standard: TOKEN_STANDARD.ICRC2,
  transFee: Number(ckETHTokenInfo.transFee),
});

export const ckSepoliaETHTokenInfo: TokenInfo = {
  standardType: TOKEN_STANDARD.ICRC2,
  name: "Chain key Sepolia Ethereum",
  decimals: 18,
  symbol: "ckSepoliaETH",
  canisterId: "apia6-jaaaa-aaaar-qabma-cai",
  totalSupply: BigInt(0),
  transFee: BigInt(10_000_000_000),
  logo: `/images/tokens/apia6-jaaaa-aaaar-qabma-cai.png`,
};

export const ckSepoliaETH = new Token({
  address: ckSepoliaETHTokenInfo.canisterId,
  decimals: ckSepoliaETHTokenInfo.decimals,
  symbol: ckSepoliaETHTokenInfo.symbol,
  name: ckSepoliaETHTokenInfo.name,
  logo: ckSepoliaETHTokenInfo.logo,
  standard: ckSepoliaETHTokenInfo.standardType,
  transFee: Number(ckSepoliaETHTokenInfo.transFee),
});
