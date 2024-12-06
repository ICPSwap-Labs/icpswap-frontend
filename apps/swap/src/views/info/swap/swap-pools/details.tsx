import { useMemo, useState } from "react";
import { Typography, Box, useMediaQuery, Button, useTheme } from "components/Mui";
import { useParams } from "react-router-dom";
import { Trans } from "@lingui/macro";
import {
  formatDollarAmount,
  formatAmount,
  mockALinkAndOpen,
  parseTokenAmount,
  explorerLink,
  cycleValueFormat,
} from "@icpswap/utils";
import { MainCard, TextButton, TokenImage, Breadcrumbs, InfoWrapper } from "components/index";
import { usePoolLatestTVL, usePoolAPR, useSwapCyclesInfo } from "@icpswap/hooks";
import { useInfoPool } from "hooks/info/index";
import { useTokenInfo } from "hooks/token/index";
import { GridAutoRows, Proportion, FeeTierPercentLabel, Flex } from "@icpswap/ui";
import { PoolTransactions } from "components/info/swap";
import { swapLinkOfPool, addLiquidityLink } from "utils/info/link";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { PositionTable } from "components/liquidity/PositionTable";

import TokenPrice from "./components/TokenPrice";
import PoolChart from "./components/PoolChart";
import { LiquidityLocksWrapper } from "./components/LiquidityLocks";

enum TabValue {
  Transactions = "Transactions",
  Positions = "Positions",
}

export default function SwapPoolDetails() {
  const { id: canisterId } = useParams<{ id: string }>();
  const theme = useTheme();
  const [openTips] = useTips();

  const [tab, setTab] = useState<TabValue>(TabValue.Transactions);

  const { result: pool } = useInfoPool(canisterId);
  const { result: token0 } = useTokenInfo(pool?.token0Id);
  const { result: token1 } = useTokenInfo(pool?.token1Id);

  const { result: poolTVLToken0 } = useTokenBalance(pool?.token0Id, pool?.pool);
  const { result: poolTVLToken1 } = useTokenBalance(pool?.token1Id, pool?.pool);

  const token0Price = useUSDPriceById(pool?.token0Id);
  const token1Price = useUSDPriceById(pool?.token1Id);

  const poolTvlUSD = useMemo(() => {
    if (!poolTVLToken0 || !poolTVLToken1 || !token0Price || !token1Price || !token0 || !token1) return undefined;

    return parseTokenAmount(poolTVLToken1, token1.decimals)
      .multipliedBy(token1Price)
      .plus(parseTokenAmount(poolTVLToken0, token0.decimals).multipliedBy(token0Price))
      .toString();
  }, [poolTVLToken0, poolTVLToken1, token0Price, token1Price, token0, token1]);

  const { result: latestTVL } = usePoolLatestTVL(canisterId);

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

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const { result: cycles } = useSwapCyclesInfo(canisterId);

  const apr = usePoolAPR({ volumeUSD: pool?.volumeUSD, tvlUSD: poolTvlUSD });

  return (
    <InfoWrapper>
      <Breadcrumbs prevLink="/info-swap" prevLabel={<Trans>Pools</Trans>} currentLabel={<Trans>Details</Trans>} />

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
            <Flex fullWidth>
              <TokenImage logo={token0?.logo} size="24px" tokenId={token0?.canisterId} />
              <TokenImage logo={token1?.logo} size="24px" tokenId={token1?.canisterId} />
              <Typography color="text.primary" sx={{ margin: "0 8px 0 8px" }} fontWeight={500}>
                {pool?.token0Symbol} / {pool?.token1Symbol}
              </Typography>
              <FeeTierPercentLabel feeTier={pool?.feeTier} />
            </Flex>
          </Box>

          <Box sx={{ "@media (max-width: 640px)": { margin: "6px 0 0 0" } }}>
            <Flex gap="0 4px">
              <TextButton link={explorerLink(canisterId)}>{canisterId}</TextButton>
              <Copy size="14px" style={{ cursor: "pointer" }} onClick={handleCopy} />
            </Flex>
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
        <Flex
          fullWidth
          justify="space-between"
          align={matchDownMD ? "start" : "center"}
          sx={{
            gap: matchDownMD ? "10px 0" : "0px 0px",
            flexDirection: matchDownMD ? "column" : "row",
          }}
        >
          <Flex
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
          </Flex>

          <Flex gap="0 10px">
            <Button variant="contained" className="secondary" onClick={handleToAddLiquidity}>
              Add Liquidity
            </Button>
            <Button variant="contained" onClick={handleToSwap}>
              Swap
            </Button>
          </Flex>
        </Flex>
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
        <MainCard level={3}>
          <GridAutoRows gap="24px">
            <MainCard level={4}>
              <GridAutoRows gap="12px">
                <Typography>
                  <Trans>Total Tokens Locked</Trans>
                </Typography>

                <Flex justify="space-between">
                  <Flex gap="0 8px">
                    <TokenImage logo={token0?.logo} tokenId={token0?.canisterId} />

                    <Typography
                      sx={{
                        fontWeight: 500,
                      }}
                      color="text.primary"
                    >
                      {token0?.symbol}
                    </Typography>
                  </Flex>

                  <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                    color="text.primary"
                  >
                    {formatAmount(parseTokenAmount(poolTVLToken0, token0?.decimals).toNumber())}
                  </Typography>
                </Flex>

                <Flex justify="space-between">
                  <Flex gap="0 8px">
                    <TokenImage logo={token1?.logo} tokenId={token1?.canisterId} />

                    <Typography
                      sx={{
                        fontWeight: 500,
                      }}
                      color="text.primary"
                    >
                      {token1?.symbol}
                    </Typography>
                  </Flex>

                  <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                    color="text.primary"
                  >
                    {formatAmount(parseTokenAmount(poolTVLToken1, token1?.decimals).toNumber())}
                  </Typography>
                </Flex>
              </GridAutoRows>

              <Box sx={{ width: "100%", height: "1px", margin: "20px 0 ", background: theme.colors.border1 }} />

              <LiquidityLocksWrapper poolId={canisterId} />
            </MainCard>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px 0",
              }}
            >
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
                  {poolTvlUSD ? formatDollarAmount(poolTvlUSD) : "--"}
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

              <GridAutoRows gap="4px">
                <Typography>
                  <Trans>APR 24H</Trans>
                </Typography>
                <Typography
                  color="text.apr"
                  sx={{
                    fontWeight: 500,
                    fontSize: "24px",
                  }}
                >
                  {apr ?? "--"}
                </Typography>
              </GridAutoRows>
            </Box>
          </GridAutoRows>
        </MainCard>

        <PoolChart canisterId={canisterId} token0Price={pool?.token0Price} volume24H={pool?.volumeUSD} />
      </Box>

      <Box sx={{ marginTop: "20px" }}>
        <MainCard level={3} padding="0px">
          <Flex gap="0 20px" sx={{ padding: "24px" }}>
            {Object.keys(TabValue).map((key) => (
              <Typography
                variant="h3"
                key={key}
                sx={{
                  cursor: "pointer",
                  color: tab === key ? "text.primary" : "text.secondary",
                }}
                onClick={() => setTab(key as TabValue)}
              >
                {TabValue[key]}
              </Typography>
            ))}
          </Flex>

          <Box>
            {tab === TabValue.Transactions ? (
              <PoolTransactions canisterId={canisterId} styleProps={{ padding: "24px" }} />
            ) : null}
            {tab === TabValue.Positions ? <PositionTable poolId={canisterId} /> : null}
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}