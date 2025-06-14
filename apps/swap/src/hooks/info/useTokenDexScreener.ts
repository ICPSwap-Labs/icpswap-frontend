import { Null } from "@icpswap/types";
import { uesTokenPairWithIcp } from "hooks/swap";
import { useMemo } from "react";

export function useTokenDexScreener(tokenId: string | Null) {
  const poolId = uesTokenPairWithIcp({ tokenId });

  return useMemo(() => {
    return poolId ?? tokenId;
  }, [poolId, tokenId]);
}
