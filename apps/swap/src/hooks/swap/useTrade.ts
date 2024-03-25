import { useMemo } from "react";
import { TradeType } from "@icpswap/constants";
import { CurrencyAmount, Trade, Currency, Route } from "@icpswap/swap-sdk";
import { tryParseAmount } from "utils/swap";
import { BigNumber } from "bignumber.js";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { useQuoteExactInput , useSwapPoolAvailable } from "hooks/swap/v3Calls";
import { useActualSwapAmount } from "hooks/swap/index";
import { useAllRoutes } from "./useAllRoutes";

export enum TradeState {
  LOADING = "LOADING",
  INVALID = "INVALID",
  NO_ROUTE_FOUND = "NO_ROUTE_FOUND",
  VALID = "VALID",
  SYNCING = "SYNCING",
  NOT_CHECK = "NOT_CHECK",
}

export function useBestTrade(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined,
) {
  const actualSwapValue = useActualSwapAmount(typedValue, inputCurrency);

  // reload when typeValue is changed
  const { routes, loading: routesLoading, checked } = useAllRoutes(inputCurrency, outputCurrency);

  const zeroForOne =
    inputCurrency && outputCurrency ? inputCurrency.wrapped.sortsBefore(outputCurrency.wrapped) : undefined;

  const tradePoolId = useMemo(() => {
    if (!routes) return undefined;
    return routes[0]?.pools[0]?.id;
  }, [routes]);

  const params = useMemo(() => {
    if (!actualSwapValue || zeroForOne === undefined) return undefined;

    const route = routes
      .sort((a, b) => {
        if (a.midPrice.greaterThan(b.midPrice)) return -1;
        if (a.midPrice.lessThan(b.midPrice)) return 1;
        return 0;
      })
      .map((route) => {
        return {
          pool: route.pools[0]?.id,
          tokenIn: route.input?.wrapped?.address,
          tokenOut: route.output?.wrapped?.address,
          amountIn: actualSwapValue ? numberToString(formatTokenAmount(actualSwapValue, route.input?.decimals)) : "0",
          feeAmount: route.pools[0]?.fee,
        };
      });

    if (!route[0]) return undefined;

    return JSON.stringify({
      poolId: route[0].pool,
      amountIn: route[0].amountIn,
      zeroForOne,
    });
  }, [routes, actualSwapValue]);

  const available = useSwapPoolAvailable(tradePoolId);

  const { loading: exactInputLoading, result: _quotesResults } = useQuoteExactInput(params);

  const quotesResults = useMemo(() => {
    if (_quotesResults) {
      return [{ amountOut: `0x${new BigNumber(String(_quotesResults)).toString(16)}` }];
    }
    return [];
  }, [_quotesResults, exactInputLoading]);

  return useMemo(() => {
    if (
      !inputCurrency ||
      !outputCurrency ||
      inputCurrency.equals(outputCurrency) ||
      !actualSwapValue ||
      new BigNumber(actualSwapValue).isEqualTo(0)
    ) {
      return {
        state: TradeState.INVALID,
        trade: null,
        tradePoolId,
      };
    }

    if (routesLoading || exactInputLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
        tradePoolId,
      };
    }

    const { bestRoute, amountOut } = quotesResults.reduce(
      (currentBest: { bestRoute: Route<Currency, Currency> | null; amountOut: string | null }, { amountOut }, i) => {
        if (!amountOut) return currentBest;

        if (currentBest.amountOut === null) {
          return {
            bestRoute: routes[i],
            amountOut,
          };
        } if (new BigNumber(currentBest.amountOut).isLessThan(amountOut)) {
          return {
            bestRoute: routes[i],
            amountOut,
          };
        }

        return currentBest;
      },
      {
        bestRoute: null,
        amountOut: null,
      },
    );

    if (!bestRoute || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: null,
        tradePoolId,
      };
    }

    return {
      state: checked ? TradeState.VALID : TradeState.NOT_CHECK,
      available,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: tryParseAmount(actualSwapValue, inputCurrency)!,
        outputAmount: CurrencyAmount.fromRawAmount(outputCurrency, amountOut.toString()),
      }),
      tradePoolId,
    };
  }, [
    inputCurrency,
    actualSwapValue,
    outputCurrency,
    quotesResults,
    routes,
    routesLoading,
    available,
    checked,
    tradePoolId,
  ]);
}
