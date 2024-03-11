import { useCallback, useMemo, useState } from "react";
import { useICPPrice } from "store/global/hooks";
import { v3FarmController } from "@icpswap/actor";
import { formatDollarAmount, resultFormat } from "@icpswap/utils";
import BigNumber from "bignumber.js";

type GlobalData = { stakeTokenTVL: string; rewardTokenTVL: string };

export function useFarmGlobalData(): [GlobalData, () => void] {
  const icpPrice = useICPPrice();

  const [data, setData] = useState<GlobalData>({
    stakeTokenTVL: "0",
    rewardTokenTVL: "0",
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  useMemo(async () => {
    if (icpPrice) {
      const data = resultFormat<{ stakedTokenTVL: number; rewardTokenTVL: number }>(
        await (await v3FarmController()).getGlobalTVL(),
      ).data;

      if (data) {
        setData({
          stakeTokenTVL: formatDollarAmount(new BigNumber(data.stakedTokenTVL).multipliedBy(icpPrice).toFixed(4)),
          rewardTokenTVL: formatDollarAmount(new BigNumber(data.rewardTokenTVL).multipliedBy(icpPrice).toFixed(4)),
        });
      }
    }
  }, [icpPrice, forceUpdate]);

  const update = useCallback(() => {
    setForceUpdate((prevState) => prevState + 1);
  }, [setForceUpdate]);

  return [data, update];
}
