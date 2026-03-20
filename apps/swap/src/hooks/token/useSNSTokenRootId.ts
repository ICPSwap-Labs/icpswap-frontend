import type { Null } from "@icpswap/types";
import { useMemo } from "react";
import { useStateSnsAllTokensInfo } from "store/sns/hooks";

export function useSNSTokenRootId(tokenId: string | Null) {
  const snsAllTokensInfo = useStateSnsAllTokensInfo();

  return useMemo(() => {
    if (!tokenId || !snsAllTokensInfo) return undefined;
    const snsTokenInfo = snsAllTokensInfo.find((e) => e.list_sns_canisters.ledger === tokenId);
    return snsTokenInfo?.list_sns_canisters.root;
  }, [snsAllTokensInfo, tokenId]);
}
