import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { SWAP_FIELD } from "constants/swap";
import { useCurrency } from "hooks/useCurrency";
import { tryParseAmount, inputNumberCheck } from "utils/swap";
import { TradeState, useBestTrade } from "hooks/swap/useTrade";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { useSlippageToleranceToPercent } from "store/swap/cache/hooks";
import { t } from "@lingui/macro";
import { useActualSwapAmount } from "hooks/swap/index";
import useDebounce from "hooks/useDebounce";
import store from "store/index";
import { CurrencyAmount } from "@icpswap/swap-sdk";
import { useParsedQueryString } from "@icpswap/hooks";
import {
  selectCurrency,
  switchCurrencies,
  typeInput,
  clearSwapState,
  updatePoolCanisterIds,
  PoolCanisterRecord,
  updateSwapOutAmount,
  updateDecreaseLiquidityAmount,
} from "./actions";

export function useSwapHandlers() {
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

  const onUserInput = useCallback(
    (field: SWAP_FIELD, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch],
  );

  return {
    onCurrencySelection,
    onSwitchTokens,
    onUserInput,
  };
}

export function useSwapState() {
  return useAppSelector((state) => state.swap);
}

export function useCleanSwapState() {
  const dispatch = useAppDispatch();

  return useCallback(() => dispatch(clearSwapState()), [dispatch]);
}

export function useSwapInfo({ refreshBalance }: { refreshBalance?: boolean }) {
  const account = useAccountPrincipal();
  const userSlippageTolerance = useSlippageToleranceToPercent("swap");

  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: { currencyId: inputCurrencyId },
    [SWAP_FIELD.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const [inputCurrencyState, inputCurrency] = useCurrency(inputCurrencyId);
  const [outputCurrencyState, outputCurrency] = useCurrency(outputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(account, inputCurrency, refreshBalance);
  const { result: outputCurrencyBalance } = useCurrencyBalance(account, outputCurrency, refreshBalance);

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined);

  const currencies = {
    [SWAP_FIELD.INPUT]: inputCurrency ?? undefined,
    [SWAP_FIELD.OUTPUT]: outputCurrency ?? undefined,
  };

  const actualSwapValue = useActualSwapAmount(typedValue, isExactIn ? inputCurrency : outputCurrency);

  const otherCurrency = (isExactIn ? outputCurrency : inputCurrency) ?? undefined;

  const [debouncedTypedValue] = useDebounce(
    useMemo(() => [typedValue, otherCurrency], [typedValue, otherCurrency]),
    600,
  );

  const Trade = useBestTrade(
    inputCurrency,
    outputCurrency,
    !actualSwapValue || actualSwapValue === "0" ? undefined : debouncedTypedValue,
  );

  let inputError: null | string = null;

  if (inputNumberCheck(typedValue) === false) {
    inputError = inputError ?? t`Amount exceeds limit`;
  }

  if (!parsedAmount) {
    inputError = inputError ?? t`Enter an amount`;
  }

  if (!currencies[SWAP_FIELD.INPUT] || !currencies[SWAP_FIELD.OUTPUT]) {
    inputError = inputError ?? t`Select a token`;
  }

  const [balanceIn, amountIn] = [
    currencyBalances[SWAP_FIELD.INPUT],
    userSlippageTolerance ? Trade?.trade?.maximumAmountIn(userSlippageTolerance) : undefined,
  ];

  if (
    balanceIn &&
    amountIn &&
    balanceIn.lessThan(
      amountIn.add(CurrencyAmount.fromRawAmount(amountIn.currency.wrapped, amountIn.currency.transFee)),
    )
  ) {
    inputError = inputError ?? `Insufficient ${amountIn.currency.symbol} balance`;
  }

  if (!actualSwapValue || actualSwapValue === "0") {
    inputError = inputError ?? t`Amount should large than trans fee`;
  }

  if (typeof Trade.available === "boolean" && !Trade.available) {
    inputError = inputError ?? t`This pool is not available now`;
  }

  return {
    currencies,
    inputError,
    parsedAmount,
    trade: Trade?.trade,
    state: Trade?.state ?? TradeState.INVALID,
    available: Trade?.available,
    tradePoolId: Trade?.tradePoolId,
    currencyBalances,
    userSlippageTolerance,
    inputCurrency,
    outputCurrency,
    inputCurrencyState,
    outputCurrencyState,
    actualSwapValue,
  };
}

export function useLoadDefaultParams() {
  const dispatch = useAppDispatch();

  const { input, output } = useParsedQueryString() as { input: string | undefined; output: string | undefined };

  useEffect(() => {
    if (input !== undefined) {
      dispatch(
        selectCurrency({
          field: SWAP_FIELD.INPUT,
          currencyId: input,
        }),
      );
    }

    if (output !== undefined) {
      dispatch(
        selectCurrency({
          field: SWAP_FIELD.OUTPUT,
          currencyId: output,
        }),
      );
    }
  }, [input, output, dispatch]);
}

export function usePoolCanisterIdManager(
  key?: string | undefined,
): [string | undefined, (params: PoolCanisterRecord) => void] {
  const dispatch = useAppDispatch();

  const poolIds = useAppSelector((state) => state.swap.poolCanisterIds);
  const poolId = !key ? undefined : poolIds[key];

  const updatePoolCanisterId = useCallback(
    ({ key, id }: PoolCanisterRecord) => {
      dispatch(updatePoolCanisterIds({ key, id }));
    },
    [dispatch],
  );

  return useMemo(() => [poolId, updatePoolCanisterId], [poolId, updatePoolCanisterId]);
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

export function getDecreaseLiquidityAmount(key: string) {
  return store.getState().swap.decreaseLiquidityAmount[key];
}

export function useUpdateDecreaseLiquidityAmount() {
  const dispatch = useAppDispatch();

  return useCallback(
    (key: string, amount0: bigint | undefined, amount1: bigint | undefined) => {
      dispatch(updateDecreaseLiquidityAmount({ key, amount0, amount1 }));
    },
    [dispatch],
  );
}
