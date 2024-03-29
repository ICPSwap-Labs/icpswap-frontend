import { useMemo } from "react";
import { formatTokenAmount, numberToString } from "@icpswap/utils";
import { TradeType } from "@icpswap/constants";
import { useQuotePrice } from "hooks/swap/useQuotePrice";
import { tryParseAmount } from "utils/swap";
import { BigNumber } from "bignumber.js";
import { CurrencyAmount, Token, Route, Trade } from "@icpswap/swap-sdk";
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
    if (!typedValue) return [];
    return routes.map((route) => ({
      tokenIn: route.input?.wrapped.address,
      tokenOut: route.output?.wrapped.address,
      amountIn: typedValue ? numberToString(formatTokenAmount(typedValue, route.input?.decimals)) : "0",
      feeAmount: route.pools[0]?.fee,
      poolId: route.pools[0].id,
    }));
  }, [routes, typedValue]);

  const params = useMemo(() => {
    if (quoteExactParams && quoteExactParams[0]) {
      return {
        amountIn: quoteExactParams[0].amountIn,
        poolId: quoteExactParams[0].poolId,
        zeroForOne: quoteExactParams[0].tokenIn < quoteExactParams[0].tokenOut,
      };
    }
    return {};
  }, [quoteExactParams]);

  const { loading: exactInputLoading, result: _quotesResults } = useQuotePrice(
    params.poolId,
    params.amountIn,
    params.zeroForOne,
  );

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
