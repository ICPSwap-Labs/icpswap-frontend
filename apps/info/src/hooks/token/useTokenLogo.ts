import { useMemo } from "react";

export function generateLogoUrl(tokenId: string) {
  return `https://wqfao-piaaa-aaaag-qj5ba-cai.raw.icp0.io/${tokenId}`;
}

export function useTokenLogo(tokenId: string | undefined) {
  return useMemo(() => {
    if (!tokenId) return undefined;

    return `https://wqfao-piaaa-aaaag-qj5ba-cai.raw.icp0.io/${tokenId}`;
  }, [tokenId]);
}
