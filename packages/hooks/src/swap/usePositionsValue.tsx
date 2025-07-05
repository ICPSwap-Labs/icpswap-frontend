import { useMemo } from "react";
import type { Null } from "@icpswap/types";
import { Position } from "@icpswap/swap-sdk";
import { BigNumber } from "@icpswap/utils";

import { useInfoAllTokens } from "../info";

export function usePositionsValue(positions: Position[] | Null) {
  const allTokenInfos = useInfoAllTokens();

  return useMemo(() => {
    if (!allTokenInfos || !positions) return undefined;
    if (allTokenInfos.length === 0) return undefined;
    if (positions.length === 0) return "0";

    let totalValue: BigNumber | undefined;

    positions.flat().forEach((position) => {
      if (position) {
        const token0Amount = position.amount0.toExact();
        const token1Amount = position.amount1.toExact();

        const token0Price = allTokenInfos.find((info) => info.tokenLedgerId === position.pool.token0.address)?.price;
        const token1Price = allTokenInfos.find((info) => info.tokenLedgerId === position.pool.token1.address)?.price;

        if (token0Price !== undefined && token1Price !== undefined) {
          totalValue = (totalValue ?? new BigNumber(0))
            .plus(new BigNumber(token0Amount).multipliedBy(token0Price))
            .plus(new BigNumber(token1Amount).multipliedBy(token1Price));
        }
      }
    });

    return totalValue?.toString();
  }, [JSON.stringify(positions), allTokenInfos]);
}

export function usePositionValue(position: Position | undefined) {
  return usePositionsValue(position ? [position] : undefined);
}
