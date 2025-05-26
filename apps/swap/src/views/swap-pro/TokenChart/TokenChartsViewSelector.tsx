import { useContext } from "react";
import { ChartViewSelector, ChartView } from "@icpswap/ui";
import { SwapProContext } from "components/swap/pro";
import { SwapContext } from "components/swap/index";

export function TokenChartsViewSelector() {
  const { inputToken, outputToken } = useContext(SwapContext);
  const { setChartView, chartView } = useContext(SwapProContext);

  const ChartsViewButtons = [
    { label: `Dexscreener`, value: ChartView.DexScreener },
    { label: `DexTools`, value: ChartView.DexTools },
    { label: inputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: inputToken?.address },
    { label: outputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: outputToken?.address },
    { label: `Volume`, value: ChartView.VOL },
    { label: `TVL`, value: ChartView.TVL },
    { label: "Liquidity", value: ChartView.LIQUIDITY },
  ];

  return <ChartViewSelector chartsViews={ChartsViewButtons} chartView={chartView} onChartsViewChange={setChartView} />;
}
