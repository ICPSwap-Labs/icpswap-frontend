import { TradeType } from "@icpswap/constants";
import { CurrencyAmount, type Route, type Token, Trade } from "@icpswap/swap-sdk";
import { formatTokenAmount, isUndefinedOrNull, numberToString } from "@icpswap/utils";
import { BigNumber } from "bignumber.js";
import { useAllRoutes } from "hooks/swap/useAllRoutes";
import { useQuoteExactInput, useSwapPoolAvailable } from "hooks/swap/v3Calls";
import { useMemo } from "react";
import { tryParseAmount } from "utils/swap";

interface UseQuoteResultArgs {
  inputToken: Token | undefined;
  outputToken: Token | undefined;
  value: string | undefined;
}

export const useQuoteResult = ({ inputToken, outputToken, value }: UseQuoteResultArgs) => {
  const { routes, loading: routesLoading, checked, noLiquidity } = useAllRoutes(inputToken, outputToken);

  const zeroForOne = useMemo(() => {
    return inputToken && outputToken ? inputToken.sortsBefore(outputToken) : undefined;
  }, [inputToken, outputToken]);

  const pool = useMemo(() => {
    if (!routes) return undefined;
    return routes[0]?.pools[0];
  }, [routes]);

  const params = useMemo(() => {
    if (!value || zeroForOne === undefined || !pool) return undefined;

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
        const quoteAmount = !value ? "0" : numberToString(formatTokenAmount(value, inputToken.decimals));

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
  }, [routes, pool, value, zeroForOne]);

  const { isLoading: quoteLoading, data: quotesResult } = useQuoteExactInput(params);

  return useMemo(() => {
    return {
      quotesResult: quotesResult ? [{ amountOut: quotesResult }] : [],
      quoteLoading,
      routesLoading,
      checked,
      noLiquidity,
      routes,
      pool,
    };
  }, [quoteLoading, quotesResult, routesLoading, checked, noLiquidity, routes, pool]);
};

export enum TradeState {
  LOADING = "LOADING",
  INVALID = "INVALID",
  NO_ROUTE_FOUND = "NO_ROUTE_FOUND",
  VALID = "VALID",
  SYNCING = "SYNCING",
  NOT_CHECK = "NOT_CHECK",
}

export function useBestTrade(inputToken: Token | undefined, outputToken: Token | undefined, value: string | undefined) {
  const { quotesResult, quoteLoading, routesLoading, checked, noLiquidity, routes, pool } = useQuoteResult({
    inputToken,
    outputToken,
    value,
  });

  const available = useSwapPoolAvailable(pool?.id);

  return useMemo(() => {
    if (
      isUndefinedOrNull(inputToken) ||
      isUndefinedOrNull(outputToken) ||
      inputToken.equals(outputToken) ||
      isUndefinedOrNull(value) ||
      new BigNumber(value).isEqualTo(0)
    ) {
      return {
        state: TradeState.INVALID,
        trade: null,
        pool,
        routes,
        noLiquidity,
      };
    }

    if (routesLoading || quoteLoading) {
      return {
        state: TradeState.LOADING,
        trade: null,
        pool,
        routes,
        noLiquidity,
      };
    }

    const { bestRoute, amountOut } = quotesResult.reduce(
      (currentBest: { bestRoute: Route<Token, Token> | null; amountOut: bigint | null }, { amountOut }, i) => {
        if (!amountOut) return currentBest;

        if (currentBest.amountOut === null) {
          return {
            bestRoute: routes[i],
            amountOut,
          };
        }
        if (new BigNumber(currentBest.amountOut.toString()).isLessThan(amountOut.toString())) {
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

    const inputAmount = tryParseAmount(value, inputToken);

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
    value,
    quotesResult,
    routes,
    routesLoading,
    available,
    checked,
    pool,
    noLiquidity,
    quoteLoading,
  ]);
}
