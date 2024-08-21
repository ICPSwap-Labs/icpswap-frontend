import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { Grid, Box, Typography, CircularProgress } from "components/Mui";
import { useSwapState, useSwapHandlers, useSwapInfo, useCleanSwapState, useLoadDefaultParams } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { toSignificant, isNullArgs } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { useExpertModeManager } from "store/swap/cache/hooks";
import { TradeState } from "hooks/swap/useTrade";
import { maxAmountFormat } from "utils/swap/index";
import { useSwapCallback } from "hooks/swap/useSwapCallback";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { warningSeverity, getImpactConfirm } from "utils/swap/prices";
import { useUSDPrice } from "hooks/useUSDPrice";
import TradePrice from "components/swap/TradePrice";
import { Trans, t } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import { Flex, MainCard, Checkbox } from "@icpswap/ui";
import StepViewButton from "components/Steps/View";
import { TokenInfo } from "types/token";
import { ReclaimTips } from "components/ReclaimTips";
import { useMaxAmountSpend } from "hooks/swap/useMaxAmountSpend";
import { SwapInputWrapper } from "components/swap/SwapInputWrapper";
import SwapConfirm from "components/swap/SwapConfirm";
import { useHistory } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { SwapContext } from "components/swap/index";

export interface SwapWrapperProps {
  ui?: "pro" | "normal";
  onInputTokenChange?: (token: Token | undefined) => void;
  onOutputTokenChange?: (tokenId: Token | undefined) => void;
  onTradePoolIdChange?: (poolId: string | undefined) => void;
}

export function SwapWrapper({
  ui = "normal",
  onInputTokenChange,
  onOutputTokenChange,
  onTradePoolIdChange,
}: SwapWrapperProps) {
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [impactChecked, setImpactChecked] = useState(false);
  // const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(0);

  const [isExpertMode] = useExpertModeManager();
  const history = useHistory();
  const { setSelectedPool, refreshTrigger, setRefreshTrigger, usdValueChange } = useContext(SwapContext);

  useLoadDefaultParams();

  const { [SWAP_FIELD.INPUT]: currencyA, [SWAP_FIELD.OUTPUT]: currencyB, independentField } = useSwapState();

  const { onUserInput } = useSwapHandlers();
  const handleClearSwapState = useCleanSwapState();

  const {
    inputError: swapInputError,
    parsedAmount,
    trade,
    tradePoolId,
    routes,
    state: swapState,
    currencyBalances,
    userSlippageTolerance,
    inputCurrency,
    outputCurrency,
    inputCurrencyState,
    outputCurrencyState,
    swapTokenUnusedBalance,
    subAccountTokenBalance,
  } = useSwapInfo({ refresh: refreshTrigger });

  // For swap pro
  useEffect(() => {
    if (onInputTokenChange) onInputTokenChange(inputCurrency);
    if (onOutputTokenChange) onOutputTokenChange(outputCurrency);
    if (onTradePoolIdChange) onTradePoolIdChange(tradePoolId);
  }, [tradePoolId, outputCurrency, inputCurrency]);

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

  const inputCurrencyInterfacePrice = useUSDPrice(inputCurrency);
  const outputCurrencyInterfacePrice = useUSDPrice(outputCurrency);

  useEffect(() => {
    const pool = routes[0]?.pools[0];
    setSelectedPool(pool);
  }, [routes, setSelectedPool]);

  const parsedAmounts = useMemo(
    () => ({
      [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? parsedAmount : trade?.inputAmount,
      [SWAP_FIELD.OUTPUT]: independentField === SWAP_FIELD.OUTPUT ? parsedAmount : trade?.outputAmount,
    }),
    [independentField, parsedAmount, trade],
  );

  const handleSwap = () => {
    setConfirmModalShow(true);
  };

  const handleTokenAChange = useCallback(
    (token: TokenInfo) => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap";

      if (token.canisterId === currencyB.currencyId) {
        history.push(`${prePath}?input=${token.canisterId}&output=${ICP.address}`);
      } else {
        history.push(`${prePath}?input=${token.canisterId}&output=${currencyB.currencyId}`);
      }
    },
    [currencyB],
  );

  const handleTokenBChange = useCallback(
    (token: TokenInfo) => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap";

      if (token.canisterId === currencyA.currencyId) {
        history.push(`${prePath}?input=${ICP.address}&output=${token.canisterId}`);
      } else {
        history.push(`${prePath}?input=${currencyA.currencyId}&output=${token.canisterId}`);
      }
    },
    [currencyA],
  );

  const handleInput = (value: string, type: "input" | "output") => {
    if (type === "input") {
      onUserInput(SWAP_FIELD.INPUT, value);
    } else {
      onUserInput(SWAP_FIELD.OUTPUT, value);
    }
  };

  const needImpactConfirm = useMemo(() => {
    if (!usdValueChange) return false;
    return getImpactConfirm(usdValueChange);
  }, [usdValueChange]);

  const swapCallback = useSwapCallback();

  const handleSwapConfirm = useCallback(async () => {
    if (
      (needImpactConfirm && !impactChecked) ||
      swapLoading ||
      !trade ||
      isNullArgs(subAccountTokenBalance) ||
      isNullArgs(swapTokenUnusedBalance)
    )
      return;

    const { call, key } = swapCallback({
      trade,
      subAccountTokenBalance: subAccountTokenBalance as BigNumber,
      swapInTokenUnusedBalance: swapTokenUnusedBalance as bigint,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
      },
      refresh: () => {
        setRefreshTrigger();
        setTimeout(() => {
          setRefreshTrigger();
        }, 1000);
      },
    });

    setSwapLoading(true);

    const amount0 = trade.inputAmount.toSignificant(12, { groupSeparator: "," });
    const amount1 = trade.outputAmount.toSignificant(12, { groupSeparator: "," });

    const loadingKey = openLoadingTip(
      t`Swap ${amount0} ${inputCurrency?.symbol} to ${amount1} ${outputCurrency?.symbol}`,
      {
        extraContent: <StepViewButton step={key} />,
      },
    );

    setConfirmModalShow(false);
    setSwapLoading(false);

    handleInput("", "input");
    handleInput("", "output");

    await call();

    closeLoadingTip(loadingKey);
  }, [
    needImpactConfirm,
    impactChecked,
    swapCallback,
    swapLoading,
    setSwapLoading,
    trade,
    subAccountTokenBalance,
    swapTokenUnusedBalance,
  ]);

  const maxInputAmount = useMaxAmountSpend({
    currencyAmount: currencyBalances[SWAP_FIELD.INPUT],
    poolId: tradePoolId,
  });

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
      handleClearSwapState();
    };
  }, []);

  const handleCheck = useCallback((check: boolean) => {
    setImpactChecked(check);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ui === "pro" ? "8px 0" : "22px 0" }}>
      <SwapInputWrapper
        onMaxInput={handleMaxInput}
        onInput={handleInput}
        onTokenAChange={handleTokenAChange}
        onTokenBChange={handleTokenBChange}
        tokenAPrice={inputCurrencyInterfacePrice}
        tokenBPrice={outputCurrencyInterfacePrice}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        inputCurrencyState={inputCurrencyState}
        outputCurrencyState={outputCurrencyState}
        currencyBalances={currencyBalances}
        parsedAmounts={parsedAmounts}
        tradePoolId={tradePoolId}
        ui={ui}
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
              <Grid container justifyContent="flex-start" alignItems="center">
                <CircularProgress size={14} color="inherit" />
                <Typography sx={{ margin: "0 0 0 4px" }}>Fetching price...</Typography>
              </Grid>
            ) : trade ? (
              <TradePrice
                poolId={trade.swaps[0].route.pools[0].id}
                price={trade.executionPrice}
                token0={inputCurrency}
                token1={outputCurrency}
                token0PriceUSDValue={toSignificant(inputCurrencyInterfacePrice ?? 0, 18)}
                token1PriceUSDValue={toSignificant(outputCurrencyInterfacePrice ?? 0, 18)}
                fontSize={ui === "pro" ? "12px" : undefined}
              />
            ) : null}
          </Box>
        </MainCard>
      ) : null}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSwap}
        disabled={!isValid || priceImpactTooHigh || isPoolNotChecked || (needImpactConfirm && !impactChecked)}
      >
        {swapInputError ||
          (isLoadingRoute ? (
            <Trans>Swap</Trans>
          ) : isNoRouteFound ? (
            <Trans>Insufficient liquidity for this trade.</Trans>
          ) : isPoolNotChecked ? (
            <Trans>Waiting for verifying the pool...</Trans>
          ) : priceImpactTooHigh ? (
            <Trans>High Price Impact</Trans>
          ) : priceImpactSeverity > 2 ? (
            <Trans>Swap Anyway</Trans>
          ) : (
            <Trans>Swap</Trans>
          ))}
      </Button>

      {needImpactConfirm ? (
        <Box
          sx={{ padding: ui === "pro" ? "10px" : "16px", background: "rgba(211, 98, 91, 0.15)", borderRadius: "16px" }}
        >
          <Flex gap="0 8px" align="flex-start">
            <Box>
              <Checkbox checked={impactChecked} onCheckedChange={handleCheck} />
            </Box>

            <Typography
              style={{
                color: "#D3625B",
                lineHeight: "15px",
                fontSize: "12px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => handleCheck(!impactChecked)}
            >
              <Trans>
                Price impact is too high. You would lose a significant portion of your funds in this trade. Please
                confirm if you wish to proceed with the swap.
              </Trans>
            </Typography>
          </Flex>
        </Box>
      ) : null}

      {confirmModalShow && trade && (
        <SwapConfirm
          trade={trade}
          open={confirmModalShow}
          onClose={() => setConfirmModalShow(false)}
          onConfirm={handleSwapConfirm}
          slippageTolerance={userSlippageTolerance}
          loading={swapLoading}
        />
      )}
    </Box>
  );
}
