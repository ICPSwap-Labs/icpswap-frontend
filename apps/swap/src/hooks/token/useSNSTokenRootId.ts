import { useMemo } from "react";
import { useFetchSnsAllTokensInfo } from "store/sns/hooks";

export function useSNSTokenRootId(tokenId: string | undefined) {
  const { result: snsAllTokensInfo } = useFetchSnsAllTokensInfo();

  return useMemo(() => {
    if (!tokenId || !snsAllTokensInfo) return undefined;
    const snsTokenInfo = snsAllTokensInfo.find((e) => e.canister_ids.ledger_canister_id === tokenId);
    return snsTokenInfo?.canister_ids.root_canister_id;
  }, [snsAllTokensInfo, tokenId]);
}
