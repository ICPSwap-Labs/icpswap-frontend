import { useMemo } from "react";
import { useFarmTVL } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import { useICPPrice } from "store/global/hooks";

export function useFarmUSDValue(farmId: string) {
  const icpPrice = useICPPrice();

  const { result: farmTVL } = useFarmTVL(farmId);

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
