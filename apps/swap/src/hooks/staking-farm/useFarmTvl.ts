import { useMemo } from "react";
import { useFarmTVL } from "@icpswap/hooks";
import { useICPPrice } from "store/global/hooks";
import { isNullArgs, parseTokenAmount } from "@icpswap/utils";
import { useToken, useUSDPrice } from "hooks/index";

export function useFarmTvl(farmId: string) {
  const icpPrice = useICPPrice();

  const { result: farmTvl } = useFarmTVL(farmId);

  const [, token0] = useToken(farmTvl?.poolToken0.address);
  const [, token1] = useToken(farmTvl?.poolToken1.address);

  const token0Price = useUSDPrice(token0);
  const token1Price = useUSDPrice(token1);

  const tvl = useMemo(() => {
    if (!farmTvl || !icpPrice || !token0 || !token1 || isNullArgs(token0Price) || isNullArgs(token1Price))
      return undefined;

    const { poolToken0, poolToken1 } = farmTvl;

    if (!token0Price || !token1Price) return undefined;

    const token0Tvl = parseTokenAmount(poolToken0.amount, token0.decimals).multipliedBy(token0Price);
    const token1Tvl = parseTokenAmount(poolToken1.amount, token1.decimals).multipliedBy(token1Price);

    return token0Tvl.plus(token1Tvl).toFixed(3);
  }, [farmTvl, icpPrice, token0Price, token1Price, token0, token1]);

  return useMemo(
    () => ({
      tvl,
    }),
    [tvl],
  );
}
