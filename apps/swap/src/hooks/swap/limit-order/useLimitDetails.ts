import { useMemo } from "react";
import { isNullArgs, BigNumber, formatTokenAmount } from "@icpswap/utils";
import { Position, tickToPrice, CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { LimitOrder, Null } from "@icpswap/types";

export interface GetLimitTokenAndAmountProps {
  position: Position;
  limit: LimitOrder;
}

export function getLimitTokenAndAmount({ limit, position }: GetLimitTokenAndAmountProps): {
  inputToken: Token;
  outputToken: Token;
  inputAmount: CurrencyAmount<Token>;
  inputDealAmount: CurrencyAmount<Token>;
  inputRemainingAmount: CurrencyAmount<Token>;
  outputDealAmount: CurrencyAmount<Token>;
} {
  const { token0, token1 } = position.pool;

  const { token0InAmount, token1InAmount } = limit;

  const inputToken = new BigNumber(token0InAmount.toString()).isEqualTo(0) ? token1 : token0;
  const outputToken = inputToken.address === token0.address ? token1 : token0;

  const noInverted = inputToken.address === token0.address;

  const inputAmount = noInverted
    ? CurrencyAmount.fromRawAmount(token0, token0InAmount.toString())
    : CurrencyAmount.fromRawAmount(token1, token1InAmount.toString());

  const token0Amount = position.amount0.toExact();
  const token1Amount = position.amount1.toExact();

  const inputAmountInLiquidity = noInverted ? token0Amount : token1Amount;
  const inputDealAmount = CurrencyAmount.fromRawAmount(
    inputToken,
    formatTokenAmount(
      new BigNumber(inputAmount.toExact()).minus(inputAmountInLiquidity).toString(),
      inputToken.decimals,
    ).toString(),
  );

  const outputDealAmount = noInverted ? position.amount1 : position.amount0;

  return {
    inputToken,
    outputToken,
    inputAmount,
    inputDealAmount,
    inputRemainingAmount: inputAmount.subtract(inputDealAmount),
    outputDealAmount,
  };
}

export interface UseLimitTokenAndAmountProps {
  position: Position | Null;
  limit: LimitOrder | Null;
}

export function useLimitTokenAndAmount({ limit, position }: UseLimitTokenAndAmountProps): {
  inputToken: Token | undefined;
  outputToken: Token | undefined;
  inputAmount: CurrencyAmount<Token> | undefined;
  outputDealAmount: CurrencyAmount<Token> | undefined;
} {
  return useMemo(() => {
    if (isNullArgs(limit) || isNullArgs(position)) {
      return {
        inputToken: undefined,
        outputToken: undefined,
        inputAmount: undefined,
        outputDealAmount: undefined,
      };
    }

    return getLimitTokenAndAmount({ limit, position });
  }, [position, limit]);
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
