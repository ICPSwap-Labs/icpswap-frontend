import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { SWAP_FIELD } from "constants/swap";
import { useToken } from "hooks/useCurrency";
import { tryParseAmount, inputNumberCheck } from "utils/swap";
import { TradeState, useBestTrade } from "hooks/swap/useTrade";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCurrencyBalance } from "hooks/token/useTokenBalance";
import { useSlippageToleranceToPercent } from "store/swap/cache/hooks";
import { t } from "@lingui/macro";
import { getTokenInsufficient } from "hooks/swap/index";
import useDebounce from "hooks/useDebounce";
import store from "store/index";
import { useParsedQueryString, useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { isValidPrincipal, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import { SubAccount } from "@dfinity/ledger-icp";

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

export interface UseSwapInfoArgs {
  refresh?: number | boolean;
}

export function useSwapInfo({ refresh }: UseSwapInfoArgs) {
  const principal = useAccountPrincipal();
  const userSlippageTolerance = useSlippageToleranceToPercent("swap");

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: { currencyId: inputCurrencyId },
    [SWAP_FIELD.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const [inputCurrencyState, inputToken] = useToken(inputCurrencyId);
  const [outputCurrencyState, outputCurrency] = useToken(outputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(principal, inputToken, refresh);
  const { result: outputCurrencyBalance } = useCurrencyBalance(principal, outputCurrency, refresh);

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputToken : outputCurrency) ?? undefined);

  const currencies = {
    [SWAP_FIELD.INPUT]: inputToken ?? undefined,
    [SWAP_FIELD.OUTPUT]: outputCurrency ?? undefined,
  };

  const otherCurrency = (isExactIn ? outputCurrency : inputToken) ?? undefined;

  const [debouncedTypedValue] = useDebounce(
    useMemo(() => [typedValue, otherCurrency], [typedValue, otherCurrency]),
    600,
  );

  const Trade = useBestTrade(
    inputToken,
    outputCurrency,
    !typedValue || typedValue === "0" || debouncedTypedValue !== typedValue ? undefined : debouncedTypedValue,
  );

  const poolId = useMemo(() => Trade?.tradePoolId, [Trade]);

  // DIP20 not support subaccount balance
  // So useTokenBalance is 0 by default if standard is DIP20
  const { result: subAccountTokenBalance } = useTokenBalance({
    canisterId: inputToken?.address,
    address: poolId,
    sub,
    refresh,
  });
  const { result: unusedBalance } = useUserUnusedBalance(poolId, principal, refresh);
  const swapTokenUnusedBalance = useMemo(() => {
    if (!poolId || !unusedBalance || !inputToken) return undefined;

    const pool = Trade.routes[0].pools[0];

    return pool.token0.address === inputToken.address ? unusedBalance.balance0 : unusedBalance.balance1;
  }, [Trade, inputToken, unusedBalance]);

  const tokenInsufficient = getTokenInsufficient({
    token: inputToken,
    subAccountBalance: subAccountTokenBalance,
    balance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputToken?.decimals),
    formatTokenAmount: formatTokenAmount(typedValue, inputToken?.decimals).toString(),
    unusedBalance: swapTokenUnusedBalance,
  });

  const inputError = useMemo(() => {
    if (!currencies[SWAP_FIELD.INPUT] || !currencies[SWAP_FIELD.OUTPUT]) return t`Select a token`;
    if (!parsedAmount) return t`Enter an amount`;
    if (!typedValue || typedValue === "0") return t`Amount should large than trans fee`;
    if (!subAccountTokenBalance || isNullArgs(swapTokenUnusedBalance)) return t`Swap`;
    if (inputNumberCheck(typedValue) === false) return t`Amount exceeds limit`;
    if (typeof Trade.available === "boolean" && !Trade.available) return t`This pool is not available now`;
    if (tokenInsufficient === "INSUFFICIENT") return `Insufficient ${inputToken?.symbol} balance`;

    return null;
  }, [typedValue, parsedAmount, currencies, subAccountTokenBalance, swapTokenUnusedBalance, Trade, tokenInsufficient]);

  return {
    currencies,
    inputError,
    parsedAmount,
    trade: Trade?.trade,
    state: Trade?.state ?? TradeState.INVALID,
    available: Trade?.available,
    tradePoolId: Trade?.tradePoolId,
    routes: Trade?.routes,
    currencyBalances,
    userSlippageTolerance,
    inputToken,
    outputCurrency,
    inputCurrencyState,
    outputCurrencyState,
    swapTokenUnusedBalance,
    subAccountTokenBalance,
    inputTokenBalance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputCurrencyBalance?.currency.decimals),
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
