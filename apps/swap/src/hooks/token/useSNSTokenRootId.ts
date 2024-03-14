import { useMemo } from "react";
import { useTokenSNSRootIds } from "store/global/hooks";

export function useSNSTokenRootId(tokenId: string | undefined) {
  const tokenRootIds = useTokenSNSRootIds();

  return useMemo(() => {
    if (!tokenId || !tokenRootIds) return undefined;
    return tokenRootIds[tokenId];
  }, [tokenRootIds, tokenId]);
}
