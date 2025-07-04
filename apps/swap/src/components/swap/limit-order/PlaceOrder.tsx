import { useState, useCallback, useEffect, useContext, forwardRef, Ref, useImperativeHandle, useRef } from "react";
import { Box } from "components/Mui";
import { useLimitOrderInfo } from "store/swap/limit-order/hooks";
import { useLoadDefaultParams, useCleanSwapState, useSwapState, useSwapHandlers } from "store/swap/hooks";
import { isUndefinedOrNull, locationMultipleSearchReplace, nonUndefinedOrNull } from "@icpswap/utils";
import { SWAP_FIELD } from "constants/swap";
import { SWAP_LIMIT_REFRESH_KEY, USER_LIMIT_ORDERS_KEY } from "constants/limit";
import { TradeState } from "hooks/swap/useTrade";
import { getBackendLimitTick, maxAmountFormat } from "utils/swap/index";
import { usePlaceOrderCallback, useLimitSupported } from "hooks/swap/limit-order";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { useUSDPrice } from "hooks/useUSDPrice";
import { AuthButton } from "components/index";
import StepViewButton from "components/Steps/View";
import { ReclaimTips } from "components/ReclaimTips";
import { SwapInputWrapper } from "components/swap/limit-order/index";
import { useHistory, useLocation } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useGlobalContext, useRefreshTrigger } from "hooks/index";
import { useTranslation } from "react-i18next";

import { LimitOrderConfirm } from "./LimitOrderConfirm";
import { SwapLimitPrice, LimitPriceRef } from "./Price";
import { LimitContext } from "./context";
import { CurrentPricePanel } from "./CurrentPricePanel";
import { PriceError } from "./PriceError";
import { LimitSupported } from "./LimitSupported";

export interface PlaceOrderRef {
  setInputAmount: (amount: string) => void;
}

export interface PlaceOrderProps {
  ui?: "pro" | "normal";
  onInputTokenChange?: (token: Token | undefined) => void;
  onOutputTokenChange?: (tokenId: Token | undefined) => void;
  onTradePoolIdChange?: (poolId: string) => void;
}

export const PlaceOrder = forwardRef(
  (
    { ui = "normal", onInputTokenChange, onOutputTokenChange, onTradePoolIdChange }: PlaceOrderProps,
    ref: Ref<PlaceOrderRef>,
  ) => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const [openErrorTip] = useErrorTip();
    const [openLoadingTip, closeLoadingTip] = useLoadingTip();
    const { setSelectedPool, setNoLiquidity, setInputToken, setOutputToken } = useContext(LimitContext);
    const { setRefreshTriggers } = useGlobalContext();
    const { onUserInput, onSwitchTokens } = useSwapHandlers();
    const clearSwapState = useCleanSwapState();
    const refreshTrigger = useRefreshTrigger(SWAP_LIMIT_REFRESH_KEY);

    useLoadDefaultParams();

    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [swapLoading, setSwapLoading] = useState(false);
    const { [SWAP_FIELD.INPUT]: inputTokenId, [SWAP_FIELD.OUTPUT]: outputTokenId } = useSwapState();
    const limitPriceRef = useRef<LimitPriceRef>();

    const {
      inputError: swapInputError,
      trade,
      poolId,
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
      currentPrice,
      orderPriceTick,
      position,
      orderPrice,
      setOrderPrice,
      minUseableTick,
      isInputTokenSorted,
      pool,
      minSettableTick,
      atLimitedTick,
      parsedAmounts,
    } = useLimitOrderInfo({ refresh: refreshTrigger });

    const available = useLimitSupported({ canisterId: pool?.id });

    // For swap pro
    useEffect(() => {
      if (onInputTokenChange) onInputTokenChange(inputToken);
      if (onOutputTokenChange) onOutputTokenChange(outputToken);
      if (onTradePoolIdChange && poolId) onTradePoolIdChange(poolId);
    }, [poolId, outputToken, inputToken]);

    const isLoadingRoute = swapState === TradeState.LOADING;
    const isNoRouteFound = swapState === TradeState.NO_ROUTE_FOUND;
    const invalid = nonUndefinedOrNull(swapInputError) || swapState !== TradeState.VALID;
    const isPoolNotChecked = swapState === TradeState.NOT_CHECK;

    const inputCurrencyInterfacePrice = useUSDPrice(inputToken);
    const outputCurrencyInterfacePrice = useUSDPrice(outputToken);

    useEffect(() => {
      setSelectedPool(pool);
      setNoLiquidity(noLiquidity);
    }, [pool, setSelectedPool, noLiquidity]);

    useEffect(() => {
      setInputToken(inputToken);
      setOutputToken(outputToken);
    }, [inputToken, outputToken, setInputToken, setOutputToken]);

    const handleShowConfirmModal = useCallback(() => {
      setConfirmModalShow(true);
    }, []);

    const handleTokenAChange = useCallback(
      (token: Token) => {
        const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";

        let search = location.search;

        if (token.address === outputTokenId) {
          search = locationMultipleSearchReplace(location.search, [
            { key: "input", value: token.address },
            { key: "output", value: ICP.address },
          ]);
        } else {
          search = locationMultipleSearchReplace(location.search, [
            { key: "input", value: token.address },
            { key: "output", value: outputTokenId },
          ]);
        }

        history.push(`${prePath}${search}`);
      },
      [outputTokenId],
    );

    const handleTokenBChange = useCallback(
      (token: Token) => {
        const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";
        let search = location.search;

        if (token.address === inputTokenId) {
          search = locationMultipleSearchReplace(location.search, [
            { key: "input", value: ICP.address },
            { key: "output", value: token.address },
          ]);
        } else {
          search = locationMultipleSearchReplace(location.search, [
            { key: "input", value: inputTokenId },
            { key: "output", value: token.address },
          ]);
        }

        history.push(`${prePath}${search}`);
      },
      [inputTokenId, location],
    );

    const handleInput = (value: string, type: "input" | "output") => {
      if (type === "input") {
        onUserInput(SWAP_FIELD.INPUT, value);
      } else if (type === "output") {
        onUserInput(SWAP_FIELD.OUTPUT, value);
      }
    };

    const placeOrderCallback = usePlaceOrderCallback();

    const handlePlaceOrder = useCallback(async () => {
      if (
        swapLoading ||
        !trade ||
        isUndefinedOrNull(inputToken) ||
        isUndefinedOrNull(outputToken) ||
        isUndefinedOrNull(unusedBalance) ||
        isUndefinedOrNull(position) ||
        isUndefinedOrNull(token0Balance) ||
        isUndefinedOrNull(token1Balance) ||
        isUndefinedOrNull(token0SubAccountBalance) ||
        isUndefinedOrNull(token1SubAccountBalance) ||
        isUndefinedOrNull(orderPriceTick) ||
        isUndefinedOrNull(inputToken)
      )
        return;

      const limitTick = getBackendLimitTick(position);

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
          setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
          setTimeout(() => {
            setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
          }, 1000);
        },
      });

      setSwapLoading(true);

      const amount0 = trade.inputAmount.toSignificant(6, { groupSeparator: "," });

      const loadingKey = openLoadingTip(
        t("limit.submit.loading", {
          amount: `${amount0} ${inputToken.symbol}`,
          pair: `${inputToken.symbol}/${outputToken.symbol}`,
        }),
        {
          extraContent: <StepViewButton step={key} />,
        },
      );

      setConfirmModalShow(false);
      setSwapLoading(false);

      handleInput("", "input");
      handleInput("", "output");

      const addSuccessful = await call();

      if (addSuccessful) {
        setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
        setRefreshTriggers(USER_LIMIT_ORDERS_KEY);
      }

      if (limitPriceRef?.current) {
        limitPriceRef.current.resetInverted();
        limitPriceRef.current.setDefaultPrice();
      }

      closeLoadingTip(loadingKey);
    }, [
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
      outputToken,
      orderPriceTick,
      limitPriceRef,
    ]);

    const handleMaxInput = useCallback(() => {
      if (maxInputAmount) {
        onUserInput(SWAP_FIELD.INPUT, maxAmountFormat(maxInputAmount.toExact(), maxInputAmount.currency.decimals));
      }
    }, [maxInputAmount, onUserInput]);

    useEffect(() => {
      return () => {
        clearSwapState();
      };
    }, []);

    const handleSwitchTokens = useCallback(() => {
      const prePath = ui === "pro" ? "/swap/pro" : "/swap/limit";

      const search = locationMultipleSearchReplace(location.search, [
        { key: "input", value: outputTokenId },
        { key: "output", value: inputTokenId },
      ]);

      history.push(`${prePath}${search}`);

      onSwitchTokens();

      handleInput("", "input");
      setOrderPrice(null);
      if (limitPriceRef?.current) {
        limitPriceRef?.current?.resetInverted();
        limitPriceRef?.current?.setDefaultPrice();
      }
    }, [ui, history, location, limitPriceRef, outputTokenId, inputTokenId]);

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
          poolId={poolId}
          ui={ui}
          inputTokenSubBalance={inputTokenSubBalance}
          outputTokenSubBalance={outputTokenSubBalance}
          inputTokenUnusedBalance={inputTokenUnusedBalance}
          outputTokenUnusedBalance={outputTokenUnusedBalance}
          maxInputAmount={maxInputAmount}
          noLiquidity={noLiquidity}
          onSwitchTokens={handleSwitchTokens}
          orderPrice={orderPrice}
        />

        <SwapLimitPrice
          ref={limitPriceRef}
          ui={ui}
          orderPrice={orderPrice}
          onInputOrderPrice={setOrderPrice}
          inputToken={inputToken}
          outputToken={outputToken}
          currentPrice={currentPrice}
          minUseableTick={minUseableTick}
          isInputTokenSorted={isInputTokenSorted}
          atLimitedTick={atLimitedTick}
          available={available === true && noLiquidity === false}
        />

        <CurrentPricePanel
          inputToken={inputToken}
          outputToken={outputToken}
          currentPrice={currentPrice}
          fontSize={ui === "normal" ? 14 : 12}
        />

        <PriceError
          inputToken={inputToken}
          outputToken={outputToken}
          currentPrice={currentPrice}
          orderPriceTick={orderPriceTick}
          minSettableTick={minSettableTick}
          ui={ui}
        />

        <LimitSupported available={available} noLiquidity={noLiquidity} ui={ui} />

        <AuthButton
          fullWidth
          variant="contained"
          size="large"
          onClick={handleShowConfirmModal}
          disabled={invalid || isPoolNotChecked || !available}
          sx={{
            borderRadius: "16px",
          }}
        >
          {swapInputError ||
            (isLoadingRoute
              ? t("swap.loading.route")
              : isNoRouteFound
              ? t("swap.no.route")
              : isPoolNotChecked
              ? t("swap.waiting.verifying")
              : t("limit.submit"))}
        </AuthButton>

        {confirmModalShow && parsedAmounts[SWAP_FIELD.INPUT] && (
          <LimitOrderConfirm
            open={confirmModalShow}
            onClose={() => setConfirmModalShow(false)}
            onConfirm={handlePlaceOrder}
            inputTokenUnusedBalance={inputTokenUnusedBalance}
            inputTokenSubBalance={inputTokenSubBalance}
            inputTokenBalance={inputTokenBalance}
            orderPrice={orderPrice}
            currentPrice={currentPrice}
            inputToken={inputToken}
            outputToken={outputToken}
            inputAmount={parsedAmounts[SWAP_FIELD.INPUT].toExact()}
          />
        )}
      </Box>
    );
  },
);
