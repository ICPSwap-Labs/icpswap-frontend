import { Typography, Box, Button, useMediaQuery, useTheme } from "ui-component/Mui";
import { useParams, useHistory } from "react-router-dom";
import { Wrapper, Breadcrumbs, TextButton, TokenImage, MainCard } from "ui-component/index";
import { Trans } from "@lingui/macro";
import { formatDollarAmount, formatDollarTokenPrice, mockALinkAndOpen } from "@icpswap/utils";
import { useParsedQueryString, useTokenLatestTVL } from "@icpswap/hooks";
import { useToken as useInfoToken } from "hooks/info/useToken";
import {
  GridAutoRows,
  Proportion,
  TokenCharts,
  Flex,
  ChartView,
  TokenChartsRef,
  ChartViewSelector,
  ChartButton,
} from "@icpswap/ui";
import TokenPools from "ui-component/analytic/TokenPools";
import TokenTransactions from "ui-component/analytic/TokenTransactions";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { swapLink, addLiquidityLink } from "utils/index";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { TokenInfo } from "types/token";
import { useState, useEffect, useRef } from "react";
import { Null } from "@icpswap/types";
import { TokenPriceChart } from "ui-component/Charts/TokenPriceChart";
import { useToken } from "hooks/index";
import { Token } from "@icpswap/swap-sdk";

import { TokenPrices } from "./components/TokenPrice";

interface TokenChartsViewSelectorProps {
  token: TokenInfo | undefined | Token;
  chartView: ChartButton | Null;
  setChartView: (chart: ChartButton) => void;
}

function TokenChartsViewSelector({ token, chartView, setChartView }: TokenChartsViewSelectorProps) {
  const ChartsViewButtons = [
    { label: `Dexscreener`, value: ChartView.DexScreener },
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

export default function TokenDetails() {
  const { canisterId } = useParams<{ canisterId: string }>();
  const history = useHistory();
  const [openTips] = useTips();
  const theme = useTheme();
  const tokenChartsRef = useRef<TokenChartsRef>(null);

  const { path, page } = useParsedQueryString() as { path: string | undefined; page: string | undefined };

  const infoToken = useInfoToken(canisterId);
  const [, token] = useToken(infoToken?.address);

  const { result: tokenTVL } = useTokenLatestTVL(canisterId);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [chartView, setChartView] = useState<Null | ChartButton>({
    label: "DexScreener",
    value: ChartView.DexScreener,
  });

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const handleToSwap = () => {
    mockALinkAndOpen(swapLink(canisterId), "to_swap");
  };

  const handleToAddLiquidity = () => {
    mockALinkAndOpen(addLiquidityLink(canisterId), "to_liquidity");
  };

  const handleToTokenDetails = () => {
    history.push(`/token/details/${canisterId}`);
  };

  useEffect(() => {
    if (chartView && tokenChartsRef.current) {
      tokenChartsRef.current.setView(chartView);
    }
  }, [chartView, tokenChartsRef]);

  return (
    <Wrapper>
      <Breadcrumbs
        prevLink={path ? atob(path) : "/swap"}
        prevLabel={page ? atob(page) : <Trans>Swap Tokens</Trans>}
        currentLabel={<Trans>Details</Trans>}
      />

      <Box mt="20px">
        <Flex fullWidth>
          <TokenImage logo={token?.logo} size="24px" tokenId={token?.address} />

          <Typography fontSize="20px" fontWeight="500" color="text.primary" sx={{ margin: "0 0 0 10px" }}>
            {infoToken?.name}
          </Typography>

          <Typography fontSize="20px" fontWeight="500" sx={{ margin: "0 0 0 6px" }}>
            ({infoToken?.symbol})
          </Typography>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Flex fullWidth>
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
              {formatDollarTokenPrice({ num: infoToken?.priceUSD })}
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

          <Button variant="contained" className="secondary" onClick={handleToTokenDetails}>
            Token Details
          </Button>
          <Button variant="contained" className="secondary" onClick={handleToAddLiquidity}>
            Add Liquidity
          </Button>
          <Button variant="contained" onClick={handleToSwap}>
            Swap
          </Button>
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
        <MainCard level={2}>
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

        <TokenCharts
          ref={tokenChartsRef}
          canisterId={canisterId}
          volume={infoToken?.volumeUSD}
          showTopIfDexScreen={false}
          dexScreenHeight="486px"
          priceChart={<TokenPriceChart token={token} />}
        />
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2}>
          <Box sx={{ width: "100%", overflow: "auto" }}>
            <TokenPools canisterId={canisterId} />
          </Box>
        </MainCard>
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={2}>
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
