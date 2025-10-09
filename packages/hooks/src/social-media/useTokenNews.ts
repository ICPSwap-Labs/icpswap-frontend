import { socialMedia } from "@icpswap/actor";
import { useCallback } from "react";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import type { SocialMediaResult } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getTokensNews(handle: string, offset: number, limit: number) {
  const result = resultFormat<Array<SocialMediaResult>>(
    await (await socialMedia()).get_news(handle, BigInt(offset), BigInt(limit)),
  ).data;

  return result;
}

export function useTokenNews(handle: string | undefined, offset: number, limit: number) {
  return useCallsData(
    useCallback(async () => {
      if (!handle || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTokensNews(handle, offset, limit);
    }, [handle, offset, limit]),
  );
}
