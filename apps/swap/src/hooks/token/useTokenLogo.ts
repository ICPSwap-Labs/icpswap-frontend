import { useMemo } from "react";

export function generateLogoUrl(tokenId: string) {
  // return `https://wqfao-piaaa-aaaag-qj5ba-cai.raw.icp0.io/${tokenId}`;
  return `https://static.icpswap.com/logo/${tokenId}`;
}

export function useTokenLogo(tokenId: string | undefined) {
  return useMemo(() => {
    if (!tokenId) return undefined;
    return generateLogoUrl(tokenId);
  }, [tokenId]);
}
