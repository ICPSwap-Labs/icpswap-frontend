import { useEffect, useMemo } from "react";
import type { PublicTokenOverview } from "@icpswap/types";
import { ckUSDC } from "@icpswap/tokens";
import { getNodeInfoAllTokens } from "@icpswap/hooks";
import { useGlobalContext } from "hooks/useGlobalContext";

export function useFetchInfoAllTokens() {
  const { setInfoAllTokens } = useGlobalContext();

  useEffect(() => {
    async function call() {
      const result = await getNodeInfoAllTokens();
      setInfoAllTokens(result);
    }

    const timer = setInterval(() => {
      call();
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);
}

export function useInfoAllTokens() {
  const { infoAllTokens } = useGlobalContext();

  return useMemo(() => infoAllTokens, [infoAllTokens]);
}

export function useInfoToken(tokenId: string | undefined) {
  const infoAllTokens = useInfoAllTokens();

  return useMemo(() => {
    const info = infoAllTokens?.find((e) => e.address === tokenId);

    // Make ckUSDC infoAllTokens USD is 1
    if (tokenId === ckUSDC.address && info) return { ...info, priceUSD: 1 } as PublicTokenOverview;

    return info;
  }, [infoAllTokens, tokenId]);
}
