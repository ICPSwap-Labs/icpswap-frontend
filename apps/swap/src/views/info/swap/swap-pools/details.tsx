import { useState } from "react";
import { Typography, Box, useMediaQuery, Button, useTheme } from "components/Mui";
import { useParams } from "react-router-dom";
import {
  formatDollarAmount,
  formatAmount,
  parseTokenAmount,
  explorerLink,
  cycleValueFormat,
  BigNumber,
} from "@icpswap/utils";
import { MainCard, TextButton, TokenImage, Breadcrumbs, InfoWrapper, TokenPoolPrice } from "components/index";
import { usePoolLatestTVL, usePoolAPR, useSwapCyclesInfo } from "@icpswap/hooks";
import { useInfoPool } from "hooks/info/index";
import { GridAutoRows, Proportion, FeeTierPercentLabel, Flex, Link } from "@icpswap/ui";
import { PoolTransactions } from "components/info/swap";
import { swapLinkOfPool, addLiquidityLink } from "utils/info/link";
import { ICP_TOKEN_INFO } from "@icpswap/tokens";
import { Copy } from "react-feather";
import copyToClipboard from "copy-to-clipboard";
import { useTips, TIP_SUCCESS } from "hooks/useTips";
import { PositionTable } from "components/liquidity/PositionTable";
import { useToken } from "hooks/index";
import { useTranslation } from "react-i18next";
import { Token } from "@icpswap/swap-sdk";
import { usePoolTokenBalanceTvl } from "hooks/info/usePoolTokenBalanceTvl";

import { PoolChart } from "./components/PoolChart";
import { LiquidityLocksWrapper } from "./components/LiquidityLocks";

interface PoolTokenTvlProps {
  token: Token | undefined;
  amount: BigNumber | undefined;
  tvl: string | undefined;
}

function PoolTokenTvl({ token, amount, tvl }: PoolTokenTvlProps) {
  return (
    <Flex justify="space-between" gap="0 12px">
      <Flex gap="0 8px">
        <TokenImage logo={token?.logo} tokenId={token?.address} />
        <Typography
          sx={{
            color: "text.primary",
            fontWeight: 500,
            maxWidth: "106px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {token?.symbol}
        </Typography>
      </Flex>

      <Flex vertical gap="4px 0">
        <Typography color="text.primary" fontWeight={500}>
          {amount ? formatAmount(parseTokenAmount(amount, token?.decimals).toNumber()) : ""}
        </Typography>

        <Typography fontSize="12px">{tvl ? formatDollarAmount(tvl) : ""}</Typography>
      </Flex>
    </Flex>
  );
}

enum TabValue {
  Transactions = "Transactions",
  Positions = "Positions",
}

export default function SwapPoolDetails() {
  const { t } = useTranslation();
  const { id: canisterId } = useParams<{ id: string }>();
  const theme = useTheme();
  const [openTips] = useTips();

  const [tab, setTab] = useState<TabValue>(TabValue.Transactions);

  const { result: pool } = useInfoPool(canisterId);
  const [, token0] = useToken(pool?.token0Id);
  const [, token1] = useToken(pool?.token1Id);

  const { poolTvlUSD, token0TvlUSD, token1TvlUSD, token0Balance, token1Balance } = usePoolTokenBalanceTvl({ pool });

  const { result: latestTVL } = usePoolLatestTVL(canisterId);

  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));

  const handleCopy = () => {
    copyToClipboard(canisterId);
    openTips("Copy Successfully", TIP_SUCCESS);
  };

  const { result: cycles } = useSwapCyclesInfo(canisterId);

  const apr = usePoolAPR({ volumeUSD: pool?.volumeUSD, tvlUSD: poolTvlUSD });

  return (
    <InfoWrapper>
      <Breadcrumbs prevLink="/info-swap" prevLabel={t("common.pools")} currentLabel={t("common.details")} />

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
              <TokenImage logo={token0?.logo} size="24px" tokenId={token0?.address} />
              <TokenImage logo={token1?.logo} size="24px" tokenId={token1?.address} />
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
              gap: "0 20px",
              "@media screen and (max-width: 580px)": {
                flexDirection: "column",
                gap: "5px 0",
                alignItems: "start",
              },
            }}
          >
            <Link to={`/info-swap/token/details/${token0?.address}`}>
              <TokenPoolPrice
                tokenA={token0}
                priceA={pool?.token0Price}
                priceB={pool?.token1Price}
                tokenB={token1}
                fontSize="14px"
                wrapperSx={{
                  background: theme.palette.background.level4,
                  borderRadius: "8px",
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
              />
            </Link>

            <Link to={`/info-swap/token/details/${token1?.address}`}>
              <TokenPoolPrice
                tokenA={token1}
                priceA={pool?.token1Price}
                priceB={pool?.token0Price}
                tokenB={token0}
                fontSize="14px"
                wrapperSx={{
                  background: theme.palette.background.level4,
                  borderRadius: "8px",
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
              />
            </Link>
          </Flex>

          {token0 && token1 ? (
            <Flex gap="0 10px">
              <Link
                link={addLiquidityLink(token0.address === ICP_TOKEN_INFO.canisterId ? token1.address : token0.address)}
              >
                <Button variant="contained" className="secondary">
                  {t("swap.add.liquidity")}
                </Button>
              </Link>

              <Link link={swapLinkOfPool(token0.address, token1.address)}>
                <Button variant="contained">{t("common.swap")}</Button>
              </Link>
            </Flex>
          ) : null}
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
                <Typography>{t("info.swap.pool.balance")}</Typography>
                <PoolTokenTvl token={token0} tvl={token0TvlUSD} amount={token0Balance} />
                <PoolTokenTvl token={token1} tvl={token1TvlUSD} amount={token1Balance} />
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
                <Typography>{t("info.swap.pool.tvl.realTime")}</Typography>
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
                <Typography>{t("common.volume24h")}</Typography>
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
                <Typography>{t("common.volume7d")}</Typography>
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
                <Typography>{t("common.fee24h")}</Typography>
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
                <Typography>{t("common.apr24h")}</Typography>
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

        <PoolChart
          canisterId={canisterId}
          token0Price={pool ? new BigNumber(pool.token1Price).dividedBy(pool.token0Price).toNumber() : undefined}
          volume24H={pool?.volumeUSD}
        />
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
            {tab === TabValue.Positions ? <PositionTable poolId={canisterId} padding="24px" /> : null}
          </Box>
        </MainCard>
      </Box>
    </InfoWrapper>
  );
}
