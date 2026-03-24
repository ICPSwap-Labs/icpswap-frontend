import { useLatestPools, usePoolAPR } from "@icpswap/hooks";
import type { LatestPool } from "@icpswap/types";
import { APRPanel, BodyCell, Flex, Header, HeaderCell, Link, LoadingRow, NoData, TableRow } from "@icpswap/ui";
import { formatDollarAmount, formatDollarTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { TimestampCell, TokenImage } from "components/index";
import { ToolsWrapper } from "components/info/tools/index";
import { Box, makeStyles, type Theme, Typography, useTheme } from "components/Mui";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    wrapper: {
      display: "grid",
      gap: "1em",
      padding: "24px",
      alignItems: "center",
      gridTemplateColumns: "repeat(4, 1fr) 160px",
      borderBottom: `1px solid ${theme.palette.background.level1}`,
      "@media screen and (max-width: 780px)": {
        gridTemplateColumns: "repeat(4, 1fr) 160px",
        padding: "16px",
      },
    },
  };
});

interface PoolRowProps {
  pool: LatestPool;
  className?: string;
}

function PoolRow({ pool, className }: PoolRowProps) {
  const apr24h = usePoolAPR({ volumeUSD: pool.volumeUSD24H, tvlUSD: pool.tvlUSD });

  return (
    <Link to={`/info-swap/pool/details/${pool.poolId}`}>
      <TableRow className={className}>
        <BodyCell>
          <Flex gap="0 8px">
            <Flex>
              <TokenImage tokenId={pool.token0LedgerId} logo={generateLogoUrl(pool.token0LedgerId ?? "")} />
              <TokenImage tokenId={pool.token1LedgerId} logo={generateLogoUrl(pool.token1LedgerId ?? "")} />
            </Flex>
            <Flex>
              <BodyCell>{pool.token0Symbol}</BodyCell>
              <BodyCell>/</BodyCell>
              <BodyCell>{pool.token1Symbol}</BodyCell>
            </Flex>
          </Flex>
        </BodyCell>
        <BodyCell align="right">{formatDollarTokenPrice(pool.tvlUSD)}</BodyCell>
        <BodyCell align="right">{formatDollarAmount(pool.volumeUSD24H)}</BodyCell>
        <BodyCell align="right">{apr24h ? <APRPanel value={apr24h} /> : "--"}</BodyCell>
        <BodyCell align="right">
          <TimestampCell timestamp={pool.createTime} />
        </BodyCell>
      </TableRow>
    </Link>
  );
}

export function LatestPools() {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const { data: latestPools, isPending } = useLatestPools();

  return (
    <ToolsWrapper
      title={
        <Flex
          fullWidth
          justify="space-between"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px 0",
            },
          }}
        >
          <Typography color="inherit" fontSize="inherit" fontWeight="inherit">
            New Pools (72h)
          </Typography>
        </Flex>
      }
    >
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ minWidth: "1152px" }}>
          <Box>
            <Header className={classes.wrapper} borderBottom={`1px solid ${theme.palette.border.level1}`}>
              <HeaderCell field="common.pool">{t("common.pool")}</HeaderCell>

              <HeaderCell align="right" field="tvl">
                {t("common.tvl")}
              </HeaderCell>

              <HeaderCell align="right" field="change">
                {t("common.volume24h")}
              </HeaderCell>

              <HeaderCell align="right" field="liquidity">
                {t("common.apr")}
              </HeaderCell>

              <HeaderCell align="right" field="added">
                Created
              </HeaderCell>
            </Header>

            {isPending || isUndefinedOrNull(latestPools) ? (
              <Box sx={{ padding: "16px" }}>
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </LoadingRow>
              </Box>
            ) : latestPools.length > 0 ? (
              latestPools.map((pool, index) => (
                <PoolRow
                  key={`${pool.token0Symbol}_${pool.token1Symbol}_${index}`}
                  pool={pool}
                  className={classes.wrapper}
                />
              ))
            ) : (
              <NoData tip={t("info.tools.latest.pools.empty")} />
            )}
          </Box>
        </Box>
      </Box>
    </ToolsWrapper>
  );
}
