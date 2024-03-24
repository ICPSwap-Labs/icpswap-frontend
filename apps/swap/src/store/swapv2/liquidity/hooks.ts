import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import {
  updateUserPositions,
  updateFiled,
  updateLeftRange,
  updateRightRange,
  updateStartPrice,
  updateFullRange,
  resetMintState,
} from "./actions";
import { Bound, BIG_INT_ZERO, FIELD } from "constants/swap";
import { resultFormat } from "@icpswap/utils";
import {
  Token,
  FeeAmount,
  TickMath,
  tickToPrice,
  TICK_SPACINGS,
  priceToClosestTick,
  encodeSqrtRatioX96,
  Pool,
  Position,
  Currency,
  Rounding,
  Price,
  CurrencyAmount,
  nearestUsableTick,
} from "@icpswap/swap-sdk";
import { tryParseTick } from "utils/swap/mint";
import { tryParseAmount } from "utils/swap";
import { getTickToPrice } from "utils/swap/getTickToPrice";
import { usePool, PoolState } from "hooks/swap/v2/usePools";
import { JSBI } from "utils/index";
import { useUserTokens, useUserV1Tokens, useUserInvalidTokens } from "hooks/swap/v2/useSwapCalls";
import { swapPositionManager, swapFactory, swapPositionManagerV1, swapFactoryV1 } from "actor/swapV2";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { maxAmountSpend } from "utils/swap/maxAmountSpend";
import { t } from "@lingui/macro";
import { PositionResult, UserPosition } from "types/swapv2";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUpdatePoolTokenStandardCallback } from "hooks/swap/v2/index";
import { DISABLE_ADD_LIQUIDITY_IDS } from "constants/v2";

export function useUserV1Positions() {
  const [loading, setLoading] = useState(true);
  const updateTokenStandard = useUpdatePoolTokenStandardCallback();
  const { result: tokenIds } = useUserV1Tokens();

  const [positions, setPositions] = useState<(UserPosition | undefined)[]>([]);

  useEffect(() => {
    setLoading(true);

    if (tokenIds && tokenIds.length > 0) {
      let positions: (PositionResult | undefined)[] = [];
      let done = 0;

      // @ts-ignore
      function trigger() {
        if (done === tokenIds?.length) {
          let positionsWithTokenIds: (UserPosition | undefined)[] = [];

          positions.forEach((position, index) => {
            if (position) {
              positionsWithTokenIds.push({
                ...position,
                id: tokenIds[index],
              });
            }
          });

          setPositions(positionsWithTokenIds);

          setLoading(false);
        }
      }

      tokenIds.forEach(async (tokenId, index) => {
        (await swapPositionManagerV1())
          .positions(tokenId)
          .then(async (result: any) => {
            const pool = resultFormat<PositionResult>(result).data;
            if (pool) {
              const poolId = await (
                await swapFactoryV1()
              ).getPool(`${pool?.token0}_${pool?.token1}_${String(pool?.fee)}`);
              await updateTokenStandard(poolId, pool.token0);
              await updateTokenStandard(poolId, pool.token1);
            }
            positions[index] = pool;
            done++;
            trigger();
          })
          .catch((err: Error) => {
            done++;
            trigger();
            positions[index] = undefined;
            console.error(err);
          });
      });
    } else {
      setLoading(false);
      setPositions([]);
    }
  }, [tokenIds, setLoading]);

  return useMemo(
    () => ({
      loading: loading,
      result: positions,
    }),
    [loading, positions],
  );
}

export function useQueryUserPositions() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const updateTokenStandard = useUpdatePoolTokenStandardCallback();
  const { result: tokenIds } = useUserTokens();

  useEffect(() => {
    setLoading(true);

    if (tokenIds && tokenIds.length > 0) {
      let positions: (PositionResult | undefined)[] = [];
      let done = 0;

      // @ts-ignore
      function trigger() {
        if (done === tokenIds?.length) {
          let positionsWithTokenIds: (UserPosition | undefined)[] = [];

          positions.forEach((position, index) => {
            if (position) {
              positionsWithTokenIds.push({
                ...position,
                id: tokenIds[index],
              });
            }
          });

          dispatch(updateUserPositions(positionsWithTokenIds));
          setLoading(false);
        }
      }

      tokenIds.forEach(async (tokenId, index) => {
        (await swapPositionManager())
          .positions(tokenId)
          .then(async (result: any) => {
            const pool = resultFormat<PositionResult>(result).data;

            if (pool) {
              const poolId = await (
                await swapFactory()
              ).getPool(`${pool?.token0}_${pool?.token1}_${String(pool?.fee)}`);

              await updateTokenStandard(poolId, pool.token0);
              await updateTokenStandard(poolId, pool.token1);
            }

            positions[index] = pool;
            done++;
            trigger();
          })
          .catch((err: Error) => {
            done++;
            trigger();
            positions[index] = undefined;
            console.error(err);
          });
      });
    } else {
      setLoading(false);
      dispatch(updateUserPositions([]));
    }
  }, [dispatch, tokenIds, setLoading]);

  return loading;
}

export function useUserInvalidPositions() {
  const [positions, setPositions] = useState<(UserPosition | undefined)[]>([]);
  const [loading, setLoading] = useState(false);

  const { result: tokenIds, loading: loading1 } = useUserInvalidTokens();

  useEffect(() => {
    if (tokenIds?.length) {
      setLoading(true);

      let positions: (PositionResult | undefined)[] = [];
      let done = 0;

      // @ts-ignore
      function trigger() {
        if (done === tokenIds?.length) {
          let positionsWithTokenIds: (UserPosition | undefined)[] = [];

          positions.forEach((position, index) => {
            if (position) {
              positionsWithTokenIds.push({
                ...position,
                id: tokenIds[index],
              });
            }
          });

          setPositions(positionsWithTokenIds);

          setLoading(false);
        }
      }

      tokenIds.forEach(async (tokenId, index) => {
        (await swapPositionManager())
          .invalidPositions(tokenId)
          .then((result: any) => {
            positions[index] = resultFormat<PositionResult>(result).data;
            done++;
            trigger();
          })
          .catch((err: Error) => {
            done++;
            trigger();
            positions[index] = undefined;
            console.error(err);
          });
      });
    }
  }, [tokenIds]);

  return useMemo(
    () => ({
      loading: loading || loading1,
      positions,
    }),
    [loading, loading1, positions],
  );
}

export function useUserPositions() {
  return useAppSelector((state) => state.swapV2Liquidity.userPositions);
}

export function useMintState() {
  return useAppSelector((state) => state.swapV2Liquidity);
}

export function useResetMintState() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(resetMintState());
  }, [dispatch]);
}

export function useMintInfo(
  currencyA: Token | undefined,
  currencyB: Token | undefined,
  feeAmount: FeeAmount | undefined,
  baseCurrency: Currency | undefined,
  existingPosition?: Position,
  inverted?: boolean | undefined,
) {
  const {
    independentField,
    typedValue,
    leftRangeValue: leftRangeTypedValue,
    rightRangeValue: rightRangeTypedValue,
    startPrice,
  } = useMintState();

  const dependentField = independentField === FIELD.CURRENCY_A ? FIELD.CURRENCY_B : FIELD.CURRENCY_A;

  const [tokenA, tokenB, baseToken] = useMemo(
    () => [currencyA?.wrapped, currencyB?.wrapped, baseCurrency?.wrapped],
    [currencyA, currencyB, baseCurrency],
  );

  const currencies = useMemo(
    () => ({
      [FIELD.CURRENCY_A]: currencyA,
      [FIELD.CURRENCY_B]: currencyB,
    }),
    [currencyA, currencyB],
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB ? (tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]) : [undefined, undefined],
    [tokenA, tokenB],
  );

  const principal = useAccountPrincipal();
  const { result: tokenABalance } = useCurrencyBalance(principal, tokenA);
  const { result: tokenBBalance } = useCurrencyBalance(principal, tokenB);

  const currencyBalances = {
    [FIELD.CURRENCY_A]: tokenABalance,
    [FIELD.CURRENCY_B]: tokenBBalance,
  };

  const [poolState, pool] = usePool(currencies[FIELD.CURRENCY_A], currencies[FIELD.CURRENCY_B], feeAmount);

  const noLiquidity = poolState === PoolState.NOT_EXISTS;
  const poolLoading = poolState === PoolState.LOADING;

  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0));

  const price = useMemo(() => {
    if (noLiquidity) {
      const parsedQuoteAmount = tryParseAmount(startPrice || "0.1", invertPrice ? token0 : token1);
      if (parsedQuoteAmount && token0 && token1) {
        const baseAmount = tryParseAmount("1", invertPrice ? token1 : token0);

        const price =
          baseAmount && parsedQuoteAmount
            ? new Price(
                baseAmount.currency,
                parsedQuoteAmount.currency,
                baseAmount.quotient,
                parsedQuoteAmount.quotient,
              )
            : undefined;

        return (invertPrice ? price?.invert() : price) ?? undefined;
      }
      return undefined;
    } else {
      // get the amount of quote currency
      return pool && token0 ? pool.priceOf(token0) : undefined;
    }
  }, [noLiquidity, startPrice, invertPrice, token1, token0, pool]);

  const invalidPrice = useMemo(() => {
    const sqrtRatioX96 = price ? encodeSqrtRatioX96(price.numerator, price.denominator) : undefined;
    const invalid =
      price &&
      sqrtRatioX96 &&
      !(
        JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) &&
        JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)
      );
    return invalid;
  }, [price]);

  const mockPool = useMemo(() => {
    if (tokenA && tokenB && feeAmount && price && !invalidPrice) {
      const currentTick = priceToClosestTick(price);
      const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);

      return new Pool("", tokenA, tokenB, feeAmount, currentSqrt, JSBI.BigInt(0), currentTick, []);
    } else {
      return undefined;
    }
  }, [feeAmount, invalidPrice, price, tokenA, tokenB]);

  const poolForPosition = pool ?? mockPool;

  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]) : undefined,
      [Bound.UPPER]: feeAmount ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]) : undefined,
    }),
    [feeAmount],
  );

  const ticks = useMemo(() => {
    return {
      [Bound.LOWER]:
        typeof existingPosition?.tickLower === "number"
          ? existingPosition.tickLower
          : (invertPrice && typeof rightRangeTypedValue === "boolean") ||
            (!invertPrice && typeof leftRangeTypedValue === "boolean")
          ? tickSpaceLimits[Bound.LOWER]
          : invertPrice
          ? tryParseTick(token1, token0, feeAmount, rightRangeTypedValue.toString())
          : tryParseTick(token0, token1, feeAmount, leftRangeTypedValue.toString()),
      [Bound.UPPER]:
        typeof existingPosition?.tickUpper === "number"
          ? existingPosition.tickUpper
          : (!invertPrice && typeof rightRangeTypedValue === "boolean") ||
            (invertPrice && typeof leftRangeTypedValue === "boolean")
          ? tickSpaceLimits[Bound.UPPER]
          : invertPrice
          ? tryParseTick(token1, token0, feeAmount, leftRangeTypedValue.toString())
          : tryParseTick(token0, token1, feeAmount, rightRangeTypedValue.toString()),
    };
  }, [
    existingPosition,
    feeAmount,
    invertPrice,
    leftRangeTypedValue,
    rightRangeTypedValue,
    token0,
    token1,
    tickSpaceLimits,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  const _ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount && tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: feeAmount && tickUpper === tickSpaceLimits.UPPER,
    }),
    [tickSpaceLimits, tickLower, tickUpper, feeAmount],
  );

  const ticksAtLimit = useMemo(() => {
    if (!inverted) return _ticksAtLimit;

    return {
      [Bound.LOWER]: _ticksAtLimit[Bound.UPPER] ? true : undefined,
      [Bound.UPPER]: _ticksAtLimit[Bound.LOWER] ? true : undefined,
    };
  }, [_ticksAtLimit, inverted]);

  const invalidRange = Boolean(
    typeof tickLower === "number" && typeof tickUpper === "number" && tickLower >= tickUpper,
  );

  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, ticks[Bound.LOWER]),
      [Bound.UPPER]: getTickToPrice(token0, token1, ticks[Bound.UPPER]),
    };
  }, [token0, token1, ticks]);
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } = pricesAtTicks;

  const outOfRange = Boolean(
    !invalidRange && price && lowerPrice && upperPrice && (price.lessThan(lowerPrice) || price.greaterThan(upperPrice)),
  );

  const independentAmount = tryParseAmount(typedValue, currencies[independentField]);

  const dependentAmount = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency = dependentField === FIELD.CURRENCY_B ? currencyB : currencyA;
    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      poolForPosition
    ) {
      if (outOfRange || invalidRange) {
        return undefined;
      }

      const position = wrappedIndependentAmount.currency.equals(poolForPosition.token0)
        ? Position.fromAmount0({
            pool: poolForPosition,
            tickLower,
            tickUpper,
            amount0: independentAmount.quotient,
            useFullPrecision: true,
          })
        : Position.fromAmount1({
            pool: poolForPosition,
            tickLower,
            tickUpper,
            amount1: independentAmount.quotient,
          });

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(poolForPosition.token0)
        ? position.amount1
        : position.amount0;
      return dependentCurrency && CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient);
    }

    return undefined;
  }, [
    independentAmount,
    outOfRange,
    dependentField,
    currencyB,
    currencyA,
    tickLower,
    tickUpper,
    poolForPosition,
    invalidRange,
  ]);

  const parsedAmounts = useMemo(() => {
    return {
      [FIELD.CURRENCY_A]: independentField === FIELD.CURRENCY_A ? independentAmount : dependentAmount,
      [FIELD.CURRENCY_B]: independentField === FIELD.CURRENCY_A ? dependentAmount : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  const deposit0Disabled = Boolean(
    typeof tickUpper === "number" && poolForPosition && poolForPosition.tickCurrent >= tickUpper,
  );

  const deposit1Disabled = Boolean(
    typeof tickLower === "number" && poolForPosition && poolForPosition.tickCurrent <= tickLower,
  );

  const depositADisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled && poolForPosition && tokenA && poolForPosition.token0.equals(tokenA)) ||
        (deposit1Disabled && poolForPosition && tokenA && poolForPosition.token1.equals(tokenA)),
    );

  const depositBDisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled && poolForPosition && tokenB && poolForPosition.token0.equals(tokenB)) ||
        (deposit1Disabled && poolForPosition && tokenB && poolForPosition.token1.equals(tokenB)),
    );

  const position = useMemo(() => {
    if (
      !poolForPosition ||
      !tokenA ||
      !tokenB ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      invalidRange
    ) {
      return undefined;
    }

    // mark as 0 if disabled because out of range
    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[tokenA.equals(poolForPosition.token0) ? FIELD.CURRENCY_A : FIELD.CURRENCY_B]?.quotient
      : BIG_INT_ZERO;
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[tokenA.equals(poolForPosition.token0) ? FIELD.CURRENCY_B : FIELD.CURRENCY_A]?.quotient
      : BIG_INT_ZERO;

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool: poolForPosition,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true, // we want full precision for the theoretical position
      });
    } else {
      return undefined;
    }
  }, [
    parsedAmounts,
    poolForPosition,
    tokenA,
    tokenB,
    deposit0Disabled,
    deposit1Disabled,
    invalidRange,
    tickLower,
    tickUpper,
  ]);

  const maxAmounts: { [field in FIELD]?: CurrencyAmount<Currency> } = [FIELD.CURRENCY_A, FIELD.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      };
    },
    {},
  );

  const atMaxAmounts: { [field in FIELD]?: CurrencyAmount<Currency> } = [FIELD.CURRENCY_A, FIELD.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
      };
    },
    {},
  );

  let errorMessage: string | undefined = undefined;

  if (poolState === PoolState.INVALID) {
    errorMessage = errorMessage ?? t`Invalid pair`;
  }

  if (noLiquidity) {
    errorMessage = t`Please add liquidity in ICPSwap V3`;
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? t`Invalid price input`;
  }

  if (invalidRange) {
    errorMessage = errorMessage ?? t`Invalid Range`;
  }

  if (
    (!parsedAmounts[FIELD.CURRENCY_A] && !depositADisabled) ||
    (!parsedAmounts[FIELD.CURRENCY_B] && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? t`Enter an amount`;
  }

  const { [FIELD.CURRENCY_A]: currencyAAmount, [FIELD.CURRENCY_B]: currencyBAmount } = parsedAmounts;

  if (currencyAAmount && currencyBalances?.[FIELD.CURRENCY_A]?.lessThan(currencyAAmount)) {
    errorMessage = `Insufficient ${currencies[FIELD.CURRENCY_A]?.symbol} balance`;
  }

  if (currencyBAmount && currencyBalances?.[FIELD.CURRENCY_B]?.lessThan(currencyBAmount)) {
    errorMessage = `Insufficient ${currencies[FIELD.CURRENCY_B]?.symbol} balance`;
  }

  if (DISABLE_ADD_LIQUIDITY_IDS.includes(pool?.id ?? "")) {
    errorMessage = t`Please add liquidity in ICPSwap V3`;
  }

  return {
    ticks,
    pricesAtTicks,
    invalidRange,
    outOfRange,
    invalidPrice,
    parsedAmounts,
    dependentField,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
    errorMessage,
    position,
    price,
    invertPrice,
    pool,
    noLiquidity,
    currencyBalances,
    atMaxAmounts,
    maxAmounts,
    poolLoading,
  };
}

export function useMintHandlers(noLiquidity: boolean) {
  const dispatch = useAppDispatch();

  const onFieldAInput = useCallback(
    (value: string) => {
      dispatch(
        updateFiled({
          field: FIELD.CURRENCY_A,
          typedValue: value,
        }),
      );
    },
    [dispatch, noLiquidity],
  );

  const onFieldBInput = useCallback(
    (value: string) => {
      dispatch(
        updateFiled({
          field: FIELD.CURRENCY_B,
          typedValue: value,
        }),
      );
    },
    [dispatch, noLiquidity],
  );

  const onLeftRangeInput = useCallback(
    (value) => {
      dispatch(updateLeftRange(value));
    },
    [dispatch],
  );

  const onRightRangeInput = useCallback(
    (value) => {
      dispatch(updateRightRange(value));
    },
    [dispatch],
  );

  const onStartPriceInput = useCallback(
    (value) => {
      dispatch(updateStartPrice(value));
    },
    [dispatch],
  );

  return {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  };
}

export function useRangeCallbacks(
  baseCurrency: Currency | undefined,
  quoteCurrency: Currency | undefined,
  feeAmount: FeeAmount,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  pool: Pool | undefined | null,
) {
  const dispatch = useAppDispatch();

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency]);
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency]);

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickLower - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === "number") && baseToken && quoteToken && feeAmount && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickLower + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === "number") && baseToken && quoteToken && feeAmount && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickUpper - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === "number") && baseToken && quoteToken && feeAmount && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent - TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(baseToken, quoteToken, tickUpper + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === "number") && baseToken && quoteToken && feeAmount && pool) {
      const newPrice = tickToPrice(baseToken, quoteToken, pool.tickCurrent + TICK_SPACINGS[feeAmount]);
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getSetFullRange = useCallback(() => {
    dispatch(updateFullRange());
  }, [dispatch]);

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  };
}
