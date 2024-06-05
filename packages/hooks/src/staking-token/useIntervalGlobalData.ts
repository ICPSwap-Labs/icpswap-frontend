import { useCallback, useMemo, useState } from "react";
import type { StakingPoolGlobalData } from "@icpswap/types";

import { getStakingPoolGlobalData } from "./calls";
import { useInterval } from "../useInterval";

export function useStakeIntervalGlobalData() {
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  const callback = useCallback(async () => {
    return await getStakingPoolGlobalData();
  }, []);

  const globalData = useInterval<StakingPoolGlobalData>(callback, forceUpdate);

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
