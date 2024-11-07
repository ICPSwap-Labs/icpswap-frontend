import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { SWAP_FIELD } from "constants/swap";
import { useToken } from "hooks/useCurrency";
import { tryParseAmount, inputNumberCheck, isUseTransfer } from "utils/index";
import { TradeState, useBestTrade } from "hooks/swap/useTrade";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { useSlippageToleranceToPercent } from "store/swap/cache/hooks";
import { t } from "@lingui/macro";
import { getTokenInsufficient } from "hooks/swap/index";
import useDebounce from "hooks/useDebounce";
import store from "store/index";
import { useParsedQueryString, useUserUnusedBalance, useTokenBalance, useDebouncedChangeHandler } from "@icpswap/hooks";
import {
  isValidPrincipal,
  formatTokenAmount,
  isNullArgs,
  BigNumber,
  parseTokenAmount,
  nonNullArgs,
} from "@icpswap/utils";
import { SubAccount } from "@dfinity/ledger-icp";
import { useAllowance } from "hooks/token";
import { useAllBalanceMaxSpend } from "hooks/swap/useMaxAmountSpend";
import { Null } from "@icpswap/types";
import { usePlaceOrderPosition } from "hooks/swap/limit-order";
import { CurrencyAmount, TICK_SPACINGS, nearestUsableTick } from "@icpswap/swap-sdk";

import {
  selectCurrency,
  switchCurrencies,
  typeInput,
  clearSwapState,
  updateSwapOutAmount,
  updatePlaceOrderPositionId,
} from "./actions";

export function useLimitHandlers() {
  const dispatch = useAppDispatch();

  const onCurrencySelection = useCallback(
    (field: SWAP_FIELD, currencyId: string | undefined) => {
      dispatch(
        selectCurrency({
          field,
          currencyId,
        }),
      );
    },
    [dispatch],
  );

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies());
  }, [dispatch]);

  const [, debouncedSwitchTokens] = useDebouncedChangeHandler<any>(undefined, onSwitchTokens, 500);

  const onUserInput = useCallback(
    (field: SWAP_FIELD, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch],
  );

  return {
    onCurrencySelection,
    onSwitchTokens: debouncedSwitchTokens,
    onUserInput,
  };
}

export function useLimitState() {
  return useAppSelector((state) => state.limitOrder);
}

export function useCleanSwapState() {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(clearSwapState()), [dispatch]);
}

export interface UseSwapInfoArgs {
  refresh?: number | boolean;
}

export function useLimitOrderInfo({ refresh }: UseSwapInfoArgs) {
  const principal = useAccountPrincipal();
  const userSlippageTolerance = useSlippageToleranceToPercent("swap");

  const [__orderPrice, setOrderPrice] = useState<string | Null>(null);

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: { currencyId: inputCurrencyId },
    [SWAP_FIELD.OUTPUT]: { currencyId: outputCurrencyId },
  } = useLimitState();

  const [inputCurrencyState, inputToken] = useToken(inputCurrencyId);
  const [outputCurrencyState, outputToken] = useToken(outputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(principal, inputToken, refresh);
  const { result: outputCurrencyBalance } = useCurrencyBalance(principal, outputToken, refresh);

  const orderPrice = useMemo(() => {
    if (!__orderPrice || !inputToken) return undefined;
    return new BigNumber(__orderPrice).toFixed(inputToken.decimals).toString();
  }, [__orderPrice, inputToken]);

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputToken : outputToken) ?? undefined);
  const outputAmount = useMemo(() => {
    if (nonNullArgs(parsedAmount) && nonNullArgs(orderPrice) && nonNullArgs(outputToken)) {
      return CurrencyAmount.fromRawAmount(
        outputToken,
        formatTokenAmount(
          new BigNumber(parsedAmount.toExact()).multipliedBy(orderPrice).toFixed(outputToken.decimals),
          outputToken.decimals,
        ).toString(),
      );
    }
  }, [parsedAmount, orderPrice, outputToken]);

  const currencies = {
    [SWAP_FIELD.INPUT]: inputToken ?? undefined,
    [SWAP_FIELD.OUTPUT]: outputToken ?? undefined,
  };

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

  const { position, orderPriceTick } = usePlaceOrderPosition({
    pool,
    inputToken,
    orderPrice,
  });

  const isInputTokenSorted = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(inputToken)) return null;
    return pool.token0.equals(inputToken);
  }, [pool, inputToken]);

  const minUseableTick = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(isInputTokenSorted)) return null;

    const tickCurrent = pool.tickCurrent;

    if (isInputTokenSorted) {
      const minTick = tickCurrent + TICK_SPACINGS[pool.fee];
      const useableTick = nearestUsableTick(minTick, TICK_SPACINGS[pool.fee]);
      if (useableTick - TICK_SPACINGS[pool.fee] < tickCurrent) return useableTick + TICK_SPACINGS[pool.fee];
      return useableTick;
    }

    const minTick = tickCurrent - TICK_SPACINGS[pool.fee];
    const useableTick = nearestUsableTick(minTick, TICK_SPACINGS[pool.fee]);
    if (useableTick + TICK_SPACINGS[pool.fee] > tickCurrent) return useableTick - TICK_SPACINGS[pool.fee];
    return useableTick;
  }, [pool, isInputTokenSorted]);

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
    formatTokenAmount: formatTokenAmount(typedValue, inputToken?.decimals).toString(),
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
    if (isNullArgs(pool) || isNullArgs(inputToken)) return undefined;
    if (pool.token0.address === inputToken.address) return pool.token0Price.toFixed();
    return pool.token1Price.toFixed();
  }, [pool, inputToken, orderPrice]);

  const inputError = useMemo(() => {
    if (!currencies[SWAP_FIELD.INPUT] || !currencies[SWAP_FIELD.OUTPUT] || !inputToken) return t`Select a token`;
    if (!parsedAmount) return t`Enter an amount`;
    if (!typedValue || typedValue === "0") return t`Amount should large than trans fee`;

    const minimumAmount = parseTokenAmount(inputToken.transFee, inputToken.decimals).multipliedBy(10000);

    if (inputToken.transFee > 0 && minimumAmount.isGreaterThan(typedValue))
      return t`Amount must exceed ${minimumAmount.toFormat()} ${inputToken.symbol}`;
    if (inputNumberCheck(typedValue) === false) return t`Amount exceeds limit`;
    if (typeof Trade.available === "boolean" && !Trade.available) return t`This pool is not available now`;
    if (tokenInsufficient === "INSUFFICIENT") return `Insufficient ${inputToken?.symbol} balance`;
    if (isNullArgs(orderPrice) || orderPrice === "") return t`Enter the price`;
    if (new BigNumber(orderPrice).isEqualTo(0) || isNullArgs(minUseableTick)) return t`Invalid price`;
    if (
      !inputTokenSubBalance ||
      isNullArgs(inputTokenUnusedBalance) ||
      isNullArgs(currentPrice) ||
      isNullArgs(pool) ||
      isNullArgs(orderPriceTick) ||
      isNullArgs(isInputTokenSorted)
    )
      return t`Submit Limit Order`;

    if (isInputTokenSorted && orderPriceTick < minUseableTick) return t`Adjust your limit price to proceed.`;
    if (!isInputTokenSorted && orderPriceTick > minUseableTick) return t`Adjust your limit price to proceed.`;
  }, [
    typedValue,
    parsedAmount,
    currencies,
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
  ]);

  const inputTokenBalance = formatTokenAmount(inputCurrencyBalance?.toExact(), inputCurrencyBalance?.currency.decimals);
  const outputTokenBalance = formatTokenAmount(
    outputCurrencyBalance?.toExact(),
    outputCurrencyBalance?.currency.decimals,
  );

  return {
    currencies,
    inputError,
    parsedAmount,
    trade: Trade?.trade,
    state: Trade?.state ?? TradeState.INVALID,
    available: Trade?.available,
    tradePoolId: Trade?.tradePoolId,
    pool: Trade.trade?.swaps[0].route.pools[0],
    routes: Trade?.routes,
    noLiquidity: Trade?.noLiquidity,
    currencyBalances,
    userSlippageTolerance,
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
    outputAmount,
  };
}

export function useLoadDefaultParams() {
  const dispatch = useAppDispatch();

  const { input, output } = useParsedQueryString() as { input: string | undefined; output: string | undefined };

  useEffect(() => {
    if (input !== undefined && isValidPrincipal(input)) {
      dispatch(
        selectCurrency({
          field: SWAP_FIELD.INPUT,
          currencyId: input,
        }),
      );
    }

    if (output !== undefined && isValidPrincipal(output)) {
      dispatch(
        selectCurrency({
          field: SWAP_FIELD.OUTPUT,
          currencyId: output,
        }),
      );
    }
  }, [input, output, dispatch]);
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
