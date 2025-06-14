import { useMemo } from "react";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import type { Null, InfoTokenRealTimeDataResponse } from "@icpswap/types";
import { ckUSDC } from "@icpswap/tokens";

import { getNodeInfoAllTokens } from "./node";

export function useFetchInfoAllTokens() {
  const { data } = useSwr(
    ["info_all_tokens"],
    async () => {
      return await getNodeInfoAllTokens();
    },
    {
      refreshInterval: 60000,
    },
  );

  return data;
}

export function useInfoAllTokens() {
  const { data } = useSWRImmutable<InfoTokenRealTimeDataResponse[] | undefined>(["info_all_tokens"]);
  return useMemo(() => data, data);
}

export function useInfoToken(tokenId: string | Null): InfoTokenRealTimeDataResponse | undefined {
  const { data } = useSWRImmutable<InfoTokenRealTimeDataResponse[] | undefined>(["info_all_tokens"]);

  return useMemo(() => {
    const info = data?.find((e) => e.tokenLedgerId === tokenId);
    // Make ckUSDC price USD is 1
    if (tokenId === ckUSDC.address && info) return { ...info, priceUSD: 1 } as InfoTokenRealTimeDataResponse;

    return info;
  }, [data, tokenId]);
}
