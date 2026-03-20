import { SubAccount } from "@icp-sdk/canisters/ledger/icp";
import { Principal } from "@icp-sdk/core/principal";
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
import { getTokenBalance } from "hooks/token/useTokenBalance";
import { useIntervalFetch } from "hooks/useIntervalFetch";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export function useUserUnusedTokens(reload?: boolean | number) {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<UnusedBalance[]>([]);
  const principal = useAccountPrincipal();

  const { result, loading: poolsLoading } = useStakingTokenAllPools();

  // filter standard dip20, because dip20 use transferFrom, no unused tokens
  const pools = useMemo(() => {
    return result.filter((ele) => ele.stakingToken.standard !== TOKEN_STANDARD.DIP20);
  }, [result]);

  useEffect(() => {
    const call = async () => {
      if (pools && principal) {
        if (pools.length === 0) {
          setLoading(false);
        } else {
          const calls = pools.map(async (ele) => {
            return await getTokenBalance(
              ele.stakingToken.address,
              Principal.fromText(ele.canisterId.toString()),
              SubAccount.fromPrincipal(principal).toUint8Array(),
            );
          });

          const _result = await Promise.all(calls);

          const data = _result
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

          setBalances(data);

          setLoading(false);
        }
      }
    };

    call();
  }, [pools, principal, reload]);

  return useMemo(() => {
    return {
      loading: poolsLoading || loading,
      result: balances,
    };
  }, [loading, poolsLoading, balances]);
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
