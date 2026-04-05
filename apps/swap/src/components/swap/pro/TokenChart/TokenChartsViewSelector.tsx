import { ChartView, ChartViewSelector } from "@icpswap/ui";
import { useSwapProStore } from "components/swap/pro";
import { useSwapStore } from "components/swap/store";
import { useMemo } from "react";

const DEFAULT_BUTTONS = [
  { label: `DexTools`, value: ChartView.DexTools },
  { label: `Volume`, value: ChartView.VOL },
  { label: `TVL`, value: ChartView.TVL },
  { label: "Liquidity", value: ChartView.LIQUIDITY },
];

export function TokenChartsViewSelector() {
  const { inputToken, outputToken } = useSwapStore();
  const { setChartView, chartView } = useSwapProStore();

  const ChartsViewButtons = useMemo(() => {
    return inputToken && outputToken
      ? [
          { label: `DexTools`, value: ChartView.DexTools },
          { label: inputToken.symbol, value: ChartView.PRICE, tokenId: inputToken.address },
          { label: outputToken.symbol, value: ChartView.PRICE, tokenId: outputToken.address },
          { label: `Volume`, value: ChartView.VOL },
          { label: `TVL`, value: ChartView.TVL },
          { label: "Liquidity", value: ChartView.LIQUIDITY },
        ]
      : DEFAULT_BUTTONS;
  }, [inputToken, outputToken]);

  return ChartsViewButtons ? (
    <ChartViewSelector
      options={ChartsViewButtons}
      chartView={chartView}
      onChartsViewChange={setChartView}
      maxHeight="400px"
    />
  ) : null;
}
