import { ChartView } from "@icpswap/ui";

export function getChartView(chartType: string) {
  switch (chartType) {
    case "TVL":
      return ChartView.TVL;
    case "Volume":
      return ChartView.VOL;
    case "Liquidity":
      return ChartView.LIQUIDITY;
    case "DexTools":
      return ChartView.DexTools;
    case "Dexscreener":
      return ChartView.DexScreener;
    case "Token0":
    case "Token1":
      return ChartView.PRICE;
    default:
      return ChartView.DexScreener;
  }
}
