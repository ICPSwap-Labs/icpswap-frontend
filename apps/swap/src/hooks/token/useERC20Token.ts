import { USDC, SepoliaUSDC, ckUSDC, ckSepoliaUSDC } from "@icpswap/tokens";
import { useMemo } from "react";

export function useERC20Token(contractAddress: string | undefined) {
  return useMemo(() => {
    if (!contractAddress) return undefined;
    if (contractAddress === SepoliaUSDC.address) return SepoliaUSDC;
    if (contractAddress === USDC.address) return USDC;
    return undefined;
  }, [contractAddress]);
}

export function useERC20TokenByChainKeyId(tokenId: string | undefined) {
  return useMemo(() => {
    if (!tokenId) return undefined;
    if (tokenId === ckSepoliaUSDC.address) return SepoliaUSDC;
    if (tokenId === ckUSDC.address) return USDC;
    return undefined;
  }, [tokenId]);
}
