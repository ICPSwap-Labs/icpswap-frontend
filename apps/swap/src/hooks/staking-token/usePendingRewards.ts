import { useEffect, useMemo, useState } from "react";
import { useStakingPools, getStakingTokenUserInfo } from "@icpswap/hooks";
import { STATE, UserPendingRewards } from "types/staking-token";
import { useAccountPrincipal } from "store/auth/hooks";
import { Principal } from "@dfinity/principal";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";

let stake_pending_reward_fetch_index = 0;
const CALL_LIMITED = 10;

export const getStateValue = (state: STATE) => {
  switch (state) {
    case STATE.LIVE:
      return BigInt(2);
    case STATE.UPCOMING:
      return BigInt(1);
    case STATE.FINISHED:
      return BigInt(3);
    default:
      return undefined;
  }
};

export function usePendingRewards(refresh?: number | boolean) {
  const principal = useAccountPrincipal();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserPendingRewards[]>([]);

  const { result } = useStakingPools(getStateValue(STATE.LIVE), 0, 100);

  useEffect(() => {
    stake_pending_reward_fetch_index++;
  }, []);

  useEffect(() => {
    const fetch = async (pool: StakingPoolControllerPoolInfo, principal: Principal, fetch_index: number) => {
      try {
        if (fetch_index !== stake_pending_reward_fetch_index) {
          return undefined;
        }

        const poolId = pool.canisterId.toString();
        const rewardTokenId = pool.rewardToken.address;

        const result = await getStakingTokenUserInfo(poolId, principal);
        if (!result) return undefined;

        return {
          ...result,
          poolId,
          rewardTokenId,
          amount: result.rewardTokenBalance + result.stakeTokenBalance,
        } as UserPendingRewards;
      } catch (err) {
        console.error(err);
      }

      return undefined;
    };

    const call = async (new_index: number) => {
      if (result && principal) {
        const pools = result.content;

        if (pools.length === 0) {
          setLoading(false);
        } else {
          const calls: (() => Promise<UserPendingRewards | undefined>)[][] = [[]];

          for (let i = 0; i < pools.length; i++) {
            if (i % CALL_LIMITED === 0 && i !== 0) {
              calls.push([]);
            }

            const pool = pools[i];

            calls[calls.length - 1].push(async () => await fetch(pool, principal, new_index));
          }

          let allResult: (UserPendingRewards | undefined)[] = [];

          for (let i = 0; i < calls.length; i++) {
            const _calls = calls[i].map(async (call) => await call());
            const result = await Promise.all(_calls);
            allResult = allResult.concat(result);
          }

          if (new_index === stake_pending_reward_fetch_index) {
            setData((allResult.filter((e) => !!e) as UserPendingRewards[]).filter((e) => e.amount !== BigInt(0)));
            setLoading(false);
          }
        }
      }
    };

    if (result && principal) {
      const pools = result.content;

      if (pools.length === 0) {
        setLoading(false);
      } else {
        const new_index = stake_pending_reward_fetch_index;
        setLoading(true);
        setData([]);
        call(new_index);
      }
    }
  }, [result, principal, refresh]);

  return useMemo(() => ({ loading, result: data }), [loading, data]);
}
