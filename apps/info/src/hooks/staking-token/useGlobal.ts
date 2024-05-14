import { useCallback, useState, useEffect } from "react";
import { getStakingPoolGlobalData } from "@icpswap/hooks";
import { type StakingPoolGlobalData } from "@icpswap/types";

export function useStakingGlobalData(): [StakingPoolGlobalData | undefined, () => void] {
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [data, setData] = useState<StakingPoolGlobalData | undefined>({
    rewardAmount: 0,
    stakingAmount: 0,
  });

  useEffect(() => {
    const call = async () => {
      const data = await getStakingPoolGlobalData();
      setData(data);
    };

    call();
  }, [forceUpdate]);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, [setForceUpdate]);

  return [data, update];
}
