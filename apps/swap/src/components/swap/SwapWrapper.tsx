import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { useSwapState, useSwapHandlers, useSwapInfo, useCleanSwapState, useLoadDefaultParams } from "store/swap/hooks";
import BigNumber from "bignumber.js";
import { toSignificant, isNullArgs } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { useExpertModeManager } from "store/swap/cache/hooks";
import { TradeState } from "hooks/swap/useTrade";
import { maxAmountFormat } from "utils/swap/index";
import { useSwapCallback } from "hooks/swap/useSwapCallback";
import { ExternalTipArgs } from "types/index";
import { useSuccessTip, useLoadingTip, useErrorTip } from "hooks/useTips";
import { warningSeverity } from "utils/swap/prices";
import { useUSDPrice } from "hooks/useUSDPrice";
import TradePrice from "components/swap/TradePrice";
import { Trans, t } from "@lingui/macro";
import Identity, { CallbackProps } from "components/Identity";
import Button from "components/authentication/ButtonConnector";
import { MainCard } from "@icpswap/ui";
import StepViewButton from "components/Steps/View";
import { TokenInfo } from "types/token";
import { ReclaimTips } from "components/ReclaimTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { SubAccount } from "@dfinity/ledger-icp";
import { useUserUnusedBalance, useTokenBalance } from "@icpswap/hooks";
import { useMaxAmountSpend } from "hooks/swap/useMaxAmountSpend";
import { SwapInputWrapper } from "components/swap/SwapInputWrapper";
import SwapConfirm from "components/swap/SwapConfirm";
import { useHistory } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { Reclaim, swapContext } from "components/swap/index";

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

  const [isExpertMode] = useExpertModeManager();
  const principal = useAccountPrincipal();
  const history = useHistory();
  const { setSelectedPool, refreshTrigger, setRefreshTrigger } = useContext(swapContext);

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
  } = useSwapInfo({ refresh: refreshTrigger });

  // For swap pro
  useEffect(() => {
    if (onInputTokenChange) onInputTokenChange(inputCurrency);
    if (onOutputTokenChange) onOutputTokenChange(outputCurrency);
    if (onTradePoolIdChange) onTradePoolIdChange(tradePoolId);
  }, [tradePoolId, outputCurrency, inputCurrency]);

  useEffect(() => {
    const pool = routes[0]?.pools[0];
    if (pool && setSelectedPool) {
      setSelectedPool(pool);
    }
  }, [routes, setSelectedPool]);

  const parsedAmounts = useMemo(
    () => ({
      [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? parsedAmount : trade?.inputAmount,
      [SWAP_FIELD.OUTPUT]: independentField === SWAP_FIELD.OUTPUT ? parsedAmount : trade?.outputAmount,
    }),
    [independentField, parsedAmount],
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

  const isLoadingRoute = swapState === TradeState.LOADING;
  const isNoRouteFound = swapState === TradeState.NO_ROUTE_FOUND;
  const isValid = !swapInputError && !isLoadingRoute && !isNoRouteFound;
  const isPoolNotChecked = swapState === TradeState.NOT_CHECK;

  const swapCallback = useSwapCallback();

  const [swapLoading, setSwapLoading] = useState(false);
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const inputTokenAddress = inputCurrency?.address;
  const tradePool = trade?.route.pools[0];
  const sub = useMemo(() => {
    return principal ? SubAccount.fromPrincipal(principal).toUint8Array() : undefined;
  }, [principal]);

  const { result: subAccountTokenBalance } = useTokenBalance({
    canisterId: inputTokenAddress,
    address: tradePoolId,
    sub,
    reload: refreshTrigger,
  });
  const { result: unusedBalance } = useUserUnusedBalance(tradePoolId, principal, refreshTrigger);
  const swapTokenUnusedBalance = useMemo(() => {
    if (!tradePool || !unusedBalance || !inputCurrency) return undefined;
    return tradePool.token0.address === inputCurrency.address ? unusedBalance.balance0 : unusedBalance.balance1;
  }, [tradePool, inputCurrency, unusedBalance]);

  const handleSwapConfirm = useCallback(async () => {
    if (swapLoading || !trade || isNullArgs(subAccountTokenBalance) || isNullArgs(swapTokenUnusedBalance)) return;

    const { call, key } = swapCallback({
      trade,
      subAccountTokenBalance: subAccountTokenBalance as BigNumber,
      swapInTokenUnusedBalance: swapTokenUnusedBalance as bigint,
      openExternalTip: ({ message, tipKey, poolId, tokenId }: ExternalTipArgs) => {
        openErrorTip(<ReclaimTips message={message} tipKey={tipKey} tokenId={tokenId} poolId={poolId} />);
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

    const result = await call();

    closeLoadingTip(loadingKey);

    if (result) {
      openSuccessTip(t`Swapped Successfully`);
      setRefreshTrigger();
      setTimeout(() => {
        setRefreshTrigger();
      }, 1000);
    }
  }, [swapCallback, swapLoading, setSwapLoading, trade, subAccountTokenBalance, swapTokenUnusedBalance]);

  const maxInputAmount = useMaxAmountSpend({
    currencyAmount: currencyBalances[SWAP_FIELD.INPUT],
    poolId: tradePoolId,
  });

  const handleMaxInput = useCallback(() => {
    if (maxInputAmount) {
      onUserInput(SWAP_FIELD.INPUT, maxAmountFormat(maxInputAmount.toExact(), maxInputAmount.currency.decimals));
    }
  }, [maxInputAmount, onUserInput]);

  // const fiatValueInput = useUSDValue(parsedAmounts[SWAP_FIELD.INPUT]);
  // const fiatValueOutput = useUSDValue(parsedAmounts[SWAP_FIELD.OUTPUT]);
  // const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);
  const priceImpact = undefined;

  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;

    return warningSeverity(
      executionPriceImpact && !!priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact,
    );
  }, [priceImpact, trade]);

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;
  // const priceImpactTooHigh = priceImpactSeverity > 3;

  useEffect(() => {
    return () => {
      handleClearSwapState();
    };
  }, []);

  const inputCurrencyInterfacePrice = useUSDPrice(inputCurrency);
  const outputCurrencyInterfacePrice = useUSDPrice(outputCurrency);

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
        disabled={!isValid || priceImpactTooHigh || isPoolNotChecked}
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

      {ui === "pro" ? <Reclaim fontSize="12px" /> : null}

      {confirmModalShow && trade && (
        <Identity onSubmit={handleSwapConfirm}>
          {({ submit }: CallbackProps) => (
            <SwapConfirm
              trade={trade}
              open={confirmModalShow}
              onClose={() => setConfirmModalShow(false)}
              onConfirm={submit}
              slippageTolerance={userSlippageTolerance}
              loading={swapLoading}
            />
          )}
        </Identity>
      )}
    </Box>
  );
}
