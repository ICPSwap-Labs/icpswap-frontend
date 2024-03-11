import { useMemo } from "react";
import { useSNSTokenRoots } from "store/global/hooks";

export function useSNSTokenRootId(tokenId: string | undefined) {
  const tokenRoots = useSNSTokenRoots();

  return useMemo(() => {
    if (!tokenId || !tokenRoots) return undefined;

    const sns_root = tokenRoots[tokenId];
    if (!sns_root) return undefined;

    return sns_root.root_canister_id;
  }, [tokenRoots, tokenId]);
}
