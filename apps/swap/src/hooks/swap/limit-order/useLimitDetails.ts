import { useMemo } from "react";
import { isNullArgs, BigNumber, formatTokenAmount, parseTokenAmount } from "@icpswap/utils";
import { Position, tickToPrice, CurrencyAmount } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface UseLimitDetailsProps {
  position: Position | Null;
  tickLimit: bigint;
}

export function useLimitDetails({ position, tickLimit }: UseLimitDetailsProps) {
  const { mintAmounts, pool } = position ?? {};
  const { token0, token1 } = pool ?? {};
  const { amount0: __amount0, amount1: __amount1 } = mintAmounts ?? {};
  const amount0 = __amount0 && token0 ? parseTokenAmount(__amount0.toString(), token0.decimals).toString() : undefined;
  const amount1 = __amount1 && token1 ? parseTokenAmount(__amount1.toString(), token1.decimals).toString() : undefined;

  return useMemo(() => {
    if (isNullArgs(amount0) || isNullArgs(amount1) || isNullArgs(token0) || isNullArgs(token1) || isNullArgs(position))
      return {};

    const inputToken = new BigNumber(amount0.toString()).isEqualTo(0) ? token1 : token0;
    const outputToken = inputToken.address === token0.address ? token1 : token0;
    const inputAmount = new BigNumber(amount0.toString()).isEqualTo(0) ? amount1 : amount0;

    const baseToken = inputToken;
    const quoteToken = outputToken;

    const priceTick = Number(tickLimit);
    const limitPrice = tickToPrice(baseToken, quoteToken, priceTick);
    const currentPrice = position.pool.priceOf(baseToken);

    const outputAmount = CurrencyAmount.fromRawAmount(
      outputToken,
      formatTokenAmount(
        new BigNumber(limitPrice.toFixed()).multipliedBy(inputAmount.toString()).toFixed(outputToken.decimals),
        outputToken.decimals,
      ).toString(),
    );

    return { inputToken, outputToken, inputAmount, outputAmount, limitPrice, currentPrice };
  }, [token0, token1, amount0, amount1, position, tickLimit]);
}
