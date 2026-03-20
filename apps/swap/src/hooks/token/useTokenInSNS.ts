import type { Null } from "@icpswap/types";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { useMemo } from "react";

export function useIsSnsToken(tokenId: string | Null) {
  const root_canister_id = useSNSTokenRootId(tokenId);

  return useMemo(() => {
    return !!root_canister_id;
  }, [tokenId, root_canister_id]);
}
