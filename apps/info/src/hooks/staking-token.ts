import { useCallback, useState, useEffect } from "react";
import { useCallsData } from "@icpswap/hooks";
import { getV1StakingTokenUserInfo, getStakingTokenUserInfo } from "@icpswap/hooks";
import { getStakingTokenCycles, getV1StakingTokenCycles } from "@icpswap/hooks";
import { getStakingTokenPool, getV1StakingTokenPool } from "@icpswap/hooks";
import { PoolData, UserStakingInfo, V1PoolData } from "types/staking-token";

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
      const result = await getStakingTokenUserInfo(poolId!, account!);

      if (result) {
        setUserInfo({
          amount: result.amount,
          reward: result.pendingReward,
        } as UserStakingInfo);
      }
    };

    const v1Call = async () => {
      const result = await getV1StakingTokenUserInfo(poolId!, account!);

      if (result) {
        setUserInfo({
          amount: result.amount,
          reward: result.pendingReward,
        } as UserStakingInfo);
      }
    };

    if (account && poolId && version) {
      if (version === "1.0") {
        v1Call();
      } else {
        call();
      }
    }
  }, [poolId, account, forceUpdate, version]);

  return [userInfo, update];
}

export function useStakingPoolData(
  poolId: string | undefined,
  version: string | undefined,
): [PoolData | undefined, () => void] {
  const [poolData, setPoolData] = useState<PoolData | undefined>(undefined);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, []);

  useEffect(() => {
    const call = async () => {
      const data = await getStakingTokenPool(poolId!);
      setPoolData(data);
    };

    const v1Call = async () => {
      const data = await getV1StakingTokenPool(poolId!);
      if (data) {
        setPoolData({
          ...data,
          stakingToken: {
            address: data?.stakingToken,
            standard: data?.stakingStandard,
          },
          rewardToken: {
            address: data?.rewardToken,
            standard: data?.rewardStandard,
          },
          storageCid: data.storageCanisterId,
        } as V1PoolData);
      }
    };

    if (poolId) {
      if (version === "1.0") {
        v1Call();
      } else {
        call();
      }
    }
  }, [poolId, version, forceUpdate]);

  return [poolData, update];
}

export function usePoolCycles(canisterId: string | undefined, version: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      if (version === "1.0") return await getV1StakingTokenCycles(canisterId!);
      return (await getStakingTokenCycles(canisterId!))?.balance;
    }, [canisterId, version]),
  );
}
