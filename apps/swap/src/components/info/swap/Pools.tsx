import { useState, useMemo } from "react";
import { Box, Grid, useMediaQuery, makeStyles, useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { Override, PublicPoolOverView } from "@icpswap/types";
import { ImageLoading, TokenImage } from "components/index";
import { useToken } from "hooks/index";
import {
  Header,
  HeaderCell,
  BodyCell,
  TableRow,
  SortDirection,
  FeeTierPercentLabel,
  APRPanel,
  NoData,
} from "@icpswap/ui";
import Pagination from "components/pagination/cus";
import { useAllPoolsTVL, usePoolAPR } from "@icpswap/hooks";
import { formatDollarAmount } from "@icpswap/utils";
import { HIDDEN_POOLS } from "constants/info";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2fr 1fr repeat(4, 1fr)",
      "@media screen and (max-width: 500px)": {
        gridTemplateColumns: "20px 260px 1fr repeat(4, 1fr)",
      },
    },
  };
});

type HeaderType = {
  label: string;
  key: string;
  sort: boolean;
  end?: boolean;
};

interface PoolTableHeaderProps {
  onSortChange: (sortField: string, sortDirection: SortDirection) => void;
  defaultSortFiled?: string;
  align: "right" | "left";
}

function PoolTableHeader({ onSortChange, defaultSortFiled = "", align }: PoolTableHeaderProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const headers: HeaderType[] = [
    { label: "#", key: "#", sort: false },
    { label: t`Pool`, key: "pool", sort: false },
    { label: t`TVL`, key: "tvlUSD", sort: true },
    { label: t`APR(24H)`, key: "apr", sort: false },
    { label: t("common.volume24h"), key: "volumeUSD", sort: true },
    { label: t("common.volume7d"), key: "volumeUSD7d", sort: true },
    { label: t`Total Volume`, key: "totalVolumeUSD", sort: true },
  ];

  return (
    <Header className={classes.wrapper} onSortChange={onSortChange} defaultSortFiled={defaultSortFiled}>
      {headers.map((header) => (
        <HeaderCell
          key={header.key}
          field={header.key}
          isSort={header.sort}
          align={header.key !== "#" && header.key !== "pool" ? align : "left"}
        >
          {header.label}
        </HeaderCell>
      ))}
    </Header>
  );
}

interface PoolItemProps {
  pool: PoolData;
  index: number;
  align: "right" | "left";
}

function PoolItem({ pool, index, align }: PoolItemProps) {
  const classes = useStyles();
  const history = useHistory();

  const [, token0] = useToken(pool.token0Id);
  const [, token1] = useToken(pool.token1Id);

  const handlePoolClick = () => {
    history.push(`/info-swap/pool/details/${pool.pool}`);
  };

  const apr24h = usePoolAPR({ volumeUSD: pool.volumeUSD, tvlUSD: pool.tvlUSD });

  return (
    <TableRow className={classes.wrapper} onClick={handlePoolClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Grid container alignItems="center" gap="0 8px">
          <Box sx={{ display: "flex" }}>
            <TokenImage logo={token0?.logo} tokenId={token0?.address} />
            <TokenImage logo={token1?.logo} tokenId={token1?.address} />
          </Box>

          <BodyCell>
            {pool.token0Symbol} / {pool.token1Symbol}
          </BodyCell>

          <FeeTierPercentLabel feeTier={pool.feeTier} />
        </Grid>
      </BodyCell>
      <BodyCell align={align}>{formatDollarAmount(pool.tvlUSD)}</BodyCell>
      <BodyCell align={align}>{apr24h ? <APRPanel value={apr24h} /> : "--"}</BodyCell>
      <BodyCell align={align}>{formatDollarAmount(pool.volumeUSD)}</BodyCell>
      <BodyCell align={align}>{formatDollarAmount(pool.volumeUSD7d)}</BodyCell>
      <BodyCell align={align}>{formatDollarAmount(pool.totalVolumeUSD)}</BodyCell>
    </TableRow>
  );
}

type PoolData = Override<PublicPoolOverView, { tvlUSD: number }>;

export interface PoolsProps {
  pools: PublicPoolOverView[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

export function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const { result: allPoolsTVL } = useAllPoolsTVL();

  const pools: PoolData[] = useMemo(() => {
    if (!_pools || !allPoolsTVL) return [];

    setPage(1);

    return _pools
      .slice()
      .filter((pool) => {
        return pool.token0Price !== 0 && pool.token1Price !== 0 && !HIDDEN_POOLS.includes(pool.pool);
      })
      .map((pool) => {
        const tvlUSD = allPoolsTVL.find((poolTVL) => poolTVL[0] === pool.pool);

        return { ...pool, tvlUSD: tvlUSD ? tvlUSD[1] : 0 };
      });
  }, [_pools, allPoolsTVL]);

  const sortedPools = useMemo(() => {
    return pools
      ? pools
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof PublicPoolOverView] > b[sortField as keyof PublicPoolOverView]
                  ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                  : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : [];
  }, [pools, maxItems, page, sortField, sortDirection]);

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const align = useMemo(() => {
    if (matchDownMD) return "left";
    return "right";
  }, [matchDownMD]);

  return (
    <>
      <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" align={align} />

      {(sortedPools ?? []).map((pool, index) => (
        <PoolItem key={pool.pool} index={(page - 1) * maxItems + index + 1} pool={pool} align={align} />
      ))}

      {sortedPools?.length === 0 && !loading ? <NoData tip={t("info.swap.pool.description")} /> : null}

      {loading ? <ImageLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (pools?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={pools?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
