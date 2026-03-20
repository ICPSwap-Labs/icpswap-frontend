import { useSwapPoolMetadata } from "@icpswap/hooks";
import { CurrencyAmount, Percent, Position, type Token } from "@icpswap/swap-sdk";
import { numberToString } from "@icpswap/utils";
import { BURN_FIELD } from "constants/swap";
import { usePool } from "hooks/swap/usePools";
import { useSwapPoolAvailable } from "hooks/swap/v3Calls";
import { useToken } from "hooks/useCurrency";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type { UserPosition } from "types/swap";
import { inputNumberCheck, tryParseAmount } from "utils/swap";

import { resetBurnState, updateTypedInput } from "./actions";

export function useBurnState() {
  return useAppSelector((state) => state.swapBurn);
}

export function useResetBurnState() {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    dispatch(resetBurnState());
  }, [dispatch]);
}

export function useBurnInfo(position: UserPosition | undefined | null) {
  const { t } = useTranslation();
  const { data: poolMeta } = useSwapPoolMetadata(position?.id);

  const token0Address = poolMeta?.token0.address;
  const token1Address = poolMeta?.token1.address;
  const fee = poolMeta?.fee;

  const [, token0] = useToken(token0Address) ?? undefined;
  const [, token1] = useToken(token1Address) ?? undefined;

  const [poolState, pool] = usePool(token0, token1, fee ? Number(fee) : undefined, true);

  const available = useSwapPoolAvailable(pool?.id);

  const positionSDK = useMemo(
    () =>
      pool &&
      position?.liquidity &&
      (position?.tickLower || Number(position?.tickLower) === 0) &&
      (position?.tickUpper || Number(position?.tickUpper) === 0)
        ? new Position({
            pool,
            liquidity: numberToString(position.liquidity),
            tickLower: Number(position.tickLower),
            tickUpper: Number(position.tickUpper),
          })
        : undefined,
    [pool, position],
  );

  const { independentField, typedValue } = useBurnState();

  const [tokenA, tokenB] = [token0?.wrapped, token1?.wrapped];

  const tokens: { [key in BURN_FIELD]?: Token | undefined } = {
    [BURN_FIELD.CURRENCY_A]: tokenA,
    [BURN_FIELD.CURRENCY_B]: tokenB,
  };

  const liquidityValues: { [key in BURN_FIELD]?: CurrencyAmount<Token> | undefined } = {
    [BURN_FIELD.CURRENCY_A]: positionSDK?.amount0,
    [BURN_FIELD.CURRENCY_B]: positionSDK?.amount1,
  };

  let percentToRemove = new Percent("0", "100");

  if (independentField === BURN_FIELD.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, "100");
  } else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(typedValue, tokens[independentField]);
    const liquidityValue = liquidityValues[independentField];

    if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
      percentToRemove = new Percent(independentAmount.quotient, liquidityValue.quotient);
    }
  }

  const discountedAmount0 = positionSDK ? percentToRemove.multiply(positionSDK.amount0.quotient).quotient : undefined;
  const discountedAmount1 = positionSDK ? percentToRemove.multiply(positionSDK.amount1.quotient).quotient : undefined;

  const parsedAmounts = {
    [BURN_FIELD.LIQUIDITY_PERCENT]: percentToRemove,
    [BURN_FIELD.CURRENCY_A]:
      token0 && discountedAmount0 && percentToRemove && percentToRemove.greaterThan("0")
        ? CurrencyAmount.fromRawAmount(token0, discountedAmount0)
        : undefined,
    [BURN_FIELD.CURRENCY_B]:
      token1 && discountedAmount1 && percentToRemove && percentToRemove.greaterThan("0")
        ? CurrencyAmount.fromRawAmount(token1, discountedAmount1)
        : undefined,
  };

  const outOfRange =
    pool && position ? pool.tickCurrent < position.tickLower || pool.tickCurrent > position.tickUpper : false;

  let error: string | undefined;

  if (inputNumberCheck(typedValue) === false) error = error ?? t("common.error.exceeds.limit");

  if (
    !parsedAmounts[BURN_FIELD.LIQUIDITY_PERCENT] ||
    !parsedAmounts[BURN_FIELD.CURRENCY_A] ||
    !parsedAmounts[BURN_FIELD.CURRENCY_B]
  ) {
    if (typedValue && String(typedValue) !== "0") {
      error = error ?? t("common.error.insufficient.balance");
    } else {
      error = error ?? t("common.enter.input.amount");
    }
  }

  if (typeof available === "boolean" && !available) {
    error = error ?? t("swap.pool.not.available");
  }

  return {
    poolState,
    parsedAmounts,
    error,
    outOfRange,
    currencyA: token0,
    currencyB: token1,
    position: positionSDK,
    liquidityToRemove: percentToRemove,
    liquidityValue0: parsedAmounts[BURN_FIELD.CURRENCY_A],
    liquidityValue1: parsedAmounts[BURN_FIELD.CURRENCY_B],
  };
}

export function useBurnHandlers() {
  const dispatch = useAppDispatch();

  const onUserInput = useCallback(
    (independentField: BURN_FIELD, typedValue: string) => {
      dispatch(updateTypedInput({ independentField, typedValue }));
    },
    [dispatch],
  );

  return {
    onUserInput,
  };
}
