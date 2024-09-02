import { useMemo } from "react";
import { BigNumber } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/useUSDPrice";

export interface usePositionUSDValueProps {
  position: Position | undefined;
}

export function usePositionValue({ position }: usePositionUSDValueProps) {
  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  return useMemo(() => {
    if (!position || !token0USDPrice || !token1USDPrice) return undefined;

    const totalUSD = new BigNumber(token0USDPrice)
      .multipliedBy(position.amount0.toExact())
      .plus(new BigNumber(token1USDPrice).multipliedBy(position.amount1.toExact()));

    return totalUSD.toString();
  }, [position, token0USDPrice, token1USDPrice]);
}
