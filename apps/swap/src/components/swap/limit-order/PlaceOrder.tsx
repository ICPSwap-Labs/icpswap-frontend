import { useState, useCallback, useMemo, useEffect, useContext, forwardRef, Ref, useImperativeHandle } from "react";
import { Box, Typography } from "components/Mui";
import {
  useSwapState,
  useSwapHandlers,
  useLimitOrderInfo,
  useCleanSwapState,
  useLoadDefaultParams,
} from "store/swap/limit-order/hooks";
import { toSignificant, isNullArgs, BigNumber } from "@icpswap/utils";
import { SWAP_FIELD, SWAP_REFRESH_KEY, DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID } from "constants/swap";
import { useExpertModeManager } from "store/swap/cache/hooks";
import { TradeState } from "hooks/swap/useTrade";
import { getBackendLimitTick, maxAmountFormat } from "utils/swap/index";
import { usePlaceOrderCallback } from "hooks/swap/limit-order/usePlaceOrderCallback";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { warningSeverity, getImpactConfirm } from "utils/swap/prices";
import { useUSDPrice } from "hooks/useUSDPrice";
import { Trans, t } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import { Flex, Checkbox } from "@icpswap/ui";
import StepViewButton from "components/Steps/View";
import { TokenInfo } from "types/token";
import { ReclaimTips } from "components/ReclaimTips";
import { SwapInputWrapper } from "components/swap/limit-order/index";
import { useHistory, useLocation } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useGlobalContext, useRefreshTrigger } from "hooks/index";
import qs from "qs";
import { useLimitOrderSwap, usePlaceOrderPosition } from "hooks/swap/limit-order";

import { LimitOrderConfirm } from "./LimitOrderConfirm";
import { SwapLimitPrice } from "./Price";
import { LimitContext } from "./context";

export interface PlaceOrderRef {
  setInputAmount: (amount: string) => void;
}

export interface PlaceOrderProps {
  ui?: "pro" | "normal";
  onInputTokenChange?: (token: Token | undefined) => void;
  onOutputTokenChange?: (tokenId: Token | undefined) => void;
  onTradePoolIdChange?: (poolId: string | undefined) => void;
}

export const PlaceOrder = forwardRef(
  (
    { ui = "normal", onInputTokenChange, onOutputTokenChange, onTradePoolIdChange }: PlaceOrderProps,
    ref: Ref<PlaceOrderRef>,
  ) => {
    const history = useHistory();
    const location = useLocation();
    const [openErrorTip] = useErrorTip();
    const [openLoadingTip, closeLoadingTip] = useLoadingTip();
    const [isExpertMode] = useExpertModeManager();
    const { setSelectedPool, setNoLiquidity, usdValueChange, setInputToken, setOutputToken } = useContext(LimitContext);
    const { setRefreshTriggers } = useGlobalContext();
    const { onUserInput } = useSwapHandlers();
    const handleClearSwapState = useCleanSwapState();
    const refreshTrigger = useRefreshTrigger(SWAP_REFRESH_KEY);

    useLoadDefaultParams();

    const [impactChecked, setImpactChecked] = useState(false);
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [swapLoading, setSwapLoading] = useState(false);

    const { orderPrice, handleInputOrderPrice } = useLimitOrderSwap();

    const { [SWAP_FIELD.INPUT]: currencyA, [SWAP_FIELD.OUTPUT]: currencyB, independentField } = useSwapState();

    const {
      inputError: swapInputError,
      parsedAmount,
      trade,
      tradePoolId,
      routes,
      pool,
      state: swapState,
      currencyBalances,
      inputToken,
      outputToken,
      inputCurrencyState,
      outputCurrencyState,
      inputTokenUnusedBalance,
      inputTokenSubBalance,
      outputTokenSubBalance,
      outputTokenUnusedBalance,
      inputTokenBalance,
      maxInputAmount,
      noLiquidity,
      unusedBalance,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
    } = useLimitOrderInfo({ refresh: refreshTrigger });

    const { position, orderPriceTick } = usePlaceOrderPosition({
      pool,
      inputToken,
      orderPrice,
    });

    console.log("position.amount0: ", position?.amount0.toExact());
    console.log("position.amount1: ", position?.amount1.toExact());

    // For swap pro
    useEffect(() => {
      if (onInputTokenChange) onInputTokenChange(inputToken);
      if (onOutputTokenChange) onOutputTokenChange(outputToken);
      if (onTradePoolIdChange) onTradePoolIdChange(tradePoolId);
    }, [tradePoolId, outputToken, inputToken]);

    const isLoadingRoute = swapState === TradeState.LOADING;
    const isNoRouteFound = swapState === TradeState.NO_ROUTE_FOUND;
    const isValid = !swapInputError && !isLoadingRoute && !isNoRouteFound;
    const isPoolNotChecked = swapState === TradeState.NOT_CHECK;

    const inputCurrencyInterfacePrice = useUSDPrice(inputToken);
    const outputCurrencyInterfacePrice = useUSDPrice(outputToken);

    useEffect(() => {
      const pool = routes[0]?.pools[0];
      setSelectedPool(pool);
      setNoLiquidity(noLiquidity);
    }, [routes, setSelectedPool, noLiquidity]);

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

    const handleShowConfirmModal = useCallback(() => {
      setConfirmModalShow(true);
    }, []);

    const handleTokenAChange = useCallback(
      (token: TokenInfo) => {
        const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";

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
        const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";
        const search = qs.parse(location.search.replace("?", ""));

        if (token.canisterId === currencyA.currencyId) {
          search.input = ICP.address;
          search.output = token.canisterId;
        } else {
          search.input = currencyA.currencyId;
          search.output = token.canisterId;
        }

        history.push(`${prePath}?${qs.stringify(search)}`);
      },
      [currencyA, location],
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

    const placeOrderCallback = usePlaceOrderCallback();

    const handlePlaceOrder = useCallback(async () => {
      if (
        (needImpactConfirm && !impactChecked) ||
        swapLoading ||
        !trade ||
        isNullArgs(unusedBalance) ||
        isNullArgs(position) ||
        isNullArgs(token0Balance) ||
        isNullArgs(token1Balance) ||
        isNullArgs(token0SubAccountBalance) ||
        isNullArgs(token1SubAccountBalance) ||
        isNullArgs(orderPriceTick) ||
        isNullArgs(inputToken)
      )
        return;

      const limitTick = getBackendLimitTick(orderPriceTick, position.pool);

      const { call, key } = placeOrderCallback({
        inputToken,
        position,
        token0Balance,
        token0SubAccountBalance,
        token1Balance,
        token1SubAccountBalance,
        unusedBalance,
        limitLick: BigInt(limitTick),
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

      const loadingKey = openLoadingTip(t`Add ${amount0} ${inputToken?.symbol} and ${amount1} ${outputToken?.symbol}`, {
        extraContent: <StepViewButton step={key} />,
      });

      setConfirmModalShow(false);
      setSwapLoading(false);

      handleInput("", "input");
      handleInput("", "output");

      await call();

      closeLoadingTip(loadingKey);
    }, [
      needImpactConfirm,
      impactChecked,
      placeOrderCallback,
      swapLoading,
      setSwapLoading,
      trade,
      setRefreshTriggers,
      orderPrice,
      unusedBalance,
      position,
      token0Balance,
      token1Balance,
      token0SubAccountBalance,
      token1SubAccountBalance,
      inputToken,
      orderPriceTick,
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
        handleClearSwapState();
      };
    }, []);

    const handleCheck = useCallback((check: boolean) => {
      setImpactChecked(check);
    }, []);

    const handleSwitchTokens = useCallback(() => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";
      const search = qs.parse(location.search.replace("?", ""));

      const newSearch: { [key: string]: string | undefined } = {};

      if (search.output) {
        newSearch.input = search.output as string | undefined;
      } else {
        newSearch.input = DEFAULT_SWAP_OUTPUT_ID;
      }

      if (search.input) {
        newSearch.output = search.input as string | undefined;
      } else {
        newSearch.output = DEFAULT_SWAP_INPUT_ID;
      }

      history.push(`${prePath}?${qs.stringify(newSearch)}`);
    }, [ui, history, location]);

    useImperativeHandle(
      ref,
      () => ({
        setInputAmount: (value: string) => handleInput(value, "input"),
      }),
      [handleInput],
    );

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: ui === "pro" ? "6px 0" : "6px 0" }}>
        <SwapInputWrapper
          onMaxInput={handleMaxInput}
          onInput={handleInput}
          onTokenAChange={handleTokenAChange}
          onTokenBChange={handleTokenBChange}
          tokenAPrice={inputCurrencyInterfacePrice}
          tokenBPrice={outputCurrencyInterfacePrice}
          inputToken={inputToken}
          outputToken={outputToken}
          inputCurrencyState={inputCurrencyState}
          outputCurrencyState={outputCurrencyState}
          currencyBalances={currencyBalances}
          parsedAmounts={parsedAmounts}
          poolId={tradePoolId}
          ui={ui}
          inputTokenSubBalance={inputTokenSubBalance}
          outputTokenSubBalance={outputTokenSubBalance}
          inputTokenUnusedBalance={inputTokenUnusedBalance}
          outputTokenUnusedBalance={outputTokenUnusedBalance}
          maxInputAmount={maxInputAmount}
          noLiquidity={noLiquidity}
          onSwitchTokens={handleSwitchTokens}
        />

        <SwapLimitPrice ui={ui} trade={trade} orderPrice={orderPrice} onInputOrderPrice={handleInputOrderPrice} />

        {needImpactConfirm ? (
          <Box
            sx={{
              padding: ui === "pro" ? "10px" : "16px",
              background: "rgba(211, 98, 91, 0.15)",
              borderRadius: "16px",
            }}
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

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleShowConfirmModal}
          disabled={!isValid || priceImpactTooHigh || isPoolNotChecked || (needImpactConfirm && !impactChecked)}
          sx={{
            borderRadius: "16px",
          }}
        >
          {swapInputError ||
            (isLoadingRoute ? (
              <Trans>Submit Limit Order</Trans>
            ) : isNoRouteFound ? (
              <Trans>Insufficient liquidity for this trade.</Trans>
            ) : isPoolNotChecked ? (
              <Trans>Waiting for verifying the pool...</Trans>
            ) : priceImpactTooHigh ? (
              <Trans>High Price Impact</Trans>
            ) : priceImpactSeverity > 2 ? (
              <Trans>Swap Anyway</Trans>
            ) : (
              <Trans>Submit Limit Order</Trans>
            ))}
        </Button>

        {confirmModalShow && trade && (
          <LimitOrderConfirm
            trade={trade}
            open={confirmModalShow}
            onClose={() => setConfirmModalShow(false)}
            onConfirm={handlePlaceOrder}
            loading={swapLoading}
            inputTokenUnusedBalance={inputTokenUnusedBalance}
            inputTokenSubBalance={inputTokenSubBalance}
            inputTokenBalance={inputTokenBalance}
          />
        )}
      </Box>
    );
  },
);
