import { useState, useMemo } from "react";
import { Typography, Box, Grid, Avatar, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useParams, useHistory } from "react-router-dom";
import Wrapper from "ui-component/Wrapper";
import { Trans, t } from "@lingui/macro";
import { mockALinkAndOpen, formatDollarAmount, formatAmount, explorerLink } from "@icpswap/utils";
import BigNumber from "bignumber.js";
import { MainCard, TextButton, Breadcrumbs } from "ui-component/index";
import { useGraphPool, useGraphPoolTVLChartData } from "hooks/v2";
import { useTokenInfo } from "hooks/token/index";
import { GridAutoRows, Proportion, LineChartAlt, BarChartAlt } from "@icpswap/ui";
import { Theme } from "@mui/material/styles";
import dayjs from "dayjs";
import DensityChart from "ui-component/DensityChart/v2";
import ChartToggle, { ChartView } from "ui-component/analytic-v2/ChartViewsButton";
import PoolTransactions from "ui-component/analytic-v2/PoolTransactions";
import FeeTierLabel from "ui-component/FeeTierLabel";
import { TokenInfo } from "types/token";
import LoadingImage from "assets/images/loading.png";
import { swapLink, cycleValueFormat } from "utils/index";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { useV2SwapPoolCycles } from "hooks/swap/index";

export const chartViews = [
  { label: t`Volume`, key: ChartView.VOL },
  { label: t`TVL`, key: ChartView.TVL },
  { label: t`Liquidity`, key: ChartView.LIQUIDITY },
];

export function PoolChartData({ canisterId, token0Price }: { canisterId: string; token0Price: number | undefined }) {
  const theme = useTheme() as Theme;

  const { result: _chartData, loading } = useGraphPoolTVLChartData(canisterId, 0, 500);

  const chartData = useMemo(() => {
    if (_chartData) {
      return _chartData
        .map((data) => ({
          ...data,
          timestamp: Number(data.timestamp),
        }))
        .sort((a, b) => {
          if (a.timestamp < b.timestamp) return -1;
          if (a.timestamp > b.timestamp) return -1;
          return 0;
        });
    }
  }, [_chartData]);

  const [chartView, setChartView] = useState<ChartView>(ChartView.VOL);
  const [valueLabel, setValueLabel] = useState<string | undefined>();
  const [latestValue, setLatestValue] = useState<number | undefined>();

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((data) => {
        return {
          time: dayjs(Number(data.timestamp * 1000)).format("YYYY-MM-DD HH:mm:ss"),
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
          time: dayjs(Number(data.timestamp * 1000)).format("YYYY-MM-DD HH:mm:ss"),
          value: data.volumeUSD,
        };
      });
    }
    return [];
  }, [chartData]);

  const formattedFeesUSD = useMemo(() => {
    if (chartData) {
      return chartData.map((data) => {
        return {
          time: dayjs(Number(data.timestamp * 1000)).format("YYYY-MM-DD HH:mm:ss"),
          value: data.feesUSD,
        };
      });
    }
    return [];
  }, [chartData]);

  return (
    <MainCard
      level={2}
      sx={{
        position: "relative",
      }}
    >
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
            ? formatDollarAmount(latestValue)
            : chartView === ChartView.VOL
            ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
            : chartView === ChartView.LIQUIDITY
            ? ""
            : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}{" "}
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

      {loading ? (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            top: "0",
            left: "0",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: theme.palette.background.level2,
            zIndex: 100,
          }}
        >
          <img width="80px" height="80px" src={LoadingImage} alt="" />
        </Box>
      ) : null}

      <Box
        sx={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 101,
        }}
      >
        <ChartToggle
          chartViews={chartViews}
          activeView={chartView}
          setActiveChartView={(chartView) => setChartView(chartView)}
        />
      </Box>

      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        {chartView === ChartView.VOL ? (
          <BarChartAlt
            data={formattedVolumeData}
            minHeight={340}
            setValue={setLatestValue}
            setLabel={setValueLabel}
            value={latestValue}
            label={valueLabel}
          />
        ) : chartView === ChartView.TVL ? (
          <LineChartAlt data={formattedTvlData} setLabel={setValueLabel} minHeight={340} setValue={setLatestValue} />
        ) : chartView === ChartView.FEES ? (
          <BarChartAlt
            data={formattedFeesUSD}
            minHeight={340}
            setValue={setLatestValue}
            setLabel={setValueLabel}
            value={latestValue}
            label={valueLabel}
          />
        ) : chartView === ChartView.LIQUIDITY ? (
          <DensityChart address={canisterId} token0Price={token0Price} />
        ) : null}
      </Box>
    </MainCard>
  );
}

export interface TokenPoolPriceProps {
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  price0: number | undefined;
  price1: number | undefined;
}

function TokenPoolPrice({ token0, token1, price0, price1 }: TokenPoolPriceProps) {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const handleClick = () => {
    history.push(`/swap/v2/token/details/${token0?.canisterId}`);
  };

  return price0 && price1 ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: theme.palette.background.level4,
        borderRadius: "8px",
        padding: "8px 10px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Avatar src={token0?.logo} sx={{ width: "18px", height: "18px", marginRight: "6px" }}>
        &nbsp;
      </Avatar>
      <Typography color="text.primary" fontWeight={500}>
        1 {token0?.symbol} = {formatAmount(new BigNumber(price1).dividedBy(price0).toNumber(), 4)} {token1?.symbol}
      </Typography>
    </Box>
  ) : null;
}

export default function SwapPoolDetails() {
  const { canisterId } = useParams<{ canisterId: string }>();

  const { result: pool } = useGraphPool(canisterId);
  const { result: token0 } = useTokenInfo(pool?.token0Id);
  const { result: token1 } = useTokenInfo(pool?.token1Id);

  const theme = useTheme() as Theme;

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleToSwap = () => {
    if (!token0 || !token1) return;
    const canisterId = token0.canisterId === ICP_TOKEN_INFO.canisterId ? token1.canisterId : token0.canisterId;

    mockALinkAndOpen(swapLink(canisterId), "to_swap");
  };

  const [openTips] = useTips();

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const { result: cycles } = useV2SwapPoolCycles(canisterId);

  return (
    <Wrapper>
      <Box>
        <Box>
          <Breadcrumbs prevLink="/swap/v2" prevLabel={<Trans>Pools</Trans>} currentLabel={<Trans>Details</Trans>} />
        </Box>
      </Box>

      <Box mt="20px">
        <Box
          sx={{
            display: "flex",
            gap: "0 10px",
            alignItems: "center",
            "@media (max-width: 640px)": { flexDirection: "column", alignItems: "flex-start" },
          }}
        >
          <Box>
            <Grid container alignItems="center">
              <Avatar src={token0?.logo} sx={{ width: "24px", height: "24px" }}>
                &nbsp;
              </Avatar>
              <Avatar src={token1?.logo} sx={{ width: "24px", height: "24px" }}>
                &nbsp;
              </Avatar>

              <Typography color="text.primary" sx={{ margin: "0 8px 0 8px" }} fontWeight={500}>
                {pool?.token0Symbol} / {pool?.token1Symbol}
              </Typography>

              <FeeTierLabel feeTier={pool?.feeTier} />
            </Grid>
          </Box>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Grid container alignItems="center">
              <TextButton
                sx={{
                  margin: "0 0 0 6px",
                }}
                link={explorerLink(canisterId)}
              >
                {canisterId}
              </TextButton>

              <Box sx={{ width: "4px" }} />
              <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
            </Grid>
          </Box>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Box sx={{ background: theme.palette.background.level4, borderRadius: "8px", padding: "4px 6px" }}>
              <Typography color="text.primary" sx={{ fontSize: "12px" }}>
                {cycleValueFormat(cycles)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt="20px">
        <Grid
          container
          alignItems={matchDownMD ? "start" : "center"}
          flexDirection={matchDownMD ? "column" : "row"}
          sx={{
            gap: matchDownMD ? "10px 0" : "0px 0px",
          }}
        >
          <Box>
            <Grid
              container
              alignItems="center"
              sx={{
                "@media screen and (max-width: 580px)": {
                  flexDirection: "column",
                  gap: "5px 0",
                  alignItems: "start",
                },
              }}
            >
              <TokenPoolPrice token0={token0} price0={pool?.token1Price} price1={pool?.token0Price} token1={token1} />
              {matchDownMD ? null : <Box sx={{ width: "20px" }} />}
              <TokenPoolPrice token0={token1} price0={pool?.token0Price} price1={pool?.token1Price} token1={token0} />
            </Grid>
          </Box>

          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Box sx={{ margin: "0px 0px 0px 10px" }}>
                <Button variant="contained" onClick={handleToSwap}>
                  Swap
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "1em",
          marginTop: "32px",
          "@media screen and (max-width: 840px)": {
            gap: "1em",
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <MainCard level={2}>
          <GridAutoRows gap="24px">
            <MainCard level={4}>
              <GridAutoRows gap="12px">
                <Typography>
                  <Trans>Total Tokens Locked</Trans>
                </Typography>

                <Grid container alignItems="center">
                  <Grid item xs>
                    <Grid container alignItems="center">
                      <Avatar src={token0?.logo} sx={{ width: "20px", height: "20px" }}>
                        &nbsp;
                      </Avatar>

                      <Typography
                        sx={{
                          fontWeight: 500,
                          margin: "0px 0px 0px 8px",
                        }}
                        color="text.primary"
                      >
                        {token0?.symbol}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                    color="text.primary"
                  >
                    {formatAmount(pool?.tvlToken0)}
                  </Typography>
                </Grid>

                <Grid container alignItems="center">
                  <Grid item xs>
                    <Grid container alignItems="center">
                      <Avatar src={token1?.logo} sx={{ width: "20px", height: "20px" }}>
                        &nbsp;
                      </Avatar>

                      <Typography
                        sx={{
                          fontWeight: 500,
                          margin: "0px 0px 0px 8px",
                        }}
                        color="text.primary"
                      >
                        {token1?.symbol}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                    color="text.primary"
                  >
                    {formatAmount(pool?.tvlToken1)}
                  </Typography>
                </Grid>
              </GridAutoRows>
            </MainCard>

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
                {formatDollarAmount(pool?.tvlUSD)}
              </Typography>

              <Proportion value={pool?.tvlUSDChange} />
            </GridAutoRows>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>Volume 24h</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {formatDollarAmount(pool?.volumeUSD)}
              </Typography>

              {/* <Proportion value={pool?.volumeUSDChange}></Proportion> */}
            </GridAutoRows>
          </GridAutoRows>
        </MainCard>

        <PoolChartData canisterId={canisterId} token0Price={pool?.token0Price} />
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2}>
          <Typography variant="h3">
            <Trans>Transactions</Trans>
          </Typography>

          <Box mt="20px">
            <PoolTransactions canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>
    </Wrapper>
  );
}
