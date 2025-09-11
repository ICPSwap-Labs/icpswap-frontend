import { socialMedia } from "@icpswap/actor";
import { useCallback } from "react";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import type { SocialMediaResult } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getTokensNews(token_symbol: string, offset: number, limit: number) {
  const result = resultFormat<Array<SocialMediaResult>>(
    await (await socialMedia()).get_news(token_symbol, BigInt(offset), BigInt(limit)),
  ).data;

  return result;
}

export function useTokenNews(token_symbol: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!token_symbol || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTokensNews(token_symbol, offset, limit);
    }, [token_symbol, offset, limit]),
  );
}
