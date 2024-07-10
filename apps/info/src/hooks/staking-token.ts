import { useCallback, useState, useEffect } from "react";
import { useCallsData, getStakingTokenUserInfo, getStakingPoolCycles, getStakingTokenPool } from "@icpswap/hooks";
import { PoolData } from "types/staking-token";
import { Principal } from "@dfinity/principal";
import { type StakingPoolUserInfo } from "@icpswap/types";

export function useUserStakingInfo(
  poolId: string | undefined,
  principal: Principal | undefined,
): [StakingPoolUserInfo | undefined, () => void] {
  const [userInfo, setUserInfo] = useState<StakingPoolUserInfo | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId || !principal) return;

      const result = await getStakingTokenUserInfo(poolId, principal);

      if (result) {
        setUserInfo(result);
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
