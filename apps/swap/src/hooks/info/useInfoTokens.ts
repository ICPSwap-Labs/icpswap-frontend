import { getInfoAllTokens } from "@icpswap/hooks";
import useSwr from "swr";
import useSWRImmutable from "swr/immutable";
import type { PublicTokenOverview } from "@icpswap/types";
import { useMemo } from "react";

export function useFetchInfoAllToken() {
  const { data } = useSwr(
    ["info_all_tokens"],
    async () => {
      return await getInfoAllTokens();
    },
    {
      refreshInterval: 30000,
    },
  );

  return data;
}

export function useInfoAllTokens() {
  const { data } = useSWRImmutable<PublicTokenOverview[] | undefined>(["info_all_tokens"]);
  return useMemo(() => data, data);
}

export function useInfoToken(tokenId: string | undefined) {
  const { data } = useSWRImmutable<PublicTokenOverview[] | undefined>(["info_all_tokens"]);

  return useMemo(() => {
    return data?.find((e) => e.address === tokenId);
  }, [data, tokenId]);
}
