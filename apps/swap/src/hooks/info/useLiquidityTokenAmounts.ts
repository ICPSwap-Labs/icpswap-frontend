import { useSwapUserPositionWithAmount, useInfoPoolDetails } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useMemo } from "react";

// if position is less than or equal to 20, use the token amounts directly from positions
// if position is more than 20, use the pool details to calculate the token amounts
const LIMIT_PER_REQUEST = 21;

export function useLiquidityTokenAmountsForInfoPoolTvl({
  poolId,
  token0,
  token1,
}: {
  poolId: string | Null;
  token0: Token | Null;
  token1: Token | Null;
}) {
  const { result: positionsResult } = useSwapUserPositionWithAmount(poolId, 0, LIMIT_PER_REQUEST);
  const { result: poolDetails } = useInfoPoolDetails({ poolId });

  return useMemo(() => {
    if (
      isUndefinedOrNull(positionsResult) ||
      isUndefinedOrNull(poolDetails) ||
      isUndefinedOrNull(token0) ||
      isUndefinedOrNull(token1)
    )
      return {};

    const positions = positionsResult.content;

    if (positions.length < LIMIT_PER_REQUEST) {
      const totalToken0Amount = positions.reduce((acc, position) => acc + position.token0Amount, BigInt(0));
      const totalToken1Amount = positions.reduce((acc, position) => acc + position.token1Amount, BigInt(0));

      return {
        parsedToken0Amount: parseTokenAmount(totalToken0Amount, token0.decimals).toString(),
        parsedToken1Amount: parseTokenAmount(totalToken1Amount, token1.decimals).toString(),
      };
    }

    return {
      parsedToken0Amount: poolDetails.token0LiquidityAmount,
      parsedToken1Amount: poolDetails.token1LiquidityAmount,
    };
  }, [positionsResult, poolDetails, token0, token1]);
}
