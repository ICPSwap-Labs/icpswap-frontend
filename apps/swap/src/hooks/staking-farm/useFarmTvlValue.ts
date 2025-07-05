import { useMemo } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { useInfoAllTokens, useFarmTVL } from "@icpswap/hooks";

export interface UseFarmTvlValueArgs {
  token0: Token | undefined;
  token1: Token | undefined;
  farmId: string;
}

export function useFarmTvlValue({ farmId, token0, token1 }: UseFarmTvlValueArgs) {
  const infoAllTokens = useInfoAllTokens();
  const { result: farmTvl } = useFarmTVL(farmId);

  return useMemo(() => {
    if (!farmTvl || !infoAllTokens || !token0 || !token1) return undefined;

    const { poolToken0, poolToken1 } = farmTvl;

    const token0Price = infoAllTokens.find((e) => e.tokenLedgerId === token0.address)?.price;
    const token1Price = infoAllTokens.find((e) => e.tokenLedgerId === token1.address)?.price;

    if (token0Price === undefined || token1Price === undefined) return undefined;

    const token0Tvl = parseTokenAmount(poolToken0.amount, token0.decimals).multipliedBy(token0Price);
    const token1Tvl = parseTokenAmount(poolToken1.amount, token1.decimals).multipliedBy(token1Price);

    return token0Tvl.plus(token1Tvl).toFixed(3);
  }, [farmTvl, token0, infoAllTokens, farmTvl]);
}
