import { useEffect, useContext, useRef, useState } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { TokenCharts as TokenChartsUI, TokenChartsRef, TextButton } from "@icpswap/ui";
import { TokenPriceChart } from "components/Charts/TokenPriceChart";
import { useToken, uesTokenPairWithIcp } from "hooks/index";
import { Null } from "@icpswap/types";
import { SwapProContext } from "components/swap/pro";
import { SwapContext } from "components/swap/index";
import { Trans } from "react-i18next";
import { TRADING_VIEW_DESCRIPTIONS } from "constants/index";
import { DensityChart } from "components/info/DensityChart";

export function TokenCharts() {
  const theme = useTheme();
  const [priceTokenId, setPriceTokenId] = useState<string | Null>(null);
  const { token, chartView } = useContext(SwapProContext);
  const { poolId, selectedPool } = useContext(SwapContext);

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

  const tokenPairWithIcp = uesTokenPairWithIcp({ tokenId: priceToken?.address });

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
            i18nKey="swap.tradingview.descriptions"
          />
        </Typography>
      ) : null}
    </Box>
  );
}
