import { useContext } from "react";
import { Box, useTheme } from "components/Mui";
import { TokenCharts, ChartView } from "@icpswap/ui";

import { SwapProContext } from "../context";

export default function TokenChartInfo() {
  const theme = useTheme();

  const { inputToken, outputToken, token } = useContext(SwapProContext);

  const chartButtons = [
    { label: `Dexscreener`, value: ChartView.DexScreener },
    { label: inputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: inputToken?.address },
    { label: outputToken?.symbol ?? "Price", value: ChartView.PRICE, tokenId: outputToken?.address },
    { label: `Volume`, value: ChartView.VOL },
    { label: `TVL`, value: ChartView.TVL },
  ];

  return (
    <Box
      sx={{
        margin: "22px 0 0 0",
        background: theme.palette.background.level3,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        overflow: "hidden",
        "@media(max-width: 640px)": {
          margin: "16px 0 0 0",
        },
      }}
    >
      <TokenCharts
        canisterId={token?.address}
        background={3}
        borderRadius="0px"
        showPrice={false}
        chartButtons={chartButtons}
      />
    </Box>
  );
}
