import { useCallback, useState, useEffect } from "react";
import { useCallsData, getStakingTokenUserInfo, getStakingPoolCycles, getStakingTokenPool } from "@icpswap/hooks";
import { PoolData, UserStakingInfo } from "types/staking-token";
import { Principal } from "@dfinity/principal";

export function useUserStakingInfo(
  poolId: string | undefined,
  principal: Principal | undefined,
): [UserStakingInfo | undefined, () => void] {
  const [userInfo, setUserInfo] = useState<UserStakingInfo | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId || !principal) return;

      const result = await getStakingTokenUserInfo(poolId, principal);

      if (result) {
        setUserInfo({
          amount: result.amount,
          reward: result.pendingReward,
        } as UserStakingInfo);
      }
    };

    if (principal && poolId) {
      call();
    }
  }, [poolId, principal, forceUpdate]);

  return [userInfo, update];
}

export function useStakingPoolData(poolId: string | undefined): [PoolData | undefined, () => void] {
  const [poolData, setPoolData] = useState<PoolData | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId) return;
      const data = await getStakingTokenPool(poolId);
      setPoolData(data);
    };

    if (poolId) {
      call();
    }
  }, [poolId, forceUpdate]);

  return [poolData, update];
}

export function usePoolCycles(canisterId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return (await getStakingPoolCycles(canisterId))?.balance;
    }, [canisterId]),
  );
}
