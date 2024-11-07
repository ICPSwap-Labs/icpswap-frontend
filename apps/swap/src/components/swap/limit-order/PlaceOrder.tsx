import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
} from "react";
import { Box } from "components/Mui";
import {
  useLimitState,
  useLimitHandlers,
  useLimitOrderInfo,
  useCleanSwapState,
  useLoadDefaultParams,
} from "store/swap/limit-order/hooks";
import { isNullArgs } from "@icpswap/utils";
import { SWAP_FIELD, SWAP_LIMIT_REFRESH_KEY, DEFAULT_SWAP_INPUT_ID, DEFAULT_SWAP_OUTPUT_ID } from "constants/swap";
import { TradeState } from "hooks/swap/useTrade";
import { getBackendLimitTick, maxAmountFormat } from "utils/swap/index";
import { usePlaceOrderCallback } from "hooks/swap/limit-order/usePlaceOrderCallback";
import { ExternalTipArgs } from "types/index";
import { useLoadingTip, useErrorTip } from "hooks/useTips";
import { useUSDPrice } from "hooks/useUSDPrice";
import { Trans, t } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import StepViewButton from "components/Steps/View";
import { TokenInfo } from "types/token";
import { ReclaimTips } from "components/ReclaimTips";
import { SwapInputWrapper } from "components/swap/limit-order/index";
import { useHistory, useLocation } from "react-router-dom";
import { ICP } from "@icpswap/tokens";
import { Token } from "@icpswap/swap-sdk";
import { useGlobalContext, useRefreshTrigger } from "hooks/index";
import qs from "qs";

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
    const { setSelectedPool, setNoLiquidity, setInputToken, setOutputToken, setInverted } = useContext(LimitContext);
    const { setRefreshTriggers } = useGlobalContext();
    const { onUserInput } = useLimitHandlers();
    const handleClearSwapState = useCleanSwapState();
    const refreshTrigger = useRefreshTrigger(SWAP_LIMIT_REFRESH_KEY);

    useLoadDefaultParams();

    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [swapLoading, setSwapLoading] = useState(false);
    const { [SWAP_FIELD.INPUT]: currencyA, [SWAP_FIELD.OUTPUT]: currencyB, independentField } = useLimitState();
    const limitPriceRef = useRef<LimitPriceRef>();

    const {
      inputError: swapInputError,
      parsedAmount,
      trade,
      tradePoolId,
      routes,
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
      outputAmount,
    } = useLimitOrderInfo({ refresh: refreshTrigger });

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

    const pool = useMemo(() => {
      return routes[0]?.pools[0];
    }, [routes]);

    useEffect(() => {
      setSelectedPool(pool);
      setNoLiquidity(noLiquidity);
    }, [pool, setSelectedPool, noLiquidity]);

    useEffect(() => {
      setInputToken(inputToken);
      setOutputToken(outputToken);
    }, [inputToken, outputToken, setInputToken, setOutputToken]);

    const parsedAmounts = useMemo(
      () => ({
        [SWAP_FIELD.INPUT]: independentField === SWAP_FIELD.INPUT ? parsedAmount : trade?.inputAmount,
        [SWAP_FIELD.OUTPUT]: outputAmount,
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
      }
    };

    const placeOrderCallback = usePlaceOrderCallback();

    const handlePlaceOrder = useCallback(async () => {
      if (
        swapLoading ||
        !trade ||
        isNullArgs(inputToken) ||
        isNullArgs(outputToken) ||
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
          setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
          setTimeout(() => {
            setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
          }, 1000);
        },
      });

      setSwapLoading(true);

      const amount0 = trade.inputAmount.toSignificant(6, { groupSeparator: "," });

      const loadingKey = openLoadingTip(
        t`Submit a limit order of ${amount0} ${inputToken.symbol} for the ${inputToken.symbol}/${outputToken.symbol} trading pair`,
        {
          extraContent: <StepViewButton step={key} />,
        },
      );

      setConfirmModalShow(false);
      setSwapLoading(false);

      handleInput("", "input");
      handleInput("", "output");
      setOrderPrice("");
      setInverted(false);

      const addSuccessful = await call();

      if (addSuccessful) {
        setRefreshTriggers(SWAP_LIMIT_REFRESH_KEY);
        limitPriceRef?.current?.setDefaultPrice();
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
        handleClearSwapState();
      };
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
      handleInput("", "input");
      setOrderPrice(null);
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
        />

        <CurrentPricePanel inputToken={inputToken} outputToken={outputToken} currentPrice={currentPrice} />

        <PriceError
          inputToken={inputToken}
          outputToken={outputToken}
          currentPrice={currentPrice}
          minUseableTick={minUseableTick}
          orderPriceTick={orderPriceTick}
        />

        <LimitSupported />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleShowConfirmModal}
          disabled={!isValid || isPoolNotChecked}
          sx={{
            borderRadius: "16px",
          }}
        >
          {swapInputError ||
            (isLoadingRoute ? (
              <Trans>Submit Limit Order</Trans>
            ) : isNoRouteFound ? (
              <Trans>No route for this trade.</Trans>
            ) : isPoolNotChecked ? (
              <Trans>Waiting for verifying the pool...</Trans>
            ) : (
              <Trans>Submit Limit Order</Trans>
            ))}
        </Button>

        {confirmModalShow && trade && (
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
            inputAmount={trade.inputAmount.toExact()}
          />
        )}
      </Box>
    );
  },
);
