import { useCallback, useState, useEffect } from "react";
import { getV1StakingTokenUserInfo, getV1StakingTokenPool } from "@icpswap/hooks";
import { PoolData, UserStakingInfo } from "types/staking-token-v1";

export function useUserStakingInfo(
  poolId: string | undefined,
  version: string | undefined,
  account: string | undefined,
): [UserStakingInfo | undefined, () => void] {
  const [userInfo, setUserInfo] = useState<UserStakingInfo | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      if (!poolId || !account) return;

      const result = await getV1StakingTokenUserInfo(poolId, account);

      if (result) {
        setUserInfo({
          amount: result.amount,
          reward: result.pendingReward,
        } as UserStakingInfo);
      }
    };

    if (account && poolId && version) {
      call();
    }
  }, [poolId, account, forceUpdate, version]);

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
      const data = await getV1StakingTokenPool(poolId);
      setPoolData(data);
    };

    if (poolId) {
      call();
    }
  }, [poolId, forceUpdate]);

  return [poolData, update];
}
