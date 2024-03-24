import { useCallback, useMemo } from "react";
import { usePoolActiveLiquidity } from "hooks/swap/usePoolTickData";
import { Currency, FeeAmount } from "@icpswap/swap-sdk";
import BigNumber from "bignumber.js";

export function useDensityChartData({
  currencyA,
  currencyB,
  feeAmount,
}: {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  feeAmount: FeeAmount;
}) {
  const { isLoading, isUninitialized, isError, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount);

  const formatData = useCallback(() => {
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
        isSorted ? newData.push(chartEntry) : newData.unshift(chartEntry);
      }
    }

    return newData;
  }, [data, currencyA, currencyB]);

  return useMemo(() => {
    return {
      isLoading,
      isUninitialized,
      isError,
      formattedData: !isLoading && !isUninitialized ? formatData() : undefined,
    };
  }, [isLoading, isUninitialized, isError, formatData]);
}
