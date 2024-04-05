import { useCallback, useMemo } from "react";
import { usePoolActiveLiquidity } from "hooks/swap/usePoolTickData";
import { Token, FeeAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";

export interface UseDensityChartDataArgs {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  feeAmount: FeeAmount;
}

export function useDensityChartData({ currencyA, currencyB, feeAmount }: UseDensityChartDataArgs) {
  const { isLoading, isUninitialized, isError, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount);

  const formatData = useMemo(() => {
    if (!data?.length) return undefined;

    const isSorted = currencyA && currencyB ? currencyA.wrapped.sortsBefore(currencyB.wrapped) : undefined;

    const newData: { activeLiquidity: number; price0: number }[] = [];

    for (let i = 0; i < data.length; i++) {
      const t = data[i];

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        // convert price0 to the token0 price when is not sorted
        price0: isSorted ? parseFloat(t.price0) : parseFloat(new BigNumber(1).div(t.price0).toString()),
      };

      if (chartEntry.activeLiquidity > 0) {
        // when is not sorted, should converse the data array, but there use unshift to achieve it
        if (isSorted) {
          newData.push(chartEntry);
        } else {
          newData.unshift(chartEntry);
        }
      }
    }

    return newData;
  }, [data, currencyA, currencyB]);

  return useMemo(() => {
    return {
      isLoading: isLoading || !data,
      isUninitialized,
      isError,
      formattedData: !isLoading && !isUninitialized ? formatData : undefined,
    };
  }, [isLoading, isUninitialized, isError, formatData]);
}
