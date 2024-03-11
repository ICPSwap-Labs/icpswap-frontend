import { useCallback, useMemo } from "react";
import { getV3StakingFarms, useFarmTVL } from "@icpswap/hooks";
import { usePaginationAllData } from "hooks/usePaginationAllData";
import BigNumber from "bignumber.js";
import type { StakingFarmInfo } from "@icpswap/types";
import { useICPPrice } from "store/global/hooks";

export function useAllFarmPools() {
  const call = useCallback(async (offset: number, limit: number) => {
    return await getV3StakingFarms(offset, limit, "all");
  }, []);

  return usePaginationAllData(call, 100);
}

export function useFarmUSDValue(farm: StakingFarmInfo) {
  const icpPrice = useICPPrice();

  const { result: farmTVL } = useFarmTVL(farm.farmCid);

  const poolTVL = useMemo(() => {
    if (!farmTVL || !icpPrice) {
      return 0;
    }

    return new BigNumber(icpPrice)
      .multipliedBy(farmTVL.stakedTokenTVL)
      .div(10 ** 8)
      .toFixed(3);
  }, [farmTVL, icpPrice]);

  return useMemo(
    () => ({
      poolTVL,
    }),
    [poolTVL],
  );
}
