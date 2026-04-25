import type { Null } from "@icpswap/types";
import { TextButton, type TokenChartsRef, TokenCharts as TokenChartsUI } from "@icpswap/ui";
import { TokenPriceChart } from "components/Charts/TokenPriceChart";
import { DensityChart } from "components/info/DensityChart";
import { Box, Typography, useTheme } from "components/Mui";
import { useSwapProStore } from "components/swap/pro";
import { useSwapStore } from "components/swap/store";
import { TRADING_VIEW_DESCRIPTIONS } from "constants/index";
import { useTokenPairWithIcp, useToken } from "hooks/index";
import { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";

export function TokenCharts() {
  const theme = useTheme();
  const [priceTokenId, setPriceTokenId] = useState<string | Null>(null);
  const { token, chartView } = useSwapProStore();
  const { poolId, selectedPool } = useSwapStore();

  const tokenChartsRef = useRef<TokenChartsRef>(null);

  useEffect(() => {
    if (chartView && tokenChartsRef?.current) {
      tokenChartsRef.current.setView(chartView);
    }
  }, [chartView]);

  useEffect(() => {
    if (token) {
      setPriceTokenId(token.address);
    }
  }, [token]);

  const [, priceToken] = useToken(priceTokenId);

  const tokenPairWithIcp = useTokenPairWithIcp({ tokenId: priceToken?.address });

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
      <TokenChartsUI
        ref={tokenChartsRef}
        canisterId={priceToken?.address}
        background={3}
        borderRadius="0px"
        showTopIfDexScreen={false}
        dexScreenId={poolId}
        tokenPairWithIcp={tokenPairWithIcp}
        priceChart={<TokenPriceChart token={priceToken} />}
        onPriceTokenIdChange={setPriceTokenId}
        LiquidityChart={
          <DensityChart address={poolId} token0Price={selectedPool ? selectedPool.token0Price.toFixed() : undefined} />
        }
      />

      {chartView && TRADING_VIEW_DESCRIPTIONS.includes(chartView.value) ? (
        <Typography sx={{ fontSize: "12px", padding: "12px", lineHeight: "16px" }}>
          <Trans
            components={{
              component: <TextButton link="https://www.tradingview.com/economic-calendar" sx={{ fontSize: "12px" }} />,
            }}
            i18nKey="swap.TradingView.descriptions"
          />
        </Typography>
      ) : null}
    </Box>
  );
}
