import { useMemo } from "react";
import { Position } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { LimitOrder, Null } from "@icpswap/types";
import { useLimitTokenAndAmount } from "./useLimitDetails";

export interface UseLimitDealRatioProps {
  position: Position | Null;
  limit: LimitOrder | Null;
}

export function useLimitDealRatio({ position, limit }: UseLimitDealRatioProps) {
  const { inputAmount, inputToken } = useLimitTokenAndAmount({ limit, position });

  return useMemo(() => {
    if (isNullArgs(limit) || isNullArgs(position) || isNullArgs(inputToken) || isNullArgs(inputAmount)) return null;

    const token0Amount = position.amount0.toExact();
    const token1Amount = position.amount1.toExact();

    const inputAmountNow = position.amount0.currency.address === inputToken.address ? token0Amount : token1Amount;
    const dealAmount = new BigNumber(inputAmount.toExact()).minus(inputAmountNow);

    return new BigNumber(dealAmount).dividedBy(inputAmount.toExact()).toString();
  }, [limit, position]);
}
