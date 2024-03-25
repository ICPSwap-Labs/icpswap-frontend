import { useState, useMemo } from "react";
import { Typography, Box, Grid, Avatar, Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useParams } from "react-router-dom";
import { Wrapper, Breadcrumbs, TextButton , MainCard } from "ui-component/index";
import { Trans, t } from "@lingui/macro";
import { mockALinkAndOpen, toSignificant , formatDollarAmount } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { useGraphToken, useGraphTokenTVLChartData, useGraphTokenPriceChartData } from "hooks/v2";
import { useTokenInfo } from "hooks/token/index";
import { GridAutoRows } from "ui-component/Grid/index";
import PercentageChangeLabel from "ui-component/PercentageChange";
import dayjs from "dayjs";
import LineChart from "ui-component/LineChart/alt";
import BarChart from "ui-component/BarChart/alt";
import CandleChart from "ui-component/CandleChart";
import TokenPools from "ui-component/analytic-v2/TokenPools";
import ChartToggle, { ChartView } from "ui-component/analytic-v2/ChartViewsButton";
import TokenTransactions from "ui-component/analytic-v2/TokenTransactions";
import SwapAnalyticLoading from "ui-component/analytic-v2/Loading";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { swapLink } from "utils/index";
import { Theme } from "@mui/material/styles";
import { TokenInfo } from "types/token";
import { Token } from "types/analytic-v2";
import { WRAPPED_ICP_TOKEN_INFO } from "constants/tokens";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

export const chartViews = [
  { label: t`Volume`, key: ChartView.VOL },
  { label: t`TVL`, key: ChartView.TVL },
  { label: t`Price`, key: ChartView.PRICE },
  { label: t`Transactions`, key: ChartView.TRANSACTIONS },
];

export function TokenChartData({ canisterId }: { canisterId: string }) {
  const { result: _chartData, loading } = useGraphTokenTVLChartData(canisterId, 0, 1000);

  const chartData = useMemo(() => {
    return _chartData
      ?.map((data) => ({
        ...data,
        timestamp: Number(data.timestamp),
      }))
      .sort((a, b) => {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
      });
  }, [_chartData]);

  const [chartView, setChartView] = useState<ChartView>(ChartView.VOL);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const { result: _priceChartData, loading: priceChartLoading } = useGraphTokenPriceChartData(
    canisterId,
    0,
    24 * 60 * 60,
    1000,
  );

  const priceChartData = useMemo(() => {
    return _priceChartData
      ?.map((data) => ({
        ...data,
        time: Number(data.timestamp),
        id: undefined,
        timestamp: undefined,
      }))
      .sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      });
  }, [_priceChartData]);

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((data) => {
        return {
          time: dayjs(data.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
          value: data.tvlUSD,
        };
      });
    } 
      return [];
    
  }, [chartData]);

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((data) => {
        return {
          time: dayjs(data.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
          value: data.volumeUSD,
        };
      });
    } 
      return [];
    
  }, [chartData]);

  const formattedTransactionData = useMemo(() => {
    if (chartData) {
      return chartData.map((data) => {
        return {
          time: dayjs(data.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss"),
          value: Number(data.txCount),
        };
      });
    } 
      return [];
    
  }, [chartData]);

  return (
    <MainCard
      level={2}
      border={false}
      contentSX={{
        position: "relative",
      }}
    >
      <SwapAnalyticLoading loading={loading || priceChartLoading} />

      <Box>
        <Typography
          color="text.primary"
          fontSize="24px"
          fontWeight={500}
          sx={{
            height: "30px",
            "@media (max-width: 640px)": {
              margin: "40px 0 0 0",
            },
          }}
        >
          {latestValue || latestValue === 0
            ? chartView === ChartView.TRANSACTIONS
              ? latestValue
              : formatDollarAmount(latestValue, 2)
            : chartView === ChartView.VOL
            ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
            : chartView === ChartView.TVL
            ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
            : chartView === ChartView.TRANSACTIONS
            ? formattedTransactionData[formattedTransactionData.length - 1]?.value
            : priceChartData
            ? formatDollarAmount(priceChartData[priceChartData.length - 1]?.close, 2)
            : "--"}
        </Typography>
        <Typography
          color="text.primary"
          fontWeight={500}
          sx={{
            height: "20px",
          }}
          fontSize="12px"
        >
          {valueLabel || ""}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <ChartToggle
          chartViews={chartViews}
          activeView={chartView}
          setActiveChartView={(chartView) => setChartView(chartView)}
        />
      </Box>

      <Box mt="20px">
        {chartView === ChartView.TVL ? (
          <LineChart
            data={formattedTvlData}
            setLabel={setValueLabel}
            minHeight={340}
            setValue={setLatestValue}
            value={latestValue}
            label={valueLabel}
          />
        ) : chartView === ChartView.VOL ? (
          <BarChart
            data={formattedVolumeData}
            minHeight={340}
            setValue={setLatestValue}
            setLabel={setValueLabel}
            value={latestValue}
            label={valueLabel}
          />
        ) : chartView === ChartView.PRICE ? (
          priceChartData ? (
            <CandleChart data={priceChartData} setValue={setLatestValue} setLabel={setValueLabel} />
          ) : null
        ) : chartView === ChartView.TRANSACTIONS ? (
          <BarChart
            data={formattedTransactionData}
            minHeight={340}
            setValue={setLatestValue}
            setLabel={setValueLabel}
            value={latestValue}
            label={valueLabel}
          />
        ) : null}
      </Box>
    </MainCard>
  );
}

export interface TokenPriceProps {
  token0: TokenInfo | undefined;
  token1Symbol: string | undefined;
  price: number | undefined;
}

export function TokenPrice({ token0, token1Symbol, price }: TokenPriceProps) {
  const theme = useTheme() as Theme;

  return token0 && token1Symbol && price ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <Avatar src={token0?.logo} sx={{ width: "18px", height: "18px", marginRight: "6px" }}>
        &nbsp;
      </Avatar>
      <Typography color="text.primary" fontWeight={500}>
        1 {token0?.symbol} = {toSignificant(price, 4)} {token1Symbol}
      </Typography>
    </Box>
  ) : null;
}

export function TokenPrices({
  tokenInfo,
  graphToken,
}: {
  tokenInfo: TokenInfo | undefined;
  graphToken: Token | undefined | null;
}) {
  const theme = useTheme() as Theme;

  const tokenPrice = graphToken?.priceUSD;

  const { result: graphWICP } = useGraphToken(WRAPPED_ICP_TOKEN_INFO.canisterId);

  const ICPPrice = graphWICP?.priceUSD;

  const WICPRatio = tokenPrice && ICPPrice ? new BigNumber(ICPPrice).dividedBy(tokenPrice).toNumber() : undefined;
  const TokenRatio = tokenPrice && ICPPrice ? new BigNumber(tokenPrice).dividedBy(ICPPrice).toNumber() : undefined;

  return tokenPrice && ICPPrice && graphToken && tokenInfo ? (
    <Box
      sx={{
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
      }}
    >
      <TokenPrice token0={WRAPPED_ICP_TOKEN_INFO} token1Symbol={tokenInfo?.symbol} price={WICPRatio} />
      <Box sx={{ width: "10px" }} />
      <TokenPrice token0={tokenInfo} price={TokenRatio} token1Symbol={WRAPPED_ICP_TOKEN_INFO.symbol} />
    </Box>
  ) : null;
}

export default function TokenDetails() {
  const { canisterId } = useParams<{ canisterId: string }>();
  const { result: token } = useGraphToken(canisterId);
  const { result: tokenInfo } = useTokenInfo(token?.address);

  const [openTips] = useTips();

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const handleToSwap = () => {
    mockALinkAndOpen(swapLink(canisterId), "to_swap");
  };

  return (
    <Wrapper>
      <Box>
        <Breadcrumbs prevLink="/swap/v2" prevLabel={<Trans>Tokens</Trans>} currentLabel={<Trans>Details</Trans>} />
      </Box>

      <Box mt="20px">
        <Grid container alignItems="center">
          <Avatar src={tokenInfo?.logo} sx={{ width: "24px", height: "24px" }}>
            &nbsp;
          </Avatar>

          <Typography fontSize="20px" fontWeight="500" color="text.primary" sx={{ margin: "0 0 0 10px" }}>
            {token?.name}
          </Typography>

          <Typography fontSize="20px" fontWeight="500" sx={{ margin: "0 0 0 6px" }}>
            ({token?.symbol})
          </Typography>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Grid container alignItems="center">
              <TextButton
                to={`/token/details/${canisterId}`}
                sx={{
                  margin: "0 0 0 6px",
                }}
              >
                {canisterId}
              </TextButton>

              <Box sx={{ width: "4px" }} />
              <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
            </Grid>
          </Box>
        </Grid>
      </Box>

      <Grid
        container
        alignItems="flex-end"
        mt="16px"
        sx={{
          "@media (max-width: 640px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px 0",
          },
        }}
      >
        <Box>
          <Grid container alignItems="center">
            <Typography
              color="text.primary"
              sx={{
                fontSize: "36px",
                fontWeight: 500,
                margin: "0 10px 0 0",
                lineHeight: "0.8",
              }}
            >
              {formatDollarAmount(token?.priceUSD)}
            </Typography>

            <Typography component="div" sx={{ display: "flex" }}>
              (<PercentageChangeLabel value={token?.priceUSDChange} />)
            </Typography>
          </Grid>
        </Box>

        <Grid item xs>
          <Grid container justifyContent="flex-end">
            <Box sx={{ margin: "0px 0px 0px 10px" }}>
              <Button variant="contained" onClick={handleToSwap}>
                Swap
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

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
        <MainCard level={2} border={false}>
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
                {formatDollarAmount(token?.tvlUSD)}
              </Typography>

              <PercentageChangeLabel value={token?.tvlUSDChange} />
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>24h Trading vol</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(token?.volumeUSD)}
              </Typography>
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>7d Trading vol</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(token?.volumeUSDWeek)}
              </Typography>
            </GridAutoRows>

            {/* <GridAutoRows gap="4px">
              <Typography>
                <Trans>24h Fees</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(token?.feesUSD)}
              </Typography>
            </GridAutoRows> */}
          </GridAutoRows>

          <Box sx={{ margin: "40px 0 0 0" }}>
            <TokenPrices tokenInfo={tokenInfo} graphToken={undefined} />
          </Box>
        </MainCard>

        <TokenChartData canisterId={canisterId} />
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2} border={false}>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Box sx={{ minWidth: "1200px" }}>
              <Typography variant="h3">
                <Trans>Pools</Trans>
              </Typography>

              <Box mt="20px">
                <TokenPools canisterId={canisterId} />
              </Box>
            </Box>
          </Box>
        </MainCard>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2} border={false}>
          <Typography variant="h3">
            <Trans>Transactions</Trans>
          </Typography>

          <Box mt="20px">
            <TokenTransactions canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
