import { useMemo } from "react";
import { BigNumber, isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { useUSDPriceById } from "hooks/useUSDPrice";

export interface usePositionFeesValueProps {
  position: Position | undefined;
  feeAmount0: bigint | undefined;
  feeAmount1: bigint | undefined;
}

export function usePositionFeesValue({ position, feeAmount0, feeAmount1 }: usePositionFeesValueProps) {
  const token0USDPrice = useUSDPriceById(position?.pool.token0.address);
  const token1USDPrice = useUSDPriceById(position?.pool.token1.address);

  return useMemo(() => {
    if (
      isUndefinedOrNull(position) ||
      isUndefinedOrNull(feeAmount0) ||
      isUndefinedOrNull(feeAmount1) ||
      isUndefinedOrNull(token0USDPrice) ||
      isUndefinedOrNull(token1USDPrice)
    )
      return undefined;

    const { token0, token1 } = position.pool;

    return new BigNumber(parseTokenAmount(feeAmount0, token0.decimals))
      .multipliedBy(token0USDPrice)
      .plus(parseTokenAmount(feeAmount1, token1.decimals).multipliedBy(token1USDPrice))
      .toString();
  }, [position, token0USDPrice, token1USDPrice, feeAmount0, feeAmount1]);
}
