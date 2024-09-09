import { useEffect, useMemo, useState } from "react";
import { FilterState } from "types/staking-token";
import { getStakePools, getUserStakePools, getStakingPoolFromController } from "@icpswap/hooks";
import { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { isAvailablePageArgs } from "@icpswap/utils";
import { getStateValueByFilterState } from "utils/stake/index";

export interface UsePoolsArgs {
  filterState: FilterState;
  offset: number;
  limit: number;
  stakeTokenId: string | undefined | null;
  rewardTokenId: string | undefined | null;
}

export function usePools({ filterState, stakeTokenId, rewardTokenId, offset, limit }: UsePoolsArgs) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState<boolean>(false);
  const [pools, setPools] = useState<null | Array<StakingPoolControllerPoolInfo>>(null);

  useEffect(() => {
    async function call() {
      if (!isAvailablePageArgs(offset, limit)) return;

      const state = getStateValueByFilterState(filterState);
      setPools(null);

      if (filterState === FilterState.YOUR) {
        if (!principal) return;

        setLoading(true);

        const poolsResult = await getUserStakePools(principal.toString(), offset, limit, stakeTokenId, rewardTokenId);
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
        const result = await getStakePools({ state, offset, limit, stakeTokenId, rewardTokenId });
        const pools = result?.content;
        setPools(pools);
      }

      setLoading(false);
    }

    call();
  }, [filterState, principal, offset, limit, stakeTokenId, rewardTokenId]);

  return useMemo(() => ({ loading, result: pools }), [loading, pools]);
}
