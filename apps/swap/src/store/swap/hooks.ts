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
import { isValidPrincipal, formatTokenAmount, isNullArgs } from "@icpswap/utils";
import { useParsedQueryString, useDebouncedChangeHandler, useDebounce } from "@icpswap/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useAllowance } from "hooks/token";
import { useAllBalanceMaxSpend } from "hooks/swap/useMaxAmountSpend";
import { useTranslation } from "react-i18next";
import { type SwapPoolData } from "@icpswap/types";
import { SwapFinalMetadata } from "types/swap";
import {
  selectCurrency,
  switchCurrencies,
  typeInput,
  clearSwapState,
  updatePoolCanisterIds,
  PoolCanisterRecord,
  updateSwapOutAmount,
  updateAllSwapPools,
  updateSwapFinalMetadata,
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

  // Force to use token from pool, the token standard is using from pool metadata
  const [inputTokenState, __inputToken] = useToken(inputCurrencyId);
  const [outputTokenState, __outputToken] = useToken(outputCurrencyId);

  const isExactIn = independentField === SWAP_FIELD.INPUT;

  const { result: inputCurrencyBalance } = useCurrencyBalance(principal, __inputToken, refresh);
  const { result: outputCurrencyBalance } = useCurrencyBalance(principal, __outputToken, refresh);

  const currencyBalances = useMemo(() => {
    return {
      ...(__inputToken ? { [__inputToken.address]: inputCurrencyBalance } : {}),
      ...(__outputToken ? { [__outputToken.address]: outputCurrencyBalance } : {}),
    };
  }, [__inputToken, __outputToken, inputCurrencyBalance, outputCurrencyBalance]);

  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? __inputToken : __outputToken) ?? undefined);

  const otherCurrency = (isExactIn ? __outputToken : __inputToken) ?? undefined;

  const [debouncedTypedValue] = useDebounce(
    useMemo(() => [typedValue, otherCurrency], [typedValue, otherCurrency]),
    600,
  );

  const Trade = useBestTrade(
    __inputToken,
    __outputToken,
    !typedValue || typedValue === "0" || debouncedTypedValue !== typedValue ? undefined : debouncedTypedValue,
  );

  const pool = Trade?.pool;
  const poolId = Trade?.pool?.id;

  // Force to use token from pool, the token standard is using from pool metadata
  const inputToken = useMemo(() => {
    if (isNullArgs(pool) || isNullArgs(__inputToken)) return undefined;
    return pool.alignToken(__inputToken);
  }, [pool, __inputToken]);

  const { result: inputTokenSubBalance } = useTokenBalance(inputToken?.address, poolId, refresh, sub);
  const { result: outputTokenSubBalance } = useTokenBalance(__outputToken?.address, poolId, refresh, sub);

  const inputTokenUnusedBalance = BigInt(0);
  const outputTokenUnusedBalance = BigInt(0);

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
    poolId: pool?.id,
    subBalance: inputTokenSubBalance,
    unusedBalance: inputTokenUnusedBalance,
    allowance,
  });

  const inputError = useMemo(() => {
    if (isNullArgs(__inputToken) || isNullArgs(__outputToken)) return t("common.select.a.token");
    if (!parsedAmount) return t("common.enter.input.amount");
    if (!typedValue || typedValue === "0") return t("common.error.amount.large.than.fee");
    if (!inputTokenSubBalance || isNullArgs(inputTokenUnusedBalance)) return t("common.swap");
    if (inputNumberCheck(typedValue) === false) return t("common.error.exceeds.limit");
    if (typeof Trade.available === "boolean" && !Trade.available) return t("swap.pool.not.available");
    if (tokenInsufficient === "INSUFFICIENT")
      return t("common.error.insufficient.balance.symbol", { symbol: __inputToken?.symbol });

    return null;
  }, [
    __inputToken,
    __outputToken,
    typedValue,
    parsedAmount,
    inputTokenSubBalance,
    inputTokenUnusedBalance,
    Trade,
    tokenInsufficient,
  ]);

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
    // Tokens for react
    inputToken: __inputToken,
    outputToken: __outputToken,
    inputTokenState,
    outputTokenState,
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

export function useSwapFinalMetadata() {
  return useAppSelector((state) => state.swap.swapFinalMetadata);
}

export function useSwapFinalMetadataManager() {
  const dispatch = useAppDispatch();
  const swapFinalMetadata = useSwapFinalMetadata();

  const callback = useCallback(
    (data: SwapFinalMetadata) => {
      dispatch(updateSwapFinalMetadata(data));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      swapFinalMetadata,
      callback,
    }),
    [callback, swapFinalMetadata],
  );
}
