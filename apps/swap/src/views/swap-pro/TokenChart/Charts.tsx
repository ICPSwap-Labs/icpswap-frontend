import { useEffect, useContext, useRef, useState } from "react";
import { Box, useTheme } from "components/Mui";
import { TokenCharts, TokenChartsRef } from "@icpswap/ui";
import { TokenPriceChart } from "components/Charts/TokenPriceChart";
import { useToken } from "hooks/index";
import { Null } from "@icpswap/types";

import { SwapProContext } from "../context";

export default function TokenChartInfo() {
  const theme = useTheme();
  const [priceTokenId, setPriceTokenId] = useState<string | Null>(null);
  const { token, chartView, tradePoolId } = useContext(SwapProContext);

  const tokenChartsRef = useRef<TokenChartsRef>(null);

  useEffect(() => {
    if (chartView && tokenChartsRef && tokenChartsRef.current) {
      tokenChartsRef.current.setView(chartView);
    }
  }, [chartView, tokenChartsRef]);

  useEffect(() => {
    if (token) {
      setPriceTokenId(token.address);
    }
  }, [token]);

  const [, priceToken] = useToken(priceTokenId);

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
        canisterId={priceToken?.address}
        background={3}
        borderRadius="0px"
        showPrice={false}
        showTopIfDexScreen={false}
        dexScreenId={tradePoolId}
        priceChart={<TokenPriceChart token={priceToken} />}
        onPriceTokenIdChange={setPriceTokenId}
      />
    </Box>
  );
}
