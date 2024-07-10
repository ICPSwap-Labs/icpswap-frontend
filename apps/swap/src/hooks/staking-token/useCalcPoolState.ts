import { useCallback } from "react";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useInterval } from "@icpswap/hooks";
import { getStakingTokenPoolState } from "utils/staking";

export interface UseCalcPoolStateArgs {
  pool: StakingPoolControllerPoolInfo | undefined;
}

export function useCalcPoolState({ pool }: UseCalcPoolStateArgs) {
  const callback = useCallback(async () => {
    return getStakingTokenPoolState(pool);
  }, [pool]);

  return useInterval(callback, undefined, 1000);
}
