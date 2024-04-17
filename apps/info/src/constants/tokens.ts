import { Token } from "@icpswap/swap-sdk";
import { TokenInfo } from "types/token";
import { TOKEN_STANDARD } from "@icpswap/types";
import ckTestUSDLogo from "assets/images/ckTestUSD.png";

export const ckTestUSD_TOKEN_INFO: TokenInfo = {
  canisterId: "yfumr-cyaaa-aaaar-qaela-cai",
  decimals: 6,
  symbol: "ckSepoliaUSDC",
  name: "Chain key Sepolia USDC",
  logo: ckTestUSDLogo,
  standardType: TOKEN_STANDARD.ICRC2,
  transFee: BigInt(4000),
  totalSupply: BigInt(0),
};

export const ckTestUSD = new Token({
  address: ckTestUSD_TOKEN_INFO.canisterId,
  decimals: ckTestUSD_TOKEN_INFO.decimals,
  symbol: ckTestUSD_TOKEN_INFO.symbol,
  name: ckTestUSD_TOKEN_INFO.name,
  logo: ckTestUSD_TOKEN_INFO.logo,
  standard: ckTestUSD_TOKEN_INFO.standardType,
  transFee: Number(ckTestUSD_TOKEN_INFO.transFee),
});
