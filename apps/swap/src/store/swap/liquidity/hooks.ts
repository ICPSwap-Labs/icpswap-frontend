import { useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { Bound, FIELD } from "constants/swap";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import {
  Price,
  CurrencyAmount,
  Rounding,
  nearestUsableTick,
  TickMath,
  tickToPrice,
  TICK_SPACINGS,
  encodeSqrtRatioX96,
  priceToClosestTick,
  Pool,
  Position,
  Token,
  FeeAmount,
} from "@icpswap/swap-sdk";
import { getTickToPrice } from "utils/swap/getTickToPrice";
import { usePool, PoolState, useTokensHasPairWithBaseToken } from "hooks/swap/usePools";
import { JSBI, tryParseAmount, inputNumberCheck, tryParseTick } from "utils/index";
import { t } from "@lingui/macro";
import { useSwapPoolAvailable } from "hooks/swap/v3Calls";
import { getTokenStandard } from "store/token/cache/hooks";
import { BigNumber, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import { getTokenInsufficient, useAllBalanceMaxSpend } from "hooks/swap/index";
import { useTokenAllBalance } from "hooks/liquidity/index";

import {
  updateFiled,
  updateLeftRange,
  updateRightRange,
  updateStartPrice,
  updateFullRange,
  resetMintState,
} from "./actions";

export function useMintState() {
  return useAppSelector((state) => state.swapLiquidity);
}

export function useResetMintState() {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(resetMintState());
  }, [dispatch]);
}

const VALID_TOKEN_STANDARDS_CREATE_POOL: any[] = [TOKEN_STANDARD.ICRC1, TOKEN_STANDARD.ICRC2];

export function useMintInfo(
  tokenA: Token | undefined,
  tokenB: Token | undefined,
  feeAmount: FeeAmount | undefined,
  baseCurrency: Token | undefined,
  existingPosition?: Position,
  inverted?: boolean | undefined,
  refresh?: number,
) {
  const {
    independentField,
    typedValue,
    leftRangeValue: leftRangeTypedValue,
    rightRangeValue: rightRangeTypedValue,
    startPrice,
  } = useMintState();

  const dependentField = independentField === FIELD.CURRENCY_A ? FIELD.CURRENCY_B : FIELD.CURRENCY_A;

  const baseToken = baseCurrency?.wrapped;

  const currencies = useMemo(
    () => ({
      [FIELD.CURRENCY_A]: tokenA,
      [FIELD.CURRENCY_B]: tokenB,
    }),
    [tokenA, tokenB],
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB ? (tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]) : [undefined, undefined],
    [tokenA, tokenB],
  );

  const tokens = useMemo(() => (tokenA && tokenB ? [tokenA.address, tokenB.address] : undefined), [tokenA, tokenB]);
  const [poolState, pool] = usePool(tokenA, tokenB, feeAmount);
  const { poolId } = useMemo(() => {
    if (!pool) return {};

    return {
      poolId: pool.id,
    };
  }, [pool, poolState]);

  const hasPairWithBaseToken = useTokensHasPairWithBaseToken(tokens);

  const { token0Balance, token1Balance, token0SubAccountBalance, token1SubAccountBalance, unusedBalance } =
    useTokenAllBalance({
      token0,
      token1,
      poolId,
      refresh,
    });

  const __currencyBalances = {
    [FIELD.CURRENCY_A]: tokenA?.address === token0?.address ? token0Balance : token1Balance,
    [FIELD.CURRENCY_B]: tokenB?.address === token0?.address ? token0Balance : token1Balance,
  };

  const currencyBalances = {
    [FIELD.CURRENCY_A]:
      tokenA && __currencyBalances[FIELD.CURRENCY_A]
        ? CurrencyAmount.fromRawAmount(tokenA, __currencyBalances[FIELD.CURRENCY_A].toString())
        : undefined,
    [FIELD.CURRENCY_B]:
      tokenB && __currencyBalances[FIELD.CURRENCY_B]
        ? CurrencyAmount.fromRawAmount(tokenB, __currencyBalances[FIELD.CURRENCY_B].toString())
        : undefined,
  };

  const noLiquidity = poolState === PoolState.NOT_EXISTS;
  const poolLoading = poolState === PoolState.LOADING;

  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0));

  const available = useSwapPoolAvailable(poolId);

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
    }
    return pool && token0 ? pool.priceOf(token0) : undefined;
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
    }

    return undefined;
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
            (!invertPrice && typeof leftRangeTypedValue === "boolean") ||
            // if no liquidity, full range by default
            (noLiquidity &&
              ((invertPrice && rightRangeTypedValue === "") || (!invertPrice && leftRangeTypedValue === "")))
          ? tickSpaceLimits[Bound.LOWER]
          : invertPrice
          ? tryParseTick(token1, token0, feeAmount, rightRangeTypedValue.toString())
          : tryParseTick(token0, token1, feeAmount, leftRangeTypedValue.toString()),
      [Bound.UPPER]:
        typeof existingPosition?.tickUpper === "number"
          ? existingPosition.tickUpper
          : (!invertPrice && typeof rightRangeTypedValue === "boolean") ||
            (invertPrice && typeof leftRangeTypedValue === "boolean") ||
            // if no liquidity, full range by default
            (noLiquidity &&
              ((!invertPrice && rightRangeTypedValue === "") || (invertPrice && leftRangeTypedValue === "")))
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
    noLiquidity,
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
    const dependentCurrency = dependentField === FIELD.CURRENCY_B ? tokenB : tokenA;

    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      poolForPosition
    ) {
      if (outOfRange || invalidRange) return undefined;

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
    tokenB,
    tokenA,
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

    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[tokenA.equals(poolForPosition.token0) ? FIELD.CURRENCY_A : FIELD.CURRENCY_B]?.quotient
      : JSBI.BigInt(0);
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[tokenA.equals(poolForPosition.token0) ? FIELD.CURRENCY_B : FIELD.CURRENCY_A]?.quotient
      : JSBI.BigInt(0);

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool: poolForPosition,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true,
      });
    }

    return undefined;
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

  const currencyAMaxSpentAmount = useAllBalanceMaxSpend({
    token: tokenA,
    balance: tokenA?.address === token0?.address ? token0Balance?.toString() : token1Balance?.toString(),
    poolId,
    subBalance: tokenA?.address === token0?.address ? token0SubAccountBalance : token1SubAccountBalance,
    unusedBalance: tokenA?.address === token0?.address ? unusedBalance.balance0 : unusedBalance.balance1,
  });

  const currencyBMaxSpentAmount = useAllBalanceMaxSpend({
    token: tokenB,
    balance: tokenB?.address === token0?.address ? token0Balance?.toString() : token1Balance?.toString(),
    poolId,
    subBalance: tokenB?.address === token0?.address ? token0SubAccountBalance : token1SubAccountBalance,
    unusedBalance: tokenB?.address === token0?.address ? unusedBalance.balance0 : unusedBalance.balance1,
  });

  const maxAmounts = useMemo(() => {
    if (!currencyAMaxSpentAmount || !currencyBMaxSpentAmount) return {};

    return {
      [FIELD.CURRENCY_A]: currencyAMaxSpentAmount,
      [FIELD.CURRENCY_B]: currencyBMaxSpentAmount,
    };
  }, [currencyAMaxSpentAmount, currencyBMaxSpentAmount]);

  const atMaxAmounts: { [field in FIELD]?: CurrencyAmount<Token> } = [FIELD.CURRENCY_A, FIELD.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]:
          maxAmounts[field] && parsedAmounts[field] ? maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0") : false,
      };
    },
    {},
  );

  const { [FIELD.CURRENCY_A]: currencyAAmount, [FIELD.CURRENCY_B]: currencyBAmount } = parsedAmounts;

  const token0Insufficient = getTokenInsufficient({
    token: token0,
    subAccountBalance: token0SubAccountBalance,
    balance: token0Balance,
    unusedBalance: unusedBalance?.balance0,
    formatTokenAmount:
      token0 && tokenA
        ? token0.address === tokenA.address
          ? formatTokenAmount(currencyAAmount ? currencyAAmount.toExact() : 0, token0.decimals).toString()
          : formatTokenAmount(currencyBAmount ? currencyBAmount.toExact() : 0, token0.decimals).toString()
        : "0",
  });

  const token1Insufficient = getTokenInsufficient({
    token: token1,
    subAccountBalance: token1SubAccountBalance,
    balance: token1Balance,
    unusedBalance: unusedBalance?.balance1,
    formatTokenAmount:
      token1 && tokenA
        ? token1.address === tokenA.address
          ? formatTokenAmount(currencyAAmount ? currencyAAmount.toExact() : 0, token1.decimals).toString()
          : formatTokenAmount(currencyBAmount ? currencyBAmount.toExact() : 0, token1.decimals).toString()
        : "0",
  });

  const error = useMemo(() => {
    if (hasPairWithBaseToken !== true) return t`No pair with icp`;
    if (inputNumberCheck(typedValue) === false) return t`Amount exceeds limit`;
    if (poolState === PoolState.INVALID) return t`Invalid pair`;
    if (invalidPrice) return t`Invalid price input`;
    if (invalidRange) return t`Invalid Range`;
    if (
      (!parsedAmounts[FIELD.CURRENCY_A] && !depositADisabled) ||
      (!parsedAmounts[FIELD.CURRENCY_B] && !depositBDisabled)
    )
      return t`Enter an amount`;

    if (typeof available === "boolean" && !available) return t`This pool is not available now`;
    if (poolState === PoolState.NOT_CHECK) return t`Waiting for verify the pool...`;
    if (token0Insufficient === "INSUFFICIENT") return t`Insufficient ${token0?.symbol} balance`;
    if (token1Insufficient === "INSUFFICIENT") return t`Insufficient ${token1?.symbol} balance`;

    if (
      tokenA &&
      currencyAAmount &&
      !depositADisabled &&
      !currencyAAmount.greaterThan(CurrencyAmount.fromRawAmount(tokenA, tokenA.transFee))
    ) {
      return t`${tokenA?.symbol} amount must greater than trans fee`;
    }

    if (
      tokenB &&
      currencyBAmount &&
      !depositBDisabled &&
      !currencyBAmount.greaterThan(CurrencyAmount.fromRawAmount(tokenB.wrapped, tokenB.transFee))
    )
      return t`${tokenB?.symbol} amount must greater than trans fee`;

    if (
      (!VALID_TOKEN_STANDARDS_CREATE_POOL.includes(getTokenStandard(tokenB?.address)) ||
        !VALID_TOKEN_STANDARDS_CREATE_POOL.includes(getTokenStandard(tokenA?.address))) &&
      noLiquidity
    )
      return t`Only ICRC1 and ICRC2 support`;
  }, [
    hasPairWithBaseToken,
    typedValue,
    poolState,
    invalidPrice,
    invalidRange,
    parsedAmounts,
    depositADisabled,
    depositBDisabled,
    available,
    token0,
    token0Insufficient,
    token1,
    token1Insufficient,
    tokenA,
    currencyAAmount,
    tokenB,
    currencyBAmount,
    noLiquidity,
  ]);

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
    errorMessage: error,
    position,
    price,
    invertPrice,
    pool,
    noLiquidity,
    currencyBalances,
    atMaxAmounts,
    maxAmounts,
    poolLoading,
    unusedBalance,
    token0SubAccountBalance,
    token1SubAccountBalance,
    token0Balance,
    token1Balance,
  };
}

export function useMintHandlers() {
  const dispatch = useAppDispatch();

  const onFieldAInput = (value: string) => {
    dispatch(
      updateFiled({
        field: FIELD.CURRENCY_A,
        typedValue: value,
      }),
    );
  };

  const onFieldBInput = (value: string) => {
    dispatch(
      updateFiled({
        field: FIELD.CURRENCY_B,
        typedValue: value,
      }),
    );
  };

  const onLeftRangeInput = (value: string) => {
    dispatch(updateLeftRange(value));
  };

  const onRightRangeInput = (value: string) => {
    dispatch(updateRightRange(value));
  };

  const onStartPriceInput = (value: string) => {
    dispatch(updateStartPrice(value));
  };

  return {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  };
}

export function useRangeCallbacks(
  baseCurrency: Token | undefined,
  quoteCurrency: Token | undefined,
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

  const getRangeByPercent = useCallback(
    (value: string | number) => {
      if (isNullArgs(baseToken) || isNullArgs(pool)) return undefined;

      const basePrice = pool.priceOf(baseToken).toFixed();
      const range: [string, string] = [
        new BigNumber(basePrice).minus(new BigNumber(basePrice).multipliedBy(value).dividedBy(100)).toFixed(5),
        new BigNumber(basePrice).multipliedBy(value).dividedBy(100).plus(basePrice).toFixed(5),
      ];

      return range;
    },
    [baseToken, pool],
  );

  const getSetFullRange = useCallback(() => {
    dispatch(updateFullRange());
  }, [dispatch]);

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    getRangeByPercent,
  };
}
