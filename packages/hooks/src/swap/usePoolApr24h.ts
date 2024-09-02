import { BigNumber, calcFee24h, isNullArgs } from "@icpswap/utils";
import { useMemo } from "react";
import { type Null } from "@icpswap/types";

export interface UsePoolApr24hProps {
  volumeUSD: number | string | Null;
  poolTvlUSD: number | string | Null;
}

export function usePoolApr24h({ volumeUSD, poolTvlUSD }: UsePoolApr24hProps) {
  return useMemo(() => {
    if (isNullArgs(volumeUSD) || isNullArgs(poolTvlUSD)) return undefined;

    const fee24h = calcFee24h(volumeUSD);

    return `${new BigNumber(fee24h)
      .dividedBy(poolTvlUSD)
      .multipliedBy(360 * 0.8)
      .multipliedBy(100)
      .toFixed(2)}%`;
  }, [poolTvlUSD, volumeUSD]);
}
