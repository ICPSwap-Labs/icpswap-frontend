import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import type { FarmState, Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useTokenBalance } from "hooks/token";

export interface UseFarmIsPendingProps {
  state: FarmState | Null;
  farmId: string | Null;
  rewardToken: Token | Null;
}

export function useFarmIsPending({ farmId, state, rewardToken }: UseFarmIsPendingProps) {
  const { result: farmTokenBalance } = useTokenBalance(rewardToken?.address, farmId);

  return useMemo(() => {
    if (isUndefinedOrNull(state) || isUndefinedOrNull(farmTokenBalance)) return false;

    return state === "LIVE" && new BigNumber(farmTokenBalance).isEqualTo(0);
  }, [state, farmTokenBalance]);
}
