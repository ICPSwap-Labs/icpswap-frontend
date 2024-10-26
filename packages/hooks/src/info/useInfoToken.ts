import { useMemo } from "react";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import type { PublicTokenOverview } from "@icpswap/types";
import { ckUSDC } from "@icpswap/tokens";

import { getNodeInfoAllTokens } from "./node";

export function useFetchInfoAllTokens() {
  const { data } = useSwr(
    ["info_all_tokens"],
    async () => {
      return await getNodeInfoAllTokens();
    },
    {
      refreshInterval: 300000,
    },
  );

  return data;
}

export function useInfoAllTokens() {
  const { data } = useSWRImmutable<PublicTokenOverview[] | undefined>(["info_all_tokens"]);
  return useMemo(() => data, data);
}

export function useInfoToken(tokenId: string | undefined): PublicTokenOverview | undefined {
  const { data } = useSWRImmutable<PublicTokenOverview[] | undefined>(["info_all_tokens"]);

  return useMemo(() => {
    const info = data?.find((e) => e.address === tokenId);
    // Make ckUSDC price USD is 1
    if (tokenId === ckUSDC.address && info) return { ...info, priceUSD: 1 } as PublicTokenOverview;

    return info;
  }, [data, tokenId]);
}
