import type { StakingPoolGlobalData } from "@icpswap/types";
import { useCallback, useMemo, useState } from "react";
import { useInterval } from "../useInterval";
import { getStakingPoolGlobalData } from "./calls";

export function useStakeIntervalGlobalData() {
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const callback = useCallback(async () => {
    return await getStakingPoolGlobalData();
  }, []);

  const globalData = useInterval<StakingPoolGlobalData>({ callback, interval: 5_000, force: forceUpdate });

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, [setForceUpdate]);

  return useMemo(
    () => ({
      data: globalData,
      updateCallback: update,
    }),
    [globalData, update],
  );
}
