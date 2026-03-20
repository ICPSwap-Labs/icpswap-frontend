import { socialMedia } from "@icpswap/actor";
import type { SocialMediaResult } from "@icpswap/types";
import { isAvailablePageArgs, resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getTokensNews(handle: string, offset: number, limit: number) {
  const result = resultFormat<Array<SocialMediaResult>>(
    await (await socialMedia()).get_news(handle, BigInt(offset), BigInt(limit)),
  ).data;

  return result;
}

export function useTokenNews(
  handle: string | undefined,
  offset: number,
  limit: number,
): UseQueryResult<SocialMediaResult[] | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenNews", handle, offset, limit],
    queryFn: async () => {
      if (!handle || !isAvailablePageArgs(offset, limit)) return undefined;
      return await getTokensNews(handle, offset, limit);
    },
    enabled: !!handle && isAvailablePageArgs(offset, limit),
  });
}
