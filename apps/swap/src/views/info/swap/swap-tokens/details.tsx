import { Typography, Box, Button, useTheme } from "components/Mui";
import { useParams } from "react-router-dom";
import { InfoWrapper, Breadcrumbs, TextButton, TokenImage, MainCard, ImportToNns } from "components/index";
import { BigNumber, formatDollarAmount, formatDollarTokenPrice, nonUndefinedOrNull } from "@icpswap/utils";
import { useParsedQueryString, useInfoToken } from "@icpswap/hooks";
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
import { TRADING_VIEW_DESCRIPTIONS } from "constants/index";
import i18n from "i18n/index";
import { useTranslation, Trans } from "react-i18next";
import { useMediaQuery640 } from "hooks/theme";
import { tokenSymbolEllipsis } from "utils/tokenSymbolEllipsis";
import { InfoTokenPrices } from "components/info/swap/TokenPriceWithIcp";
import { useFetchGlobalDefaultChartType } from "store/global/hooks";
import { getChartView } from "utils/swap/chartType";

enum TabValue {
  Transactions = "Transactions",
  Holders = "Holders",
}

const tabs = [
  { value: TabValue.Transactions, label: i18n.t("common.transactions") },
  { value: TabValue.Holders, label: i18n.t("common.holders") },
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

  return <ChartViewSelector options={ChartsViewButtons} chartView={chartView} onChartsViewChange={setChartView} />;
}

export default function TokenDetails() {
  const { t } = useTranslation();
  const { id: canisterId } = useParams<{ id: string }>();
  const [openTips] = useTips();
  const theme = useTheme();
  const tokenChartsRef = useRef<TokenChartsRef>(null);
  const down640 = useMediaQuery640();

  const { path, page } = useParsedQueryString() as { path: string | undefined; page: string | undefined };

  const infoToken = useInfoToken(canisterId);
  const [, token] = useToken(canisterId);

  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.Transactions);
  const [chartView, setChartView] = useState<Null | ChartButton>(null);

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const defaultChartType = useFetchGlobalDefaultChartType();

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
    } else if (nonUndefinedOrNull(defaultChartType)) {
      const chartView = getChartView(defaultChartType);

      if (chartView) {
        setChartView({ label: chartView as unknown as string, value: chartView });
      }
    }
  }, [token, defaultChartType, canisterId]);

  const tokenPairWithIcp = uesTokenPairWithIcp({ tokenId: canisterId });

  return (
    <InfoWrapper>
      <Breadcrumbs
        prevLink={path ? atob(path) : "/info-swap"}
        prevLabel={page ? atob(page) : t("info.swap.tokens")}
        currentLabel={t("common.details")}
      />

      <Box mt="20px">
        <Flex
          fullWidth
          gap="0 6px"
          sx={{ "@media (max-width: 640px)": { flexDirection: "column", alignItems: "flex-start", gap: "6px 0" } }}
        >
          <Flex gap="0 6px">
            <Flex gap="0 10px">
              <TokenImage logo={token?.logo} size="24px" tokenId={token?.address} />
              <Typography fontSize="20px" fontWeight="500" color="text.primary">
                {token?.name && down640 ? tokenSymbolEllipsis({ symbol: token.name }) : token?.name}
              </Typography>
            </Flex>

            <Typography fontSize="20px" fontWeight="500">
              ({infoToken?.tokenSymbol && down640 ? tokenSymbolEllipsis({ symbol: token?.symbol }) : token?.symbol})
            </Typography>
          </Flex>

          <Flex gap="0 4px">
            <TextButton to={`/info-tokens/details/${canisterId}`}>{canisterId}</TextButton>

            <Box sx={{ width: "4px" }} />
            <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
          </Flex>
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
            gap: "16px 0",
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
              {formatDollarTokenPrice(infoToken?.price)}
            </Typography>

            <Typography component="div" sx={{ display: "flex" }}>
              (<Proportion value={infoToken?.priceChange24H} />)
            </Typography>
          </Flex>
        </Box>

        <Flex
          justify="flex-end"
          wrap="wrap"
          sx={{
            gap: "10px",
            "@media(max-width: 640px)": {
              justifyContent: "flex-start",
            },
          }}
        >
          {!down640 ? (
            <TokenChartsViewSelector token={token} chartView={chartView} setChartView={setChartView} />
          ) : null}

          <ImportToNns tokenId={canisterId}>
            <Button variant="contained" className="secondary">
              {t("common.nns.token.add")}
            </Button>
          </ImportToNns>

          <Link link={`/info-tokens/details/${canisterId}`}>
            <Button variant="contained" className="secondary">
              {t("common.token.details")}
            </Button>
          </Link>

          <Link link={addLiquidityLink(canisterId)}>
            <Button variant="contained" className="secondary">
              {t("swap.add.liquidity")}
            </Button>
          </Link>

          <Link to={swapLink(canisterId)}>
            <Button variant="contained">{t("common.swap")}</Button>
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
              <Typography>{t("common.tvl")}</Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(infoToken?.tvlUSD)}
              </Typography>

              <Proportion value={infoToken?.tvlUSDChange24H} />
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>{t("common.volume24h")}</Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(infoToken?.volumeUSD24H)}
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
              <Typography>{t("common.fee24h")}</Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {infoToken?.volumeUSD24H
                  ? formatDollarAmount(new BigNumber(infoToken.volumeUSD24H).multipliedBy(3).div(1000).toString())
                  : "--"}
              </Typography>
            </GridAutoRows>
          </GridAutoRows>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <InfoTokenPrices tokenInfo={token} />
          </Box>
        </MainCard>

        {down640 ? (
          <Box sx={{ width: "fit-content" }}>
            <TokenChartsViewSelector token={token} chartView={chartView} setChartView={setChartView} />
          </Box>
        ) : null}

        <Box
          sx={{
            background:
              chartView && TRADING_VIEW_DESCRIPTIONS.includes(chartView.value)
                ? theme.palette.background.level3
                : "transparent",
            borderRadius: chartView && TRADING_VIEW_DESCRIPTIONS.includes(chartView.value) ? "16px" : "none",
          }}
        >
          <TokenCharts
            ref={tokenChartsRef}
            canisterId={canisterId}
            volume={infoToken?.volumeUSD24H}
            showTopIfDexScreen={false}
            dexScreenHeight="486px"
            priceChart={<TokenPriceChart token={token} />}
            wrapperSx={
              chartView && TRADING_VIEW_DESCRIPTIONS.includes(chartView.value)
                ? {
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }
                : null
            }
            background={3}
            tokenPairWithIcp={tokenPairWithIcp}
          />

          {chartView && TRADING_VIEW_DESCRIPTIONS.includes(chartView.value) ? (
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
              <Trans
                components={{
                  component: (
                    <TextButton link="https://www.tradingview.com/economic-calendar" sx={{ fontSize: "12px" }} />
                  ),
                }}
                i18nKey="swap.tradingview.descriptions"
              />
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
