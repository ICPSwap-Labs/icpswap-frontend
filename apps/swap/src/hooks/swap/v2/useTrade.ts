import { useMemo } from "react";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { TradeType } from "@icpswap/constants";
import { CurrencyAmount, Trade, Token, Route } from "@icpswap/swap-sdk";
import { useQuoteExactInput, useQuoteExactOutput, useQuoteUnitPrice } from "hooks/swap/v2/useSwapCalls";
import { tryParseAmount } from "utils/swap";
import BigNumber from "bignumber.js";
import { useAllRoutes } from "./useAllRoutes";

export enum TradeState {
  LOADING = "LOADING",
  INVALID = "INVALID",
  NO_ROUTE_FOUND = "NO_ROUTE_FOUND",
  VALID = "VALID",
  SYNCING = "SYNCING",
}

export function useUnitPrice(
  currencyIn: Token | undefined,
  currencyOut: Token | undefined,
  typedValue: string | undefined,
) {
  const amountIn = useMemo(() => {
    return tryParseAmount(typedValue, currencyIn ?? undefined);
  }, [currencyIn, typedValue]);

  const { routes, loading: routesLoading } = useAllRoutes(currencyIn, currencyOut);

  const quoteExactParams = useMemo(() => {
    if (!typedValue || !routes) return undefined;
    return routes.map((route) => ({
      tokenIn: route.input?.wrapped.address,
      tokenOut: route.output?.wrapped.address,
      amountIn: typedValue ? numberToString(formatTokenAmount(typedValue, route.input?.decimals)) : 0,
      feeAmount: route.pools[0]?.fee,
    }));
  }, [routes, typedValue]);

  const params = useMemo(() => {
    if (quoteExactParams && quoteExactParams[0]) {
      return {
        path: `${quoteExactParams[0].tokenIn}_${quoteExactParams[0].tokenOut}_${quoteExactParams[0].feeAmount}`,
        amountIn: quoteExactParams[0].amountIn,
      };
    }
    return {};
  }, [quoteExactParams]);

  const { loading: exactInputLoading, result: _quotesResults } = useQuoteUnitPrice(params.path, params.amountIn);

  const quotesResults = useMemo(() => {
    if (_quotesResults) {
      return [{ amountOut: `0x${new BigNumber(String(_quotesResults)).toString(16)}` }];
    }
    return [];
  }, [_quotesResults, exactInputLoading]);

  return useMemo(() => {
    if (!amountIn || !currencyOut || amountIn.currency.equals(currencyOut)) {
      return {
        state: TradeState.INVALID,
        trade: null,
      };
    }

    if (routesLoading || exactInputLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
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

    if (!bestRoute || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: null,
      };
    }

    return {
      state: TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: amountIn,
        outputAmount: CurrencyAmount.fromRawAmount(currencyOut, amountOut.toString()),
      }),
    };
  }, [amountIn, currencyOut, quotesResults, routes, routesLoading]);
}

export function useBestTradeExactIn(
  currencyIn: Token | undefined,
  currencyOut: Token | undefined,
  typedValue: string | undefined,
) {
  const amountIn = useMemo(() => {
    return tryParseAmount(typedValue, currencyIn ?? undefined);
  }, [currencyIn, typedValue]);

  const { routes, loading: routesLoading } = useAllRoutes(currencyIn, currencyOut);

  const params = useMemo(() => {
    if (!currencyIn || !currencyOut || !typedValue) return undefined;

    return JSON.stringify({
      path: `${currencyIn.wrapped.address}_${currencyOut.wrapped.address}_3000`,
      amountIn: numberToString(formatTokenAmount(typedValue, currencyIn.wrapped.decimals)),
    });
  }, [currencyIn, currencyOut, typedValue]);

  const _params = useMemo(() => params, [params]);

  const { loading: exactInputLoading, result: _quotesResults } = useQuoteExactInput(_params);

  const quotesResults = useMemo(() => {
    if (_quotesResults) {
      return [{ amountOut: `0x${new BigNumber(String(_quotesResults)).toString(16)}` }];
    }
    return [];
  }, [_quotesResults, exactInputLoading]);

  return useMemo(() => {
    if (!amountIn || !currencyOut || amountIn.currency.equals(currencyOut)) {
      return {
        state: TradeState.INVALID,
        trade: null,
      };
    }

    if (routesLoading || exactInputLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
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

    if (!bestRoute || !amountOut) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: null,
      };
    }

    return {
      state: TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: amountIn,
        outputAmount: CurrencyAmount.fromRawAmount(currencyOut, amountOut.toString()),
      }),
    };
  }, [amountIn, currencyOut, quotesResults, routes, routesLoading]);
}

export function useBestTradeExactOut(
  currencyIn: Token | undefined,
  currencyOut: Token | undefined,
  typedValue: string | undefined,
) {
  const { routes, loading: routesLoading } = useAllRoutes(currencyIn, currencyOut);

  const amountOut = useMemo(() => {
    return tryParseAmount(typedValue, currencyOut ?? undefined);
  }, [currencyIn, currencyOut, typedValue]);

  const quoteExactParams = useMemo(() => {
    if (!typedValue || !routes) return [];

    return routes.map((route) => ({
      tokenIn: route.input?.wrapped?.address,
      tokenOut: route.output?.wrapped?.address,
      amountOut: typedValue ? numberToString(formatTokenAmount(typedValue, route.output?.decimals)) : "0",
      feeAmount: route.pools[0]?.fee,
    }));
  }, [routes, typedValue]);

  const params = useMemo(() => {
    if (quoteExactParams && quoteExactParams[0]) {
      return {
        path: `${quoteExactParams[0].tokenIn}_${quoteExactParams[0].tokenOut}_${quoteExactParams[0].feeAmount}`,
        amountOut: quoteExactParams[0].amountOut,
      };
    }
    return {};
  }, [quoteExactParams]);

  const { loading: exactOutputLoading, result: _quotesResults } = useQuoteExactOutput(params.path, params.amountOut);

  const quotesResults = useMemo(() => {
    if (_quotesResults) {
      return [{ amountIn: `0x${new BigNumber(String(_quotesResults)).toString(16)}` }];
    }
    return [];
  }, [_quotesResults, exactOutputLoading]);

  return useMemo(() => {
    if (!amountOut || !currencyIn || amountOut.currency.equals(currencyIn)) {
      return {
        state: TradeState.INVALID,
        trade: null,
      };
    }

    if (routesLoading || exactOutputLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
      };
    }

    const { bestRoute, amountIn } = quotesResults.reduce(
      (currentBest: { bestRoute: Route<Token, Token> | null; amountIn: string | null }, { amountIn }, i) => {
        if (!amountIn) return currentBest;

        if (currentBest.amountIn === null) {
          return {
            bestRoute: routes[i],
            amountIn,
          };
        }
        if (new BigNumber(currentBest.amountIn).isGreaterThan(amountIn)) {
          return {
            bestRoute: routes[i],
            amountIn,
          };
        }

        return currentBest;
      },
      {
        bestRoute: null,
        amountIn: null,
      },
    );

    if (!bestRoute || !amountIn) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: null,
      };
    }

    return {
      state: TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_OUTPUT,
        inputAmount: CurrencyAmount.fromRawAmount(currencyIn, amountIn.toString()),
        outputAmount: amountOut,
      }),
    };
  }, [amountOut, currencyIn, quotesResults, routes, routesLoading]);
}
