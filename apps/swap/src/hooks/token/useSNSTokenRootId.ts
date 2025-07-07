import { useMemo } from "react";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";
import { Null } from "@icpswap/types";

export function useSNSTokenRootId(tokenId: string | Null) {
  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();

  return useMemo(() => {
    if (!tokenId || !snsAllTokensInfo) return undefined;
    const snsTokenInfo = snsAllTokensInfo.find((e) => e.list_sns_canisters.ledger === tokenId);
    return snsTokenInfo?.list_sns_canisters.root;
  }, [snsAllTokensInfo, tokenId]);
}
