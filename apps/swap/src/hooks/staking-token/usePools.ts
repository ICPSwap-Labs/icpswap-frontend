import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-token";
import { getStakingPools, getStakingUserPools, getStakingPoolFromController } from "@icpswap/hooks";
import { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { isAvailablePageArgs } from "@icpswap/utils";
import { getStateValueByFilterState } from "utils/stake/index";

export interface UsePoolsArgs {
  filterState: FilterState;
  offset: number;
  limit: number;
}

export function usePools({ filterState, offset, limit }: UsePoolsArgs) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [pools, setPools] = useState<null | Array<StakingPoolControllerPoolInfo>>(null);

  useEffect(() => {
    async function call() {
      if (!isAvailablePageArgs(offset, limit)) return;

      const state = getStateValueByFilterState(filterState);

      if (filterState === FilterState.YOUR) {
        if (!principal) return;

        setLoading(true);

        const poolsResult = await getStakingUserPools(principal.toString(), offset, limit);
        const pools = poolsResult?.content ?? [];

        const infos = (
          await Promise.all(
            pools.map(async (pool) => {
              return await getStakingPoolFromController(pool.stakingPool.toString());
            }),
          )
        ).flat();

        setPools(infos);
      } else {
        setLoading(true);
        const result = await getStakingPools(state, offset, limit);
        const pools = result?.content;
        setPools(pools);
      }

      setLoading(false);
    }

    call();
  }, [filterState, principal, offset, limit]);

  return useMemo(() => ({ loading, result: pools }), [loading, pools]);
}
