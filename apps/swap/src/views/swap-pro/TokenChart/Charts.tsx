import { useEffect, useContext, useRef } from "react";
import { Box, useTheme } from "components/Mui";
import { TokenCharts, TokenChartsRef } from "@icpswap/ui";
import { TokenPriceChart } from "components/Charts/TokenPriceChart";

import { SwapProContext } from "../context";

export default function TokenChartInfo() {
  const theme = useTheme();
  const { token, chartView, tradePoolId } = useContext(SwapProContext);

  const tokenChartsRef = useRef<TokenChartsRef>(null);

  useEffect(() => {
    if (chartView && tokenChartsRef && tokenChartsRef.current) {
      tokenChartsRef.current.setView(chartView);
    }
  }, [chartView, tokenChartsRef]);

  return (
    <Box
      sx={{
        margin: "10px 0 0 0",
        background: theme.palette.background.level3,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        overflow: "hidden",
        "@media(max-width: 640px)": {
          margin: "0 0 0 0",
        },
      }}
    >
      <TokenCharts
        ref={tokenChartsRef}
        canisterId={token?.address}
        background={3}
        borderRadius="0px"
        showPrice={false}
        showTopIfDexScreen={false}
        dexScreenId={tradePoolId}
        priceChart={<TokenPriceChart token={token} />}
      />
    </Box>
  );
}
