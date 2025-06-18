import { useMemo } from "react";
import { TradeType } from "@icpswap/constants";
import { CurrencyAmount, Trade, Token, Route } from "@icpswap/swap-sdk";
import { tryParseAmount } from "utils/swap";
import { BigNumber } from "bignumber.js";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { useQuoteExactInput, useSwapPoolAvailable } from "hooks/swap/v3Calls";
import { useAllRoutes } from "hooks/swap/useAllRoutes";

export enum TradeState {
  LOADING = "LOADING",
  INVALID = "INVALID",
  NO_ROUTE_FOUND = "NO_ROUTE_FOUND",
  VALID = "VALID",
  SYNCING = "SYNCING",
  NOT_CHECK = "NOT_CHECK",
}

export function useBestTrade(
  inputToken: Token | undefined,
  outputToken: Token | undefined,
  typedValue: string | undefined,
) {
  const actualSwapValue = typedValue;

  // reload when typeValue is changed
  const { routes, loading: routesLoading, checked, noLiquidity } = useAllRoutes(inputToken, outputToken);

  const zeroForOne = inputToken && outputToken ? inputToken.sortsBefore(outputToken) : undefined;

  const pool = useMemo(() => {
    if (!routes) return undefined;
    return routes[0]?.pools[0];
  }, [routes]);

  const params = useMemo(() => {
    if (!actualSwapValue || zeroForOne === undefined || !pool) return undefined;

    const route = routes
      .sort((a, b) => {
        if (a.midPrice.greaterThan(b.midPrice)) return -1;
        if (a.midPrice.lessThan(b.midPrice)) return 1;
        return 0;
      })
      .map((route) => {
        const inputToken = route.input.wrapped;
        const outputToken = route.output.wrapped;

        // A transaction fee need be subtracted if then token use icrc_transfer to deposit token in v3.6
        const quoteAmount = !actualSwapValue
          ? "0"
          : numberToString(formatTokenAmount(actualSwapValue, inputToken.decimals));

        return {
          pool: pool.id,
          tokenIn: inputToken.address,
          tokenOut: outputToken.address,
          amountIn: quoteAmount,
          feeAmount: pool.fee,
        };
      });

    if (!route[0]) return undefined;

    return JSON.stringify({
      poolId: route[0].pool,
      amountIn: route[0].amountIn,
      zeroForOne,
    });
  }, [routes, pool, actualSwapValue]);

  const available = useSwapPoolAvailable(pool?.id);

  const { loading: exactInputLoading, result: _quotesResults } = useQuoteExactInput(params);

  const quotesResults = useMemo(() => {
    if (_quotesResults) {
      return [{ amountOut: `0x${new BigNumber(String(_quotesResults)).toString(16)}` }];
    }
    return [];
  }, [_quotesResults, exactInputLoading]);

  return useMemo(() => {
    if (
      !inputToken ||
      !outputToken ||
      inputToken.equals(outputToken) ||
      !actualSwapValue ||
      new BigNumber(actualSwapValue).isEqualTo(0)
    ) {
      return {
        state: TradeState.INVALID,
        trade: null,
        pool,
        routes,
        noLiquidity,
      };
    }

    if (routesLoading || exactInputLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
        pool,
        routes,
        noLiquidity,
      };
    }

    const { bestRoute, amountOut } = quotesResults.reduce(
      (currentBest: { bestRoute: Route<Token, Token> | null; amountOut: string | null }, { amountOut }, i) => {
        if (!amountOut) return currentBest;

        if (currentBest.amountOut === null) {
          return {
            bestRoute: routes[i],
            amountOut,
          };
        }
        if (new BigNumber(currentBest.amountOut).isLessThan(amountOut)) {
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

    const inputAmount = tryParseAmount(actualSwapValue, inputToken);

    if (!bestRoute || !amountOut || !inputAmount) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: null,
        pool,
        routes,
        noLiquidity,
      };
    }

    return {
      state: checked ? TradeState.VALID : TradeState.NOT_CHECK,
      available,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount,
        outputAmount: CurrencyAmount.fromRawAmount(outputToken, amountOut.toString()),
      }),
      pool,
      routes,
      noLiquidity,
    };
  }, [
    inputToken,
    outputToken,
    actualSwapValue,
    quotesResults,
    routes,
    routesLoading,
    available,
    checked,
    pool,
    noLiquidity,
  ]);
}
