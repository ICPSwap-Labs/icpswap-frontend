import { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { SWAP_FIELD } from "constants/swap";
import { useToken } from "hooks/useCurrency";
import { tryParseAmount, inputNumberCheck, isUseTransfer } from "utils/index";
import { TradeState, useBestTrade } from "hooks/swap/useTrade";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { getTokenInsufficient } from "hooks/swap/index";
import store from "store/index";
import { useUserUnusedBalance, useTokenBalance, useDebounce } from "@icpswap/hooks";
import { formatTokenAmount, isNullArgs, BigNumber, nonNullArgs } from "@icpswap/utils";
import { SubAccount } from "@dfinity/ledger-icp";
import { useAllowance } from "hooks/token";
import { useAllBalanceMaxSpend } from "hooks/swap/useMaxAmountSpend";
import { Null } from "@icpswap/types";
import { usePlaceOrderPosition } from "hooks/swap/limit-order";
import { Token, CurrencyAmount, TICK_SPACINGS, nearestUsableTick, availableTick, TickMath } from "@icpswap/swap-sdk";
import { useSwapState } from "store/swap/hooks";
import { MIN_LIMIT_ORDER_VALUE } from "constants/limit";
import { useUSDPriceById } from "hooks/index";
import { useTranslation } from "react-i18next";
import { SAFE_DECIMALS_LENGTH } from "constants/index";

import { updateSwapOutAmount, updatePlaceOrderPositionId } from "./actions";

export interface UseSwapInfoArgs {
  refresh?: number | boolean;
}

export function useLimitOrderInfo({ refresh }: UseSwapInfoArgs) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();

  const [__orderPrice, setOrderPrice] = useState<string | Null>(null);

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: inputCurrencyId,
    [SWAP_FIELD.OUTPUT]: outputCurrencyId,
  } = useSwapState();

  const [inputCurrencyState, inputToken] = useToken(inputCurrencyId);
  const [outputCurrencyState, outputToken] = useToken(outputCurrencyId);
  const inputCurrencyPrice = useUSDPriceById(inputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;
  const dependentField = independentField === SWAP_FIELD.INPUT ? SWAP_FIELD.OUTPUT : SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(principal, inputToken, refresh);
  const { result: outputCurrencyBalance } = useCurrencyBalance(principal, outputToken, refresh);

  const orderPrice = useMemo(() => {
    if (!__orderPrice || !outputToken) return undefined;
    return new BigNumber(__orderPrice).toFixed(outputToken.decimals).toString();
  }, [__orderPrice, outputToken]);

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  // The input side token amount
  const independentFieldAmount = tryParseAmount(typedValue, (isExactIn ? inputToken : outputToken) ?? undefined);

  const dependentFieldAmount = useMemo(() => {
    if (
      nonNullArgs(independentFieldAmount) &&
      nonNullArgs(orderPrice) &&
      nonNullArgs(outputToken) &&
      nonNullArgs(inputToken)
    ) {
      if (isExactIn) {
        return CurrencyAmount.fromRawAmount(
          outputToken,
          formatTokenAmount(
            new BigNumber(independentFieldAmount.toExact()).multipliedBy(orderPrice).toFixed(outputToken.decimals),
            outputToken.decimals,
          ).toString(),
        );
      }

      return CurrencyAmount.fromRawAmount(
        inputToken,
        formatTokenAmount(
          new BigNumber(independentFieldAmount.toExact()).dividedBy(orderPrice).toFixed(inputToken.decimals),
          inputToken.decimals,
        ).toString(),
      );
    }

    return undefined;
  }, [isExactIn, independentFieldAmount, orderPrice, outputToken]);

  const parsedAmounts = useMemo(
    () =>
      ({
        [independentField]: independentFieldAmount,
        [dependentField]: dependentFieldAmount,
      }) as { INPUT: CurrencyAmount<Token> | undefined; OUTPUT: CurrencyAmount<Token> | undefined },
    [independentField, independentFieldAmount],
  );

  const otherCurrency = (isExactIn ? outputToken : inputToken) ?? undefined;

  const [debouncedTypedValue] = useDebounce(
    useMemo(() => [typedValue, otherCurrency], [typedValue, otherCurrency]),
    600,
  );

  const Trade = useBestTrade(
    inputToken,
    outputToken,
    !typedValue || typedValue === "0" || debouncedTypedValue !== typedValue ? undefined : debouncedTypedValue,
  );

  const pool = useMemo(() => Trade?.pool, [Trade]);
  const poolId = useMemo(() => pool?.id, [pool]);

  const isInputTokenSorted = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(inputToken)) return null;
    return pool.token0.equals(inputToken);
  }, [pool, inputToken]);

  const atLimitedTick = useMemo(() => {
    if (isNullArgs(pool)) return false;

    const tickCurrent = pool.tickCurrent;

    return tickCurrent <= TickMath.MIN_TICK || tickCurrent >= TickMath.MAX_TICK;
  }, [pool]);

  // The position tickUpper or tickLower, boundary tick
  const { minUseableTick, error: tickError } = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(isInputTokenSorted)) return { minUseableTick: null, error: false };

    const tickCurrent = pool.tickCurrent;

    if (isInputTokenSorted) {
      const tickUpper = tickCurrent + TICK_SPACINGS[pool.fee] * 2;

      if (tickUpper < TickMath.MIN_TICK || tickUpper > TickMath.MAX_TICK) {
        return {
          minUseableTick: null,
          error: true,
        };
      }

      const useableTick = nearestUsableTick(tickUpper, TICK_SPACINGS[pool.fee]);

      if (useableTick - TICK_SPACINGS[pool.fee] * 2 <= tickCurrent) {
        const __tick = useableTick + TICK_SPACINGS[pool.fee];

        if (__tick < TickMath.MIN_TICK || __tick > TickMath.MAX_TICK) {
          return {
            minUseableTick: null,
            error: true,
          };
        }

        return { minUseableTick: __tick, error: false };
      }

      return { minUseableTick: useableTick, error: false };
    }

    const tickLower = tickCurrent - TICK_SPACINGS[pool.fee] * 2;

    if (tickLower < TickMath.MIN_TICK || tickLower > TickMath.MAX_TICK) {
      return {
        minUseableTick: null,
        error: true,
      };
    }

    const useableTick = nearestUsableTick(availableTick(tickLower), TICK_SPACINGS[pool.fee]);
    if (useableTick + TICK_SPACINGS[pool.fee] * 2 >= tickCurrent) {
      const __tick = useableTick - TICK_SPACINGS[pool.fee];

      if (__tick < TickMath.MIN_TICK || __tick > TickMath.MAX_TICK) {
        return {
          minUseableTick: null,
          error: true,
        };
      }

      return { minUseableTick: __tick, error: false };
    }

    return { minUseableTick: useableTick, error: false };
  }, [pool, isInputTokenSorted]);

  // The order price tick should be greater than or equal to this tick
  const minSettableTick = useMemo(() => {
    if (nonNullArgs(minUseableTick) && pool) {
      return isInputTokenSorted
        ? minUseableTick - parseInt(String(TICK_SPACINGS[pool.fee] / 2)) + 1
        : minUseableTick + parseInt(String(TICK_SPACINGS[pool.fee] / 2)) - 1;
    }
  }, [minUseableTick, pool, isInputTokenSorted]);

  const { position, orderPriceTick } = usePlaceOrderPosition({
    pool,
    inputToken,
    orderPrice,
    isInputTokenSorted,
    inputAmount: parsedAmounts[SWAP_FIELD.INPUT]?.toExact(),
  });

  // DIP20 not support subaccount balance
  // So useTokenBalance is 0 by default if standard is DIP20
  const { result: __inputTokenSubBalance } = useTokenBalance({
    canisterId: inputToken?.address,
    address: poolId,
    sub,
    refresh,
  });
  const { result: __outputTokenSubBalance } = useTokenBalance({
    canisterId: outputToken?.address,
    address: poolId,
    sub,
    refresh,
  });

  const inputTokenSubBalance = useMemo(() => {
    if (!principal) return undefined;
    return __inputTokenSubBalance;
  }, [__inputTokenSubBalance, principal]);

  const outputTokenSubBalance = useMemo(() => {
    if (!principal) return undefined;
    return __outputTokenSubBalance;
  }, [__outputTokenSubBalance]);

  const { result: unusedBalance } = useUserUnusedBalance(poolId, principal, refresh);
  const { inputTokenUnusedBalance, outputTokenUnusedBalance } = useMemo(() => {
    if (!poolId || !unusedBalance || !inputToken) return {};

    const pool = Trade.routes[0].pools[0];

    return {
      inputTokenUnusedBalance:
        pool.token0.address === inputToken.address ? unusedBalance.balance0 : unusedBalance.balance1,
      outputTokenUnusedBalance:
        pool.token0.address === inputToken.address ? unusedBalance.balance1 : unusedBalance.balance0,
    };
  }, [Trade, inputToken, unusedBalance]);

  const allowanceTokenId = useMemo(() => {
    if (!inputToken) return undefined;

    return isUseTransfer(inputToken) ? undefined : inputToken.address;
  }, [inputToken]);

  const { result: allowance } = useAllowance({
    canisterId: allowanceTokenId,
    owner: principal?.toString(),
    spender: poolId,
  });

  const tokenInsufficient = getTokenInsufficient({
    token: inputToken,
    subAccountBalance: inputTokenSubBalance,
    balance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputToken?.decimals),
    formatTokenAmount: formatTokenAmount(parsedAmounts[SWAP_FIELD.INPUT]?.toExact(), inputToken?.decimals).toString(),
    unusedBalance: inputTokenUnusedBalance,
    allowance,
  });

  const maxInputAmount = useAllBalanceMaxSpend({
    token: inputToken,
    balance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputToken?.decimals).toString(),
    poolId: Trade?.tradePoolId,
    subBalance: inputTokenSubBalance,
    unusedBalance: inputTokenUnusedBalance,
    allowance,
  });

  const currentPrice = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(inputToken) || isNullArgs(outputToken)) return undefined;
    if (pool.token0.address === inputToken.address) return pool.token0Price.toFixed(outputToken.decimals);
    return pool.token1Price.toFixed(inputToken.decimals);
  }, [pool, inputToken, outputToken]);

  const inputSwapAmount =
    parsedAmounts[SWAP_FIELD.INPUT] && inputToken
      ? new BigNumber(parsedAmounts[SWAP_FIELD.INPUT]?.toExact()).toFixed(
          inputToken.decimals > SAFE_DECIMALS_LENGTH ? SAFE_DECIMALS_LENGTH : inputToken.decimals,
        )
      : undefined;

  const inputError = useMemo(() => {
    if (isNullArgs(inputToken) || isNullArgs(outputToken)) return t("common.select.a.token");
    if (!parsedAmounts[SWAP_FIELD.INPUT]) return t("common.enter.input.amount");
    if (!inputSwapAmount || formatTokenAmount(inputSwapAmount, inputToken.decimals).isLessThan(inputToken.transFee))
      return t("common.error.amount.large.than.fee");
    if (tickError) return t("limit.error.invalid.tick");

    if (!inputCurrencyPrice) return t`Submit Limit Order`;

    if (
      new BigNumber(parsedAmounts[SWAP_FIELD.INPUT].toExact())
        .multipliedBy(inputCurrencyPrice)
        .isLessThan(MIN_LIMIT_ORDER_VALUE)
    )
      return t("limit.error.amount.minimum");
    if (inputNumberCheck(inputSwapAmount) === false) return t("common.error.exceeds.limit");
    if (typeof Trade.available === "boolean" && !Trade.available) return t("swap.pool.not.available");
    if (tokenInsufficient === "INSUFFICIENT") return `Insufficient ${inputToken?.symbol} balance`;
    if (isNullArgs(orderPrice) || orderPrice === "") return t`Enter the price`;
    if (new BigNumber(orderPrice).isEqualTo(0)) return t`Invalid price`;
    if (
      !inputTokenSubBalance ||
      isNullArgs(inputTokenUnusedBalance) ||
      isNullArgs(currentPrice) ||
      isNullArgs(pool) ||
      isNullArgs(orderPriceTick) ||
      isNullArgs(isInputTokenSorted) ||
      isNullArgs(minSettableTick) ||
      Trade?.noLiquidity === true ||
      isNullArgs(minUseableTick)
    )
      return t("limit.submit");

    if (isInputTokenSorted && orderPriceTick <= minSettableTick) return t`Adjust your limit price to proceed.`;
    if (!isInputTokenSorted && orderPriceTick >= minSettableTick) return t`Adjust your limit price to proceed.`;
  }, [
    parsedAmounts,
    inputSwapAmount,
    independentFieldAmount,
    inputTokenSubBalance,
    inputTokenUnusedBalance,
    Trade,
    tokenInsufficient,
    orderPrice,
    currentPrice,
    pool,
    orderPriceTick,
    inputToken,
    minUseableTick,
    isInputTokenSorted,
    minSettableTick,
    tickError,
    inputCurrencyPrice,
  ]);

  const inputTokenBalance = formatTokenAmount(inputCurrencyBalance?.toExact(), inputCurrencyBalance?.currency.decimals);
  const outputTokenBalance = formatTokenAmount(
    outputCurrencyBalance?.toExact(),
    outputCurrencyBalance?.currency.decimals,
  );

  return {
    inputError,
    parsedAmounts,
    trade: Trade?.trade,
    state: Trade?.state ?? TradeState.INVALID,
    available: Trade?.available,
    poolId,
    pool,
    routes: Trade?.routes,
    noLiquidity: Trade?.noLiquidity,
    currencyBalances,
    inputToken,
    outputToken,
    inputCurrencyState,
    outputCurrencyState,
    inputTokenUnusedBalance,
    outputTokenUnusedBalance,
    inputTokenSubBalance,
    outputTokenSubBalance,
    inputTokenBalance,
    outputTokenBalance,
    maxInputAmount,
    unusedBalance,
    token0Balance: Trade.pool?.token0.address === inputToken?.address ? inputTokenBalance : outputTokenBalance,
    token1Balance: Trade.pool?.token1.address === inputToken?.address ? inputTokenBalance : outputTokenBalance,
    token0SubAccountBalance:
      Trade.pool?.token0.address === inputToken?.address ? inputTokenSubBalance : outputTokenBalance,
    token1SubAccountBalance:
      Trade.pool?.token1.address === inputToken?.address ? inputTokenSubBalance : outputTokenBalance,
    currentPrice,
    orderPriceTick,
    position,
    orderPrice,
    setOrderPrice,
    minUseableTick,
    isInputTokenSorted,
    minSettableTick,
    atLimitedTick,
  };
}

export function useSwapOutAmount() {
  return useAppSelector((state) => state.swap.swapOutAmount);
}

export function getSwapOutAmount(key: string) {
  return store.getState().swap.swapOutAmount[key];
}

export function useUpdateSwapOutAmount() {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, amount: bigint | undefined) => {
      dispatch(updateSwapOutAmount({ key, value: amount }));
    },
    [dispatch],
  );
}

export function getPlaceOrderPositionId() {
  return store.getState().limitOrder.placeOrderPositionId;
}

export function useUpdatePlaceOrderPositionId() {
  const dispatch = useAppDispatch();

  return useCallback(
    (positionId: bigint | Null) => {
      dispatch(updatePlaceOrderPositionId(positionId));
    },
    [dispatch],
  );
}
