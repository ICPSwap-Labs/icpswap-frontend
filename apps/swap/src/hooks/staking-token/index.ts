import { SubAccount, Principal } from "@icpswap/dfinity";
import {
  getPaginationAllData,
  getStakingPools,
  getStakingTokenPool,
  getStakingTokenUserInfo,
  useInterval,
  usePaginationAllData,
} from "@icpswap/hooks";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import { type Null, ResultStatus, type StakingPoolInfo, type StakingPoolUserInfo } from "@icpswap/types";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useCallback, useMemo, useState } from "react";
import { useAccountPrincipal } from "store/auth/hooks";
import type { UnusedBalance } from "types/staking-token";

export async function getAllTokenPools() {
  const call = async (offset: number, limit: number) => {
    return await getStakingPools(undefined, offset, limit);
  };

  return getPaginationAllData(call, 500);
}

export function useStakingTokenAllPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getStakingPools(undefined, offset, limit);
  }, []);

  return usePaginationAllData(call, 500);
}

export function useUserUnusedTokens(reload?: number) {
  const principal = useAccountPrincipal();

  const { result, loading: poolsLoading } = useStakingTokenAllPools();

  // filter standard dip20, because dip20 use transferFrom, no unused tokens
  const pools = useMemo(() => {
    return result.filter((ele) => ele.stakingToken.standard !== TOKEN_STANDARD.DIP20);
  }, [result]);

  const { data, isLoading } = useQuery({
    queryKey: ["useUnusedTokens", principal, reload],
    queryFn: async () => {
      if (isUndefinedOrNull(pools) || isUndefinedOrNull(principal)) return;

      const calls = pools.map(async (ele) => {
        return await getTokenBalance(
          ele.stakingToken.address,
          Principal.fromText(ele.canisterId.toString()),
          SubAccount.fromPrincipal(principal).toUint8Array(),
        );
      });

      return (await Promise.all(calls))
        .map((ele, index) => {
          if (ele.status === ResultStatus.OK && ele.data) {
            const pool = pools[index];

            return {
              balance: ele.data,
              poolId: pool.canisterId.toString(),
              rewardTokenId: pool.rewardToken.address,
              ...pool,
            } as UnusedBalance;
          }
          return null;
        })
        .filter((ele) => !!ele) as UnusedBalance[];
    },
    enabled: nonUndefinedOrNull(principal) && nonUndefinedOrNull(pools),
  });

  return useMemo(() => {
    return {
      loading: poolsLoading || isLoading,
      result: data,
    };
  }, [isLoading, poolsLoading, data]);
}

export function useIntervalUserPoolInfo(
  poolId: string | undefined,
  principal: Principal | undefined,
  refresh?: number | Null,
) {
  const callback = useCallback(async () => {
    if (!poolId || !principal) return;
    return await getStakingTokenUserInfo(poolId, principal);
  }, [poolId, principal]);

  return useIntervalFetch<StakingPoolUserInfo | undefined>(callback, refresh);
}

export function useIntervalStakingPoolInfo(poolId: string | undefined): [StakingPoolInfo | undefined, () => void] {
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  const callback = useCallback(async () => {
    if (!poolId) return;
    return await getStakingTokenPool(poolId);
  }, [poolId]);

  const poolInfo = useInterval<StakingPoolInfo | undefined>({
    callback: callback,
    interval: 5_000,
    force: forceUpdate,
  });

  return [poolInfo, update];
}

export * from "./usePools";
export * from "./useStateColors";
export * from "./useUnusedTokens";
