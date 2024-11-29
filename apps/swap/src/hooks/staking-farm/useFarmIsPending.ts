import { useMemo } from "react";
import { isNullArgs } from "@icpswap/utils";
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
    if (isNullArgs(state) || isNullArgs(farmTokenBalance)) return false;

    return state === "LIVE" && farmTokenBalance.isEqualTo(0);
  }, [state, farmTokenBalance]);
}
