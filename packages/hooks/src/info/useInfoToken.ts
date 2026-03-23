import { ckUSDC } from "@icpswap/tokens";
import type { InfoTokenRealTimeDataResponse, Null } from "@icpswap/types";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { getNodeInfoAllTokens } from "./node";

const infoAtom = atom<InfoTokenRealTimeDataResponse[]>([]);

export function useFetchInfoAllTokens() {
  const [, setInfoAllTokens] = useAtom(infoAtom);

  const { data } = useQuery({
    queryKey: ["info_all_tokens"],
    queryFn: async () => {
      const data = await getNodeInfoAllTokens();
      setInfoAllTokens(data);
      return data;
    },
    refetchInterval: 60_000,
  });

  return useMemo(() => data, [data]);
}

export function useInfoAllTokens() {
  return useAtomValue(infoAtom);
}

export function useInfoToken(tokenId: string | Null): InfoTokenRealTimeDataResponse | undefined {
  const data = useInfoAllTokens();

  return useMemo(() => {
    const info = data?.find((e) => e.tokenLedgerId === tokenId);
    // Make ckUSDC price USD is 1
    if (tokenId === ckUSDC.address && info) return { ...info, priceUSD: 1 } as InfoTokenRealTimeDataResponse;

    return info;
  }, [data, tokenId]);
}
