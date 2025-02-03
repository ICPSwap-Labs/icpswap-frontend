import { useMemo } from "react";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { Null } from "@icpswap/types";

export function useIsSnsToken(tokenId: string | Null) {
  const root_canister_id = useSNSTokenRootId(tokenId);

  return useMemo(() => {
    return !!root_canister_id;
  }, [tokenId, root_canister_id]);
}
