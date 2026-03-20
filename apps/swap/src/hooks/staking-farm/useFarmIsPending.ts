import type { Token } from "@icpswap/swap-sdk";
import type { FarmState, Null } from "@icpswap/types";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { useTokenBalance } from "hooks/token";
import { useMemo } from "react";

export interface UseFarmIsPendingProps {
  state: FarmState | Null;
  farmId: string | Null;
  rewardToken: Token | Null;
}

export function useFarmIsPending({ farmId, state, rewardToken }: UseFarmIsPendingProps) {
  const { result: farmTokenBalance } = useTokenBalance({ tokenId: rewardToken?.address, account: farmId });

  return useMemo(() => {
    if (isUndefinedOrNull(state) || isUndefinedOrNull(farmTokenBalance)) return false;

    return state === "LIVE" && new BigNumber(farmTokenBalance).isEqualTo(0);
  }, [state, farmTokenBalance]);
}
