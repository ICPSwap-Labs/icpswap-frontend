import { useContext } from "react";
import { ChartViewSelector, ChartView } from "@icpswap/ui";

import { SwapProContext } from "../context";

export function TokenChartsViewSelector() {
  const { inputToken, outputToken, setChartView, chartView } = useContext(SwapProContext);

  const ChartsViewButtons = [
    { label: `Dexscreener`, value: ChartView.DexScreener },
    { label: `DexTools`, value: ChartView.DexTools },
    { label: inputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: inputToken?.address },
    { label: outputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: outputToken?.address },
    { label: `Volume`, value: ChartView.VOL },
    { label: `TVL`, value: ChartView.TVL },
  ];

  return <ChartViewSelector chartsViews={ChartsViewButtons} chartView={chartView} onChartsViewChange={setChartView} />;
}
