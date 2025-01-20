import { Typography, Box, Button, useMediaQuery, useTheme } from "components/Mui";
import { useParams } from "react-router-dom";
import { InfoWrapper, Breadcrumbs, TextButton, TokenImage, MainCard } from "components/index";
import { Trans } from "@lingui/macro";
import { formatDollarAmount, formatDollarTokenPrice } from "@icpswap/utils";
import { useParsedQueryString, useTokenLatestTVL, useInfoToken } from "@icpswap/hooks";
import {
  GridAutoRows,
  Proportion,
  TokenCharts,
  Flex,
  ChartView,
  TokenChartsRef,
  ChartViewSelector,
  ChartButton,
  Link,
} from "@icpswap/ui";
import { TokenTransactions, TokenPools } from "components/info/swap";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { swapLink, addLiquidityLink } from "utils/info/link";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { TokenInfo } from "types/token";
import { useState, useEffect, useRef } from "react";
import { Null } from "@icpswap/types";
import { TokenPriceChart } from "components/Charts/TokenPriceChart";
import { useToken, uesTokenPairWithIcp } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";
import { Holders } from "components/info/tokens";
import { ICP } from "@icpswap/tokens";

import { TokenPrices } from "./components/TokenPrice";

enum TabValue {
  Transactions = "Transactions",
  Holders = "Holders",
}

const tabs = [
  { value: TabValue.Transactions, label: "Transactions" },
  { value: TabValue.Holders, label: "Holders" },
];

interface TokenChartsViewSelectorProps {
  token: TokenInfo | undefined | Token;
  chartView: ChartButton | Null;
  setChartView: (chart: ChartButton) => void;
}

function TokenChartsViewSelector({ token, chartView, setChartView }: TokenChartsViewSelectorProps) {
  const ChartsViewButtons = [
    { label: `Dexscreener`, value: ChartView.DexScreener },
    { label: `DexTools`, value: ChartView.DexTools },
    {
      label: token?.symbol ?? "Price",
      value: ChartView.PRICE,
      tokenId: token ? ("address" in token ? token.address : token?.canisterId) : undefined,
    },
    { label: `Volume`, value: ChartView.VOL },
    { label: `TVL`, value: ChartView.TVL },
  ];

  return <ChartViewSelector chartsViews={ChartsViewButtons} chartView={chartView} onChartsViewChange={setChartView} />;
}

const TradingViewDesc = [ChartView.DexScreener, ChartView.PRICE];

export default function TokenDetails() {
  const { id: canisterId } = useParams<{ id: string }>();
  const [openTips] = useTips();
  const theme = useTheme();
  const tokenChartsRef = useRef<TokenChartsRef>(null);

  const { path, page } = useParsedQueryString() as { path: string | undefined; page: string | undefined };

  const infoToken = useInfoToken(canisterId);
  const [, token] = useToken(infoToken?.address);

  const { result: tokenTVL } = useTokenLatestTVL(canisterId);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.Transactions);

  const [chartView, setChartView] = useState<Null | ChartButton>({
    label: "DexScreener",
    value: ChartView.DexScreener,
  });

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  useEffect(() => {
    if (chartView && tokenChartsRef.current) {
      tokenChartsRef.current.setView(chartView);
    }
  }, [chartView, tokenChartsRef]);

  // Make Price chart first if token is icp
  useEffect(() => {
    if (canisterId === ICP.address) {
      setChartView({
        label: token?.symbol ?? "Price",
        value: ChartView.PRICE,
        tokenId: canisterId,
      });
    }
  }, [token, canisterId]);

  const tokenPairWithIcp = uesTokenPairWithIcp({ tokenId: canisterId });

  return (
    <InfoWrapper>
      <Breadcrumbs
        prevLink={path ? atob(path) : "/info-swap"}
        prevLabel={page ? atob(page) : <Trans>Swap Tokens</Trans>}
        currentLabel={<Trans>Details</Trans>}
      />

      <Box mt="20px">
        <Flex fullWidth>
          <TokenImage logo={token?.logo} size="24px" tokenId={token?.address} />

          <Typography fontSize="20px" fontWeight="500" color="text.primary" sx={{ margin: "0 0 0 10px" }}>
            {token?.name}
          </Typography>

          <Typography fontSize="20px" fontWeight="500" sx={{ margin: "0 0 0 6px" }}>
            ({infoToken?.symbol})
          </Typography>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Flex fullWidth>
              <TextButton
                to={`/info-tokens/details/${canisterId}`}
                sx={{
                  margin: "0 0 0 6px",
                }}
              >
                {canisterId}
              </TextButton>

              <Box sx={{ width: "4px" }} />
              <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Flex
        fullWidth
        align="flex-end"
        justify="space-between"
        sx={{
          margin: "16px 0 0 0",
          "@media (max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px 0",
          },
        }}
      >
        <Box>
          <Flex fullWidth align="center">
            <Typography
              color="text.primary"
              sx={{
                fontSize: "36px",
                fontWeight: 500,
                margin: "0 10px 0 0",
                lineHeight: "0.8",
              }}
            >
              {formatDollarTokenPrice(infoToken?.priceUSD)}
            </Typography>

            <Typography component="div" sx={{ display: "flex" }}>
              (<Proportion value={infoToken?.priceUSDChange} />)
            </Typography>
          </Flex>
        </Box>

        <Flex justify="flex-end" sx={{ gap: "0 10px" }}>
          {!matchDownSM ? (
            <TokenChartsViewSelector token={token} chartView={chartView} setChartView={setChartView} />
          ) : null}

          <Link to={`/info-tokens/details/${canisterId}`}>
            <Button variant="contained" className="secondary">
              <Trans>Token Details</Trans>
            </Button>
          </Link>

          <Link to={addLiquidityLink(canisterId)}>
            <Button variant="contained" className="secondary">
              <Trans>Add Liquidity</Trans>
            </Button>
          </Link>

          <Link to={swapLink(canisterId)}>
            <Button variant="contained">
              <Trans>Swap</Trans>
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "1em",
          marginTop: "32px",

          "@media screen and (max-width: 840px)": {
            gridTemplateColumns: "1fr",
            gap: "1em",
          },
        }}
      >
        <MainCard level={3}>
          <GridAutoRows gap="24px">
            <GridAutoRows gap="4px">
              <Typography>
                <Trans>TVL</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(tokenTVL?.tvlUSD)}
              </Typography>

              <Proportion value={tokenTVL?.tvlUSDChange} />
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Volume 24H</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(infoToken?.volumeUSD)}
              </Typography>
            </GridAutoRows>

            {/* <GridAutoRows gap="4px">
              <Typography>
                <Trans>Volume 7D</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(infoToken?.volumeUSD7d)}
              </Typography>
            </GridAutoRows> */}

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Fee 24H</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {infoToken?.volumeUSD ? formatDollarAmount((infoToken.volumeUSD * 3) / 1000) : "--"}
              </Typography>
            </GridAutoRows>
          </GridAutoRows>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <TokenPrices tokenInfo={token} />
          </Box>
        </MainCard>

        {matchDownSM ? (
          <Box sx={{ width: "fit-content" }}>
            <TokenChartsViewSelector token={token} chartView={chartView} setChartView={setChartView} />
          </Box>
        ) : null}

        <Box
          sx={{
            background:
              chartView && TradingViewDesc.includes(chartView.value) ? theme.palette.background.level3 : "transparent",
            borderRadius: chartView && TradingViewDesc.includes(chartView.value) ? "16px" : "none",
          }}
        >
          <TokenCharts
            ref={tokenChartsRef}
            canisterId={canisterId}
            volume={infoToken?.volumeUSD}
            showTopIfDexScreen={false}
            dexScreenHeight="486px"
            priceChart={<TokenPriceChart token={token} />}
            wrapperSx={
              chartView && TradingViewDesc.includes(chartView.value)
                ? {
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }
                : null
            }
            background={3}
            tokenPairWithIcp={tokenPairWithIcp}
          />

          {chartView && TradingViewDesc.includes(chartView.value) ? (
            <Typography
              sx={{
                fontSize: "12px",
                padding: "12px",
                lineHeight: "16px",
                background: theme.palette.background.level3,
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            >
              Token price charts powered by TradingView, the charting platform and social network that provides users
              with valuable information on market events through tools such as the{" "}
              <TextButton
                link="https://www.tradingview.com/economic-calendar"
                sx={{
                  fontSize: "12px",
                }}
              >
                economic calendar
              </TextButton>
              , stock analyser and others
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={3}>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <TokenPools canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={3} padding="0px">
          <Flex
            gap="0 20px"
            sx={{
              padding: "24px",
              "@media(max-width: 640px)": {
                padding: "16px",
              },
            }}
          >
            {tabs.map((tab) => (
              <Typography
                variant="h3"
                sx={{ cursor: "pointer", color: tab.value === activeTab ? "text.primary" : "text.secondary" }}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </Typography>
            ))}
          </Flex>

          <Box>
            {activeTab === TabValue.Transactions ? (
              <TokenTransactions canisterId={canisterId} styleProps={{ padding: "24px" }} />
            ) : null}
            {activeTab === TabValue.Holders ? <Holders tokenId={canisterId} styleProps={{ padding: "24px" }} /> : null}
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
