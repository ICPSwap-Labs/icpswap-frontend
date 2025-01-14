import { useMemo } from "react";
import { useFarmTVL, useInfoAllTokens } from "@icpswap/hooks";
import { useICPPrice } from "store/global/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { useToken } from "hooks/index";

export function useFarmTvl(farmId: string) {
  const icpPrice = useICPPrice();

  const { result: farmTvl } = useFarmTVL(farmId);

  const [, token0] = useToken(farmTvl?.poolToken0.address);
  const [, token1] = useToken(farmTvl?.poolToken1.address);

  const infoAllTokens = useInfoAllTokens();

  const tvl = useMemo(() => {
    if (!farmTvl || !icpPrice || !token0 || !token1 || !infoAllTokens || infoAllTokens.length === 0) return undefined;

    const { poolToken0, poolToken1 } = farmTvl;

    const token0Price = infoAllTokens.find((e) => e.address === poolToken0.address)?.priceUSD;
    const token1Price = infoAllTokens.find((e) => e.address === poolToken1.address)?.priceUSD;

    if (!token0Price || !token1Price) return undefined;

    const token0Tvl = parseTokenAmount(poolToken0.amount, token0.decimals).multipliedBy(token0Price);
    const token1Tvl = parseTokenAmount(poolToken1.amount, token1.decimals).multipliedBy(token1Price);

    return token0Tvl.plus(token1Tvl).toFixed(3);
  }, [farmTvl, icpPrice, infoAllTokens, token0, token1]);

  return useMemo(
    () => ({
      tvl,
    }),
    [tvl],
  );
}
