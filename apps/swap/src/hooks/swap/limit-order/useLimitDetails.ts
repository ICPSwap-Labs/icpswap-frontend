import { useMemo } from "react";
import { isNullArgs, BigNumber, formatTokenAmount } from "@icpswap/utils";
import { Position, tickToPrice, CurrencyAmount } from "@icpswap/swap-sdk";
import { LimitOrder, Null } from "@icpswap/types";

export interface UseLimitTokenAndAmountProps {
  position: Position | Null;
  limit: LimitOrder | Null;
}

export function useLimitTokenAndAmount({ limit, position }: UseLimitTokenAndAmountProps) {
  const { token0, token1 } = position?.pool ?? {};

  return useMemo(() => {
    if (isNullArgs(limit) || isNullArgs(token0) || isNullArgs(token1)) return {};

    const { token0InAmount, token1InAmount } = limit;

    const inputToken = new BigNumber(token0InAmount.toString()).isEqualTo(0) ? token1 : token0;
    const outputToken = inputToken.address === token0.address ? token1 : token0;
    const inputAmount =
      inputToken.address === token0.address
        ? CurrencyAmount.fromRawAmount(token0, token0InAmount.toString())
        : CurrencyAmount.fromRawAmount(token1, token1InAmount.toString());

    return { inputToken, outputToken, inputAmount };
  }, [token0, token1, position, limit]);
}

export interface UseLimitDetailsProps {
  position: Position | Null;
  tickLimit: bigint;
  limit: LimitOrder | Null;
}

export function useLimitDetails({ limit, position, tickLimit }: UseLimitDetailsProps) {
  const { inputAmount, inputToken, outputToken } = useLimitTokenAndAmount({ limit, position });

  return useMemo(() => {
    if (isNullArgs(inputAmount) || isNullArgs(inputToken) || isNullArgs(outputToken) || isNullArgs(position)) return {};

    const baseToken = inputToken;
    const quoteToken = outputToken;

    const priceTick = Number(tickLimit);
    const limitPrice = tickToPrice(baseToken, quoteToken, priceTick);
    const currentPrice = position.pool.priceOf(baseToken);

    const outputAmount = CurrencyAmount.fromRawAmount(
      outputToken,
      formatTokenAmount(
        new BigNumber(limitPrice.toFixed(outputToken.decimals))
          .multipliedBy(inputAmount.toExact())
          .toFixed(outputToken.decimals),
        outputToken.decimals,
      ).toString(),
    );

    return { inputToken, outputToken, inputAmount, outputAmount, limitPrice, currentPrice };
  }, [position, tickLimit, inputAmount, inputToken, outputToken]);
}
