import { useState, useCallback, useMemo, useEffect, forwardRef, Ref, useImperativeHandle } from "react";
import { Box, Typography, CircularProgress } from "components/Mui";
import { useSwapState, useSwapHandlers, useSwapInfo, useCleanSwapState, useLoadDefaultParams } from "store/swap/hooks";
import { isUndefinedOrNull, BigNumber, getNumberDecimals } from "@icpswap/utils";
import { SWAP_FIELD, SWAP_REFRESH_KEY } from "constants/swap";
import { SAFE_DECIMALS_LENGTH } from "constants/index";
import { useExpertModeManager } from "store/swap/cache/hooks";
import { TradeState } from "hooks/swap/useTrade";
import { maxAmountFormat } from "utils/swap/index";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { warningSeverity, getImpactConfirm } from "utils/swap/prices";
import { useUSDPrice } from "hooks/useUSDPrice";
import { TradePrice } from "components/swap/TradePrice";
import { AuthButton } from "components/index";
import { Flex, MainCard } from "@icpswap/ui";
import StepViewButton from "components/Steps/View";
import { ReclaimTips } from "components/ReclaimTips";
import { SwapInputWrapper, SwapConfirmModal, Impact, useSwapContext } from "components/swap/index";
import { useHistory } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useGlobalContext, useRefreshTrigger, useSwapNoLiquidityManager } from "hooks/index";
import { useTranslation } from "react-i18next";
import { useSwapCallback } from "hooks/swap/useSwapCallback";
import { SwapSuccessModal } from "components/swap/SwapSuccessModal";
import { SwapFailedTransactionTips } from "components/swap/SwapFailedTransactionTips";

export interface SwapWrapperRef {
  setInputAmount: (amount: string) => void;
}

export interface SwapWrapperProps {
  ui?: "pro" | "normal";
}

export const SwapWrapper = forwardRef(({ ui = "normal" }: SwapWrapperProps, ref: Ref<SwapWrapperRef>) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [isExpertMode] = useExpertModeManager();
  const { setPoolId, setSelectedPool, setCachedPool, usdValueChange, setInputToken, setOutputToken } = useSwapContext();
  const { setRefreshTriggers } = useGlobalContext();
  const { onUserInput } = useSwapHandlers();
  const clearSwapState = useCleanSwapState();
  const refreshTrigger = useRefreshTrigger(SWAP_REFRESH_KEY);

  const [impactChecked, setImpactChecked] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccessModalShow, setSwapSuccessModalShow] = useState(false);
  const [outOfCyclesChecked, setOutOfCyclesChecked] = useState<boolean | undefined>(undefined);

  useLoadDefaultParams();

  const { [SWAP_FIELD.INPUT]: inputTokenId, [SWAP_FIELD.OUTPUT]: outputTokenId, independentField } = useSwapState();

  const {
    inputError: swapInputError,
    parsedAmount,
    trade,
    poolId,
    routes,
    state: swapState,
    currencyBalances,
    userSlippageTolerance,
    inputToken,
    outputToken,
    inputTokenState,
    outputTokenState,
    inputTokenUnusedBalance,
    inputTokenSubBalance,
    outputTokenSubBalance,
    outputTokenUnusedBalance,
    inputTokenBalance,
    maxInputAmount,
    noLiquidity,
  } = useSwapInfo({ refresh: refreshTrigger });

  // Auto refresh token balance 5 seconds
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setBalanceRefreshTrigger(balanceRefreshTrigger + 1);
  //   }, 5000);

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [setBalanceRefreshTrigger, balanceRefreshTrigger]);

  const isLoadingRoute = swapState === TradeState.LOADING;
  const isNoRouteFound = swapState === TradeState.NO_ROUTE_FOUND;
  const isValid = !swapInputError && !isLoadingRoute && !isNoRouteFound;
  const isPoolNotChecked = swapState === TradeState.NOT_CHECK;

  const inputTokenPrice = useUSDPrice(inputToken);
  const outputTokenPrice = useUSDPrice(outputToken);

  const { updateNoLiquidity } = useSwapNoLiquidityManager();

  // Set pool for Swap context
  useEffect(() => {
    const pool = routes[0]?.pools[0];
    setSelectedPool(pool);

    if (pool) {
      setCachedPool(pool);
    }

    updateNoLiquidity(noLiquidity);

    if (pool?.id) {
      setPoolId(pool.id);
    }
  }, [routes, setSelectedPool, noLiquidity, updateNoLiquidity]);

  // Set token for Swap context
  useEffect(() => {
    setInputToken(inputToken);
    setOutputToken(outputToken);
  }, [inputToken, outputToken, setInputToken, setOutputToken]);

  const parsedAmounts = useMemo(
    () => ({
      [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? parsedAmount : trade?.inputAmount,
      [SWAP_FIELD.OUTPUT]: independentField === SWAP_FIELD.OUTPUT ? parsedAmount : trade?.outputAmount,
    }),
    [independentField, parsedAmount, trade],
  );

  const handleTokenAChange = useCallback(
    (token: Token) => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap";

      if (token.address === outputTokenId) {
        history.push(`${prePath}?input=${token.address}&output=${ICP.address}`);
      } else {
        history.push(`${prePath}?input=${token.address}&output=${outputTokenId}`);
      }
    },
    [outputTokenId],
  );

  const handleTokenBChange = useCallback(
    (token: Token) => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap";

      if (token.address === inputTokenId) {
        history.push(`${prePath}?input=${ICP.address}&output=${token.address}`);
      } else {
        history.push(`${prePath}?input=${inputTokenId}&output=${token.address}`);
      }
    },
    [inputTokenId],
  );

  const handleInput = useCallback((value: string, type: "input" | "output") => {
    const numDecimals = getNumberDecimals(value);

    if (type === "input") {
      onUserInput(
        SWAP_FIELD.INPUT,
        value === ""
          ? ""
          : new BigNumber(value).isEqualTo(0)
          ? "0"
          : new BigNumber(value).toFixed(numDecimals < SAFE_DECIMALS_LENGTH ? numDecimals : SAFE_DECIMALS_LENGTH),
      );
    } else {
      onUserInput(
        SWAP_FIELD.OUTPUT,
        value === ""
          ? ""
          : new BigNumber(value).isEqualTo(0)
          ? "0"
          : new BigNumber(value).toFixed(numDecimals < SAFE_DECIMALS_LENGTH ? numDecimals : SAFE_DECIMALS_LENGTH),
      );
    }
  }, []);

  const exceedImpact = useMemo(() => {
    if (!usdValueChange) return false;
    return getImpactConfirm(usdValueChange);
  }, [usdValueChange]);

  const swapCallback = useSwapCallback({ inputToken, poolId, refresh: refreshTrigger });

  const handleSwapConfirm = useCallback(async () => {
    if (
      (exceedImpact && !impactChecked) ||
      outOfCyclesChecked === false ||
      swapLoading ||
      !trade ||
      isUndefinedOrNull(inputTokenSubBalance) ||
      isUndefinedOrNull(inputTokenUnusedBalance) ||
      isUndefinedOrNull(inputTokenBalance)
    )
      return;

    const { call, key } = swapCallback({
      trade,
      subAccountBalance: inputTokenSubBalance,
      unusedBalance: inputTokenUnusedBalance as bigint,
      balance: inputTokenBalance,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
      },
      refresh: () => {
        setRefreshTriggers(SWAP_REFRESH_KEY);
        setTimeout(() => {
          setRefreshTriggers(SWAP_REFRESH_KEY);
        }, 1000);
      },
    });

    setSwapLoading(true);

    const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
    const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

    const loadingKey = openLoadingTip(
      t("swap.to", { symbol0: `${amount0} ${inputToken?.symbol}`, symbol1: `${amount1} ${outputToken?.symbol}` }),
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    setConfirmModalShow(false);
    setSwapLoading(false);

    handleInput("", "input");
    handleInput("", "output");

    const success = await call();

    if (success) {
      setSwapSuccessModalShow(true);
    }

    closeLoadingTip(loadingKey);
  }, [
    exceedImpact,
    impactChecked,
    outOfCyclesChecked,
    swapLoading,
    setSwapLoading,
    trade,
    inputTokenSubBalance,
    inputTokenUnusedBalance,
    setRefreshTriggers,
    inputTokenBalance,
    swapCallback,
  ]);

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(SWAP_FIELD.INPUT, maxAmountFormat(maxInputAmount.toExact(), maxInputAmount.currency.decimals));
    }
  }, [maxInputAmount, onUserInput]);

  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(executionPriceImpact);
  }, [trade]);

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;

  useEffect(() => {
    return () => {
      clearSwapState();
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setInputAmount: (value: string) => handleInput(value, "input"),
    }),
    [handleInput],
  );

  const handleSwap = useCallback(() => {
    setConfirmModalShow(true);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ui === "pro" ? "6px 0" : "6px 0" }}>
      <SwapInputWrapper
        onMaxInput={handleMaxInput}
        onInput={handleInput}
        onTokenAChange={handleTokenAChange}
        onTokenBChange={handleTokenBChange}
        inputTokenPrice={inputTokenPrice}
        outputTokenPrice={outputTokenPrice}
        inputToken={inputToken}
        outputToken={outputToken}
        inputTokenState={inputTokenState}
        outputTokenState={outputTokenState}
        currencyBalances={currencyBalances}
        parsedAmounts={parsedAmounts}
        poolId={poolId}
        ui={ui}
        inputTokenSubBalance={inputTokenSubBalance}
        outputTokenSubBalance={outputTokenSubBalance}
        inputTokenUnusedBalance={inputTokenUnusedBalance}
        outputTokenUnusedBalance={outputTokenUnusedBalance}
        maxInputAmount={maxInputAmount}
        noLiquidity={noLiquidity}
      />

      {isLoadingRoute || (!isLoadingRoute && !!trade) ? (
        <MainCard
          border="level4"
          level={ui === "pro" ? 1 : 3}
          padding={ui === "pro" ? "10px" : "16px"}
          borderRadius={ui === "pro" ? "12px" : undefined}
        >
          <Box sx={{ display: "grid", gap: "20px 0", gridTemplateColumns: "1fr" }}>
            {isLoadingRoute ? (
              <Flex fullWidth justify="flex-start" align="center">
                <CircularProgress size={14} color="inherit" />
                <Typography sx={{ margin: "0 0 0 4px" }}>Fetching price...</Typography>
              </Flex>
            ) : trade ? (
              <TradePrice
                poolId={trade.swaps[0].route.pools[0].id}
                price={trade.executionPrice}
                token0={inputToken}
                token1={outputToken}
                token0PriceUSDValue={inputTokenPrice}
                token1PriceUSDValue={outputTokenPrice}
                fontSize={ui === "pro" ? "12px" : undefined}
              />
            ) : null}
          </Box>
        </MainCard>
      ) : null}

      <Impact showImpact={exceedImpact} onCheckChange={(checked) => setImpactChecked(checked)} />

      <SwapFailedTransactionTips
        poolId={poolId}
        onCheckChange={(checked) => setOutOfCyclesChecked(checked)}
        updateNeedCheckOrNot={(needCheck: boolean) => {
          if (needCheck) {
            setOutOfCyclesChecked(false);
          }
        }}
      />

      <AuthButton
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSwap}
        disabled={
          !isValid ||
          priceImpactTooHigh ||
          isPoolNotChecked ||
          (exceedImpact && !impactChecked) ||
          !trade ||
          outOfCyclesChecked === false
        }
        sx={{
          borderRadius: "16px",
        }}
      >
        {swapInputError ||
          (isLoadingRoute
            ? t("common.swap")
            : isNoRouteFound
            ? t("common.insufficient.liquidity")
            : isPoolNotChecked
            ? t("swap.waiting.verifying")
            : priceImpactTooHigh
            ? t("swap.high.impact")
            : priceImpactSeverity > 2
            ? t("swap.anyway")
            : t("common.swap"))}
      </AuthButton>

      {confirmModalShow && trade && (
        <SwapConfirmModal
          trade={trade}
          open={confirmModalShow}
          onClose={() => setConfirmModalShow(false)}
          onConfirm={handleSwapConfirm}
          slippageTolerance={userSlippageTolerance}
          loading={swapLoading}
          inputTokenUnusedBalance={inputTokenUnusedBalance}
          inputTokenSubBalance={inputTokenSubBalance}
          inputTokenBalance={inputTokenBalance}
        />
      )}

      <SwapSuccessModal open={swapSuccessModalShow} onClose={() => setSwapSuccessModalShow(false)} />
    </Box>
  );
});
