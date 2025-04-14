import { useMemo } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useToken } from "hooks/index";
import { PublicPoolOverView } from "@icpswap/types";

export interface UsePoolTokenBalanceTvlProps {
  pool: PublicPoolOverView | undefined;
}

export function usePoolTokenBalanceTvl({ pool }: UsePoolTokenBalanceTvlProps) {
  const [, token0] = useToken(pool?.token0Id);
  const [, token1] = useToken(pool?.token1Id);

  const { result: poolTVLToken0 } = useTokenBalance(pool?.token0Id, pool?.pool);
  const { result: poolTVLToken1 } = useTokenBalance(pool?.token1Id, pool?.pool);

  const token0Price = useUSDPriceById(pool?.token0Id);
  const token1Price = useUSDPriceById(pool?.token1Id);

  return useMemo(() => {
    if (!poolTVLToken0 || !poolTVLToken1 || !token0Price || !token1Price || !token0 || !token1) return {};

    const token0TvlUSD = parseTokenAmount(poolTVLToken0, token0.decimals).multipliedBy(token0Price);
    const token1TvlUSD = parseTokenAmount(poolTVLToken1, token1.decimals).multipliedBy(token1Price);

    return {
      poolTvlUSD: token0TvlUSD.plus(token1TvlUSD).toString(),
      token0TvlUSD: token0TvlUSD.toString(),
      token1TvlUSD: token1TvlUSD.toString(),
      token0Balance: poolTVLToken0,
      token1Balance: poolTVLToken1,
    };
  }, [poolTVLToken0, poolTVLToken1, token0Price, token1Price, token0, token1]);
}
