import { useMemo } from "react";
import { BigNumber } from "@icpswap/utils";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useToken } from "hooks/index";
import { InfoPoolRealTimeDataResponse } from "@icpswap/types";
import { useInfoPoolDetails } from "@icpswap/hooks";

export interface UsePoolTokenBalanceTvlProps {
  pool: InfoPoolRealTimeDataResponse | undefined;
}

export function usePoolTokenBalanceTvl({ pool }: UsePoolTokenBalanceTvlProps) {
  const [, token0] = useToken(pool?.token0LedgerId);
  const [, token1] = useToken(pool?.token1LedgerId);

  const { result: poolDetails } = useInfoPoolDetails({ poolId: pool?.poolId });

  const token0Price = useUSDPriceById(pool?.token0LedgerId);
  const token1Price = useUSDPriceById(pool?.token1LedgerId);

  return useMemo(() => {
    if (!poolDetails || !token0Price || !token1Price || !token0 || !token1) return {};

    const token0TvlUSD = new BigNumber(poolDetails.token0LiquidityAmount).multipliedBy(token0Price);
    const token1TvlUSD = new BigNumber(poolDetails.token1LiquidityAmount).multipliedBy(token1Price);

    return {
      poolTvlUSD: token0TvlUSD.plus(token1TvlUSD).toString(),
      token0TvlUSD: token0TvlUSD.toString(),
      token1TvlUSD: token1TvlUSD.toString(),
      token0Balance: poolDetails.token0LiquidityAmount,
      token1Balance: poolDetails.token1LiquidityAmount,
    };
  }, [poolDetails, token0Price, token1Price, token0, token1]);
}
