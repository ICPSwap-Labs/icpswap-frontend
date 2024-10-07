import { useMemo } from "react";
import {
  Price,
  TICK_SPACINGS,
  priceToClosestTick,
  nearestUsableTick,
  Pool,
  Position,
  Token,
  CurrencyAmount,
} from "@icpswap/swap-sdk";
import { BigNumber, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useSwapState } from "store/swap/limit-order/hooks";

interface usePlaceOrderPositionProps {
  pool: Pool | Null;
  orderPrice: string | Null;
  inputToken: Token | Null;
}

export function usePlaceOrderPosition({ inputToken, pool, orderPrice }: usePlaceOrderPositionProps) {
  const { typedValue: inputAmount } = useSwapState();

  const { token0, token1, fee: feeAmount } = pool ?? {};

  const { orderPriceTick } = useMemo(() => {
    if (!orderPrice || !pool || !inputToken || !token0 || !token1 || new BigNumber(orderPrice).isEqualTo(0)) return {};

    const baseToken = inputToken;
    const quoteToken = baseToken.address === token0.address ? token1 : token0;

    const price = new Price({
      baseAmount: CurrencyAmount.fromRawAmount(baseToken, formatTokenAmount(1, baseToken.decimals).toString()),
      quoteAmount: CurrencyAmount.fromRawAmount(
        quoteToken,
        formatTokenAmount(orderPrice, quoteToken.decimals).toString(),
      ),
    });

    const __orderPriceTick = priceToClosestTick(price);

    const useableTick = nearestUsableTick(__orderPriceTick, pool?.tickSpacing);

    return {
      orderPriceTick: useableTick,
    };
  }, [orderPrice, inputToken, token0, token1, pool]);

  const { tickLower, tickUpper } = useMemo(() => {
    if (isNullArgs(orderPriceTick) || isNullArgs(feeAmount)) return {};

    return {
      tickLower: orderPriceTick - TICK_SPACINGS[feeAmount],
      tickUpper: orderPriceTick + TICK_SPACINGS[feeAmount],
    };
  }, [orderPriceTick, feeAmount]);

  const { amount0, amount1 } = useMemo(() => {
    if (isNullArgs(inputAmount) || isNullArgs(inputToken) || isNullArgs(token0) || isNullArgs(token1)) return {};

    const formattedAmount = formatTokenAmount(inputAmount, inputToken.decimals).toString();

    console.log("formattedAmount: ", formattedAmount);

    return {
      amount0: inputToken.equals(token0) ? formattedAmount : "0",
      amount1: inputToken.equals(token0) ? "0" : formattedAmount,
    };
  }, [inputAmount, inputToken, token0, token1]);

  return useMemo(() => {
    if (
      !pool ||
      isNullArgs(tickLower) ||
      isNullArgs(tickUpper) ||
      isNullArgs(amount0) ||
      isNullArgs(amount1) ||
      isNullArgs(orderPriceTick)
    )
      return {};

    console.log("amount0: ", amount0);
    console.log("amount1: ", amount1);
    console.log("orderPriceTick: ", orderPriceTick);
    console.log("tickLower: ", tickLower);
    console.log("tickUpper: ", tickUpper);

    const position = Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0,
      amount1,
      useFullPrecision: false,
    });

    console.log("position.amount0xxx: ", position.amount0.toFixed());
    console.log("position.amount1xxx: ", position.amount1.toFixed());

    return {
      position,
      orderPriceTick,
    };
  }, [pool, amount0, amount1, tickLower, tickUpper, orderPriceTick]);
}
