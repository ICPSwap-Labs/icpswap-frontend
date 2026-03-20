import { getTokensNews } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useGlobalTokenList } from "store/global/hooks";

export function useTokenXHandle(tokenId: string | Null) {
  const globalTokenList = useGlobalTokenList();

  return useMemo(() => {
    if (isUndefinedOrNull(tokenId) || isUndefinedOrNull(globalTokenList)) return undefined;

    const tokenInfo = globalTokenList.find((element) => element.canisterId === tokenId);

    if (isUndefinedOrNull(tokenInfo)) return undefined;

    const mediaLink = tokenInfo.mediaLinks.find((element) => element.mediaType === "Twitter");

    if (isUndefinedOrNull(mediaLink)) return undefined;

    const __arr = mediaLink.link.split("/");

    return __arr[__arr.length - 1];
  }, [tokenId]);
}

export function useTokenSocialMedias(tokenId: string | Null) {
  const xHandle = useTokenXHandle(tokenId);

  return useQuery({
    queryKey: ["tokenSocialMedia", tokenId, xHandle],
    queryFn: async () => {
      if (isUndefinedOrNull(xHandle)) return undefined;
      return await getTokensNews(xHandle, 0, 1000);
    },
    enabled: nonUndefinedOrNull(xHandle),
  });
}
