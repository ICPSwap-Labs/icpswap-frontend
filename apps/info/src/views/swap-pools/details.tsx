import { Typography, Box, Grid, useMediaQuery, Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useParams } from "react-router-dom";
import Wrapper from "ui-component/Wrapper";
import { Trans } from "@lingui/macro";
import { formatDollarAmount, formatAmount, mockALinkAndOpen, parseTokenAmount, explorerLink } from "@icpswap/utils";
import { MainCard, TextButton, TokenImage, Breadcrumbs } from "ui-component/index";
import { usePoolLatestTVL } from "@icpswap/hooks";
import { usePool } from "hooks/info/usePool";
import { useTokenInfo } from "hooks/token/index";
import { GridAutoRows, Proportion } from "@icpswap/ui";
import { Theme } from "@mui/material/styles";
import PoolTransactions from "ui-component/analytic/PoolTransactions";
import FeeTierLabel from "ui-component/FeeTierLabel";
import { swapLinkOfPool, addLiquidityLink, cycleValueFormat } from "utils/index";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { useSwapPoolCycles } from "hooks/swap/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useMemo } from "react";

import TokenPrice from "./components/TokenPrice";
import PoolChart from "./components/PoolChart";

export default function SwapPoolDetails() {
  const { canisterId } = useParams<{ canisterId: string }>();

  const { result: pool } = usePool(canisterId);
  const { result: token0 } = useTokenInfo(pool?.token0Id);
  const { result: token1 } = useTokenInfo(pool?.token1Id);

  const { result: poolTVLToken0 } = useTokenBalance(pool?.token0Id, pool?.pool);
  const { result: poolTVLToken1 } = useTokenBalance(pool?.token1Id, pool?.pool);

  const token0Price = useUSDPrice(pool?.token0Id);
  const token1Price = useUSDPrice(pool?.token1Id);

  const poolTvlUsd = useMemo(() => {
    if (!poolTVLToken0 || !poolTVLToken1 || !token0Price || !token1Price || !token0 || !token1) return undefined;

    return formatDollarAmount(
      parseTokenAmount(poolTVLToken1, token1.decimals)
        .multipliedBy(token1Price)
        .plus(parseTokenAmount(poolTVLToken0, token0.decimals).multipliedBy(token0Price))
        .toString(),
    );
  }, [poolTVLToken0, poolTVLToken1, token0Price, token1Price, token0, token1]);

  const { result: latestTVL } = usePoolLatestTVL(canisterId);

  const theme = useTheme() as Theme;

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleToSwap = () => {
    if (!token0 || !token1) return;
    mockALinkAndOpen(swapLinkOfPool(token0.canisterId, token1.canisterId), "to_swap");
  };

  const handleToAddLiquidity = () => {
    if (!token0 || !token1) return;
    const canisterId = token0.canisterId === ICP_TOKEN_INFO.canisterId ? token1.canisterId : token0.canisterId;

    mockALinkAndOpen(addLiquidityLink(canisterId), "to_liquidity");
  };

  const [openTips] = useTips();

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const { result: cycles } = useSwapPoolCycles(canisterId);

  return (
    <Wrapper>
      <Breadcrumbs prevLink="/swap" prevLabel={<Trans>Pools</Trans>} currentLabel={<Trans>Details</Trans>} />

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
              <TokenImage logo={token0?.logo} size="24px" tokenId={token0?.canisterId} />
              <TokenImage logo={token1?.logo} size="24px" tokenId={token1?.canisterId} />
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
                {cycleValueFormat(cycles?.balance)}
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
              <TokenPrice token0={token0} price0={pool?.token0Price} price1={pool?.token1Price} token1={token1} />
              {matchDownMD ? null : <Box sx={{ width: "20px" }} />}
              <TokenPrice token0={token1} price0={pool?.token1Price} price1={pool?.token0Price} token1={token0} />
            </Grid>
          </Box>

          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Box>
                <Button variant="contained" className="secondary" onClick={handleToAddLiquidity}>
                  Add Liquidity
                </Button>
              </Box>
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
                      <TokenImage logo={token0?.logo} tokenId={token0?.canisterId} />

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
                    {formatAmount(parseTokenAmount(poolTVLToken0, token0?.decimals).toNumber())}
                  </Typography>
                </Grid>

                <Grid container alignItems="center">
                  <Grid item xs>
                    <Grid container alignItems="center">
                      <TokenImage logo={token1?.logo} tokenId={token1?.canisterId} />

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
                    {formatAmount(parseTokenAmount(poolTVLToken1, token1?.decimals).toNumber())}
                  </Typography>
                </Grid>
              </GridAutoRows>
            </MainCard>

            <GridAutoRows gap="4px">
              <Typography>
                <Trans>TVL (Real-Time)</Trans>
              </Typography>
              <Typography
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  fontSize: "24px",
                }}
              >
                {poolTvlUsd ?? "--"}
              </Typography>

              <Proportion value={latestTVL?.tvlUSDChange} />
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
                {formatDollarAmount(pool?.volumeUSD)}
              </Typography>
            </GridAutoRows>

            <GridAutoRows gap="4px">
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
                {formatDollarAmount(pool?.volumeUSD7d)}
              </Typography>
            </GridAutoRows>

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
                {pool?.volumeUSD ? formatDollarAmount((pool.volumeUSD * 3) / 1000) : "--"}
              </Typography>
            </GridAutoRows>
          </GridAutoRows>
        </MainCard>

        <PoolChart canisterId={canisterId} token0Price={pool?.token0Price} volume24H={pool?.volumeUSD} />
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
