import { Box, Typography, makeStyles, useTheme, Theme } from "components/Mui";
import { formatDollarAmount, formatDollarTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { Header, HeaderCell, Flex, LoadingRow, NoData, BodyCell, TableRow, APRPanel } from "@icpswap/ui";
import { ToolsWrapper } from "components/info/tools/index";
import { useTranslation } from "react-i18next";
import { useLatestPools } from "@icpswap/hooks";
import { LatestPool } from "@icpswap/types";
import { TokenImage, TimestampCell } from "components/index";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { usePoolAPR } from "@icpswap/hooks";

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
    <TableRow className={className}>
      <BodyCell>
        <Flex gap="0 8px">
          <Flex>
            <TokenImage tokenId={pool.token0LedgerId} logo={generateLogoUrl(pool.token0LedgerId ?? "")} />
            <TokenImage tokenId={pool.token1LedgerId} logo={generateLogoUrl(pool.token0LedgerId ?? "")} />
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
            New Pools (Last 72h)
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
                Added
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
              <>
                {latestPools.map((pool, index) => (
                  <PoolRow
                    key={`${pool.token0Symbol}_${pool.token1Symbol}_${index}`}
                    pool={pool}
                    className={classes.wrapper}
                  />
                ))}
              </>
            ) : (
              <NoData tip={t("info.tools.swap.transactions.empty")} />
            )}
          </Box>
        </Box>
      </Box>
    </ToolsWrapper>
  );
}
