import { ERC20Token } from "@icpswap/swap-sdk";

export const USDC = new ERC20Token({
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  name: "USDC",
  symbol: "USDC",
  decimals: 6,
  logo: "/images/tokens/yfumr-cyaaa-aaaar-qaela-cai-erc20.png",
});

export const SepoliaUSDC = new ERC20Token({
  address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  name: "USDC(Sepolia)",
  symbol: "USDC(Sepolia)",
  decimals: 6,
  logo: "/images/tokens/yfumr-cyaaa-aaaar-qaela-cai-erc20.png",
});
