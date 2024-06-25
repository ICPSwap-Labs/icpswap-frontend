import { ERC20Token, Token } from "@icpswap/swap-sdk";
import { USDC, SepoliaUSDC, ckUSDC, ckSepoliaUSDC, ckLink, LINK } from "@icpswap/tokens";
import { useMemo } from "react";

const TOKENS_MAP: [Token, ERC20Token][] = [
  [ckLink, LINK],
  [ckUSDC, USDC],
  [ckSepoliaUSDC, SepoliaUSDC],
];

// TODO: Use token from network
export function useERC20Token(contractAddress: string | undefined) {
  return useMemo(() => {
    if (!contractAddress) return undefined;
    return TOKENS_MAP.find((e) => e[1].address === contractAddress)?.[1];
  }, [contractAddress]);
}

export function useERC20TokenByChainKeyId(tokenId: string | undefined) {
  return useMemo(() => {
    if (!tokenId) return undefined;

    return TOKENS_MAP.find((e) => e[0].address === tokenId)?.[1];
  }, [tokenId]);
}
