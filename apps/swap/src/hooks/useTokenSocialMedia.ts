import { getTokensNews } from "@icpswap/hooks";
import { Null, SocialMediaResult } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";
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

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<undefined | Array<SocialMediaResult>>(undefined);

  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(xHandle)) return;

      setLoading(true);
      const socialMedias = await getTokensNews(xHandle, 0, 1000);
      setResult(socialMedias);
      setLoading(false);
    }

    call();
  }, [xHandle]);

  return useMemo(
    () => ({
      loading,
      result,
    }),
    [loading, result],
  );
}
