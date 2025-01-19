import { useMemo } from "react";
import { Position } from "@icpswap/swap-sdk";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { LimitOrder, Null } from "@icpswap/types";

import { getLimitTokenAndAmount } from "./useLimitDetails";

export interface UseLimitDealRatioProps {
  position: Position | Null;
  limit: LimitOrder | Null;
}

export function useLimitDealRatio({ position, limit }: UseLimitDealRatioProps) {
  return useMemo(() => {
    if (isNullArgs(limit) || isNullArgs(position)) return null;

    const { inputAmount, inputDealAmount } = getLimitTokenAndAmount({ position, limit });

    return new BigNumber(inputDealAmount.toExact()).dividedBy(inputAmount.toExact()).toString();
  }, [limit, position]);
}
