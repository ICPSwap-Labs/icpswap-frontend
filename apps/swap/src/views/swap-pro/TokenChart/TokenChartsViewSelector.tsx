import { useContext, useMemo } from "react";
import { ChartViewSelector, ChartView } from "@icpswap/ui";
import { SwapProContext } from "components/swap/pro";
import { SwapContext } from "components/swap/index";
import { isUndefinedOrNull } from "@icpswap/utils";

export function TokenChartsViewSelector() {
  const { inputToken, outputToken } = useContext(SwapContext);
  const { setChartView, chartView } = useContext(SwapProContext);

  const ChartsViewButtons = useMemo(() => {
    if (isUndefinedOrNull(inputToken) || isUndefinedOrNull(outputToken)) return undefined;

    return [
      { label: `Dexscreener`, value: ChartView.DexScreener },
      { label: `DexTools`, value: ChartView.DexTools },
      { label: inputToken.symbol, value: ChartView.PRICE, tokenId: inputToken.address },
      { label: outputToken.symbol, value: ChartView.PRICE, tokenId: outputToken.address },
      { label: `Volume`, value: ChartView.VOL },
      { label: `TVL`, value: ChartView.TVL },
      { label: "Liquidity", value: ChartView.LIQUIDITY },
    ];
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
