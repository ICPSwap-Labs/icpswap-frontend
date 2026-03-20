import { ChartView, ChartViewSelector } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { SwapContext } from "components/swap/index";
import { SwapProContext } from "components/swap/pro";
import { useContext, useMemo } from "react";

export function TokenChartsViewSelector() {
  const { inputToken, outputToken } = useContext(SwapContext);
  const { setChartView, chartView } = useContext(SwapProContext);

  const ChartsViewButtons = useMemo(() => {
    if (isUndefinedOrNull(inputToken) || isUndefinedOrNull(outputToken)) return undefined;

    return [
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
