import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useToken } from "hooks/index";
import { InfoPoolRealTimeDataResponse } from "@icpswap/types";
import { useLiquidityTokenAmountsForInfoPoolTvl } from "hooks/info/useLiquidityTokenAmounts";

export interface UsePoolTokenBalanceTvlProps {
  pool: InfoPoolRealTimeDataResponse | undefined;
}

export function usePoolTokenBalanceTvl({ pool }: UsePoolTokenBalanceTvlProps) {
  const [, token0] = useToken(pool?.token0LedgerId);
  const [, token1] = useToken(pool?.token1LedgerId);

  const token0Price = useUSDPriceById(pool?.token0LedgerId);
  const token1Price = useUSDPriceById(pool?.token1LedgerId);

  const { parsedToken0Amount, parsedToken1Amount } = useLiquidityTokenAmountsForInfoPoolTvl({
    poolId: pool?.poolId,
    token0,
    token1,
  });

  return useMemo(() => {
    if (
      isUndefinedOrNull(parsedToken0Amount) ||
      isUndefinedOrNull(parsedToken1Amount) ||
      !token0Price ||
      !token1Price ||
      !token0 ||
      !token1
    )
      return {};

    const token0TvlUSD = new BigNumber(parsedToken0Amount).multipliedBy(token0Price);
    const token1TvlUSD = new BigNumber(parsedToken1Amount).multipliedBy(token1Price);

    return {
      poolTvlUSD: token0TvlUSD.plus(token1TvlUSD).toString(),
      token0TvlUSD: token0TvlUSD.toString(),
      token1TvlUSD: token1TvlUSD.toString(),
      token0Balance: parsedToken0Amount,
      token1Balance: parsedToken1Amount,
    };
  }, [parsedToken0Amount, parsedToken1Amount, token0Price, token1Price, token0, token1]);
}
