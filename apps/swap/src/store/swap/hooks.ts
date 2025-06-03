import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { SWAP_FIELD } from "constants/swap";
import { useToken } from "hooks/useCurrency";
import { tryParseAmount, inputNumberCheck, isUseTransfer } from "utils/index";
import { TradeState, useBestTrade } from "hooks/swap/useTrade";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCurrencyBalance, useTokenBalance } from "hooks/token/useTokenBalance";
import { useSlippageToleranceToPercent } from "store/swap/cache/hooks";
import { getTokenInsufficient } from "hooks/swap/index";
import store from "store/index";
import { useParsedQueryString, useUserUnusedBalance, useDebouncedChangeHandler, useDebounce } from "@icpswap/hooks";
import { isValidPrincipal, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import { SubAccount } from "@dfinity/ledger-icp";
import { useAllowance } from "hooks/token";
import { useAllBalanceMaxSpend } from "hooks/swap/useMaxAmountSpend";
import { useTranslation } from "react-i18next";
import { type SwapPoolData } from "@icpswap/types";

import {
  selectCurrency,
  switchCurrencies,
  typeInput,
  clearSwapState,
  updatePoolCanisterIds,
  PoolCanisterRecord,
  updateSwapOutAmount,
  updateDecreaseLiquidityAmount,
  updateAllSwapPools,
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

  const [, debouncedSwitchTokens] = useDebouncedChangeHandler<void>(undefined, onSwitchTokens, 500);

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
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const userSlippageTolerance = useSlippageToleranceToPercent("swap");

  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const {
    independentField,
    typedValue,
    [SWAP_FIELD.INPUT]: inputCurrencyId,
    [SWAP_FIELD.OUTPUT]: outputCurrencyId,
  } = useSwapState();

  const [inputTokenState, inputToken] = useToken(inputCurrencyId);
  const [outputTokenState, outputToken] = useToken(outputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(principal, inputToken, refresh);
  const { result: outputCurrencyBalance } = useCurrencyBalance(principal, outputToken, refresh);

  const currencyBalances = {
    [SWAP_FIELD.INPUT]: inputCurrencyBalance,
    [SWAP_FIELD.OUTPUT]: outputCurrencyBalance,
  };

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputToken : outputToken) ?? undefined);

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

  const poolId = useMemo(() => Trade?.pool?.id, [Trade]);

  // DIP20 not support subaccount balance
  // So useTokenBalance is 0 by default if standard is DIP20
  const { result: __inputTokenSubBalance } = useTokenBalance(inputToken?.address, poolId, refresh, sub);
  const { result: __outputTokenSubBalance } = useTokenBalance(outputToken?.address, poolId, refresh, sub);

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
    balance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputToken?.decimals).toString(),
    formatTokenAmount: formatTokenAmount(typedValue, inputToken?.decimals).toString(),
    unusedBalance: inputTokenUnusedBalance,
    allowance,
  });

  const maxInputAmount = useAllBalanceMaxSpend({
    token: inputToken,
    balance: formatTokenAmount(inputCurrencyBalance?.toExact(), inputToken?.decimals).toString(),
    poolId: Trade?.pool?.id,
    subBalance: inputTokenSubBalance,
    unusedBalance: inputTokenUnusedBalance,
    allowance,
  });

  const inputError = useMemo(() => {
    if (isNullArgs(inputToken) || isNullArgs(outputToken)) return t("common.select.a.token");
    if (!parsedAmount) return t("common.enter.input.amount");
    if (!typedValue || typedValue === "0") return t("common.error.amount.large.than.fee");
    if (!inputTokenSubBalance || isNullArgs(inputTokenUnusedBalance)) return t`Swap`;
    if (inputNumberCheck(typedValue) === false) return t("common.error.exceeds.limit");
    if (typeof Trade.available === "boolean" && !Trade.available) return t("swap.pool.not.available");
    if (tokenInsufficient === "INSUFFICIENT") return `Insufficient ${inputToken?.symbol} balance`;

    return null;
  }, [typedValue, parsedAmount, inputTokenSubBalance, inputTokenUnusedBalance, Trade, tokenInsufficient]);

  return {
    inputError,
    parsedAmount,
    trade: Trade?.trade,
    state: Trade?.state ?? TradeState.INVALID,
    available: Trade?.available,
    routes: Trade?.routes,
    noLiquidity: Trade?.noLiquidity,
    currencyBalances,
    userSlippageTolerance,
    inputToken,
    outputToken,
    inputTokenState,
    outputTokenState,
    unusedBalance,
    inputTokenUnusedBalance,
    outputTokenUnusedBalance,
    inputTokenSubBalance,
    outputTokenSubBalance,
    inputTokenBalance: formatTokenAmount(
      inputCurrencyBalance?.toExact(),
      inputCurrencyBalance?.currency.decimals,
    ).toString(),
    outputTokenBalance: formatTokenAmount(
      outputCurrencyBalance?.toExact(),
      outputCurrencyBalance?.currency.decimals,
    ).toString(),
    maxInputAmount,
    pool: Trade.pool,
    poolId,
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

export function useUpdateAllSwapPools() {
  const dispatch = useAppDispatch();

  return useCallback(
    (allSwapPools: SwapPoolData[]) => {
      dispatch(updateAllSwapPools(allSwapPools));
    },
    [dispatch],
  );
}

export function useAllSwapPools() {
  return useAppSelector((state) => state.swap.allSwapPools);
}
