import { useState, useMemo } from "react";
import { Box, useMediaQuery, makeStyles, useTheme } from "components/Mui";
import { PublicPoolOverView } from "@icpswap/types";
import { Header, HeaderCell, SortDirection, NoData, ImageLoading } from "@icpswap/ui";
import Pagination from "components/pagination/cus";
import { useAllPoolsTVL } from "@icpswap/hooks";
import { HIDDEN_POOLS } from "constants/info";
import { useTranslation } from "react-i18next";
import { PoolRow } from "components/info/swap/pool";

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

export type HeaderType = {
  label: string;
  key: string;
  sort: boolean;
  end?: boolean;
};

export interface PoolTableHeaderProps {
  onSortChange: (sortField: string, sortDirection: SortDirection) => void;
  defaultSortFiled?: string;
  align: "right" | "left";
}

export function PoolTableHeader({ onSortChange, defaultSortFiled = "", align }: PoolTableHeaderProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const headers: HeaderType[] = [
    { label: "#", key: "#", sort: false },
    { label: t`Pool`, key: "pool", sort: false },
    { label: t`TVL`, key: "tvlUSD", sort: true },
    { label: t`APR(24H)`, key: "apr", sort: false },
    { label: t("common.volume24h"), key: "volumeUSD", sort: true },
    { label: t("common.volume7d"), key: "volumeUSD7d", sort: true },
    { label: t("common.total.volume"), key: "totalVolumeUSD", sort: true },
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

export interface PoolsProps {
  pools: PublicPoolOverView[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

export default function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const classes = useStyles();

  const { result: allPoolsTVL } = useAllPoolsTVL();

  const pools = useMemo(() => {
    if (!_pools || !allPoolsTVL) return [];

    setPage(1);

    return _pools.slice().filter((pool) => {
      return pool.token0Price !== 0 && pool.token1Price !== 0 && !HIDDEN_POOLS.includes(pool.pool);
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

      {(sortedPools ?? []).map((pool, index) => {
        const tvlUSD = allPoolsTVL?.find(([poolId]) => poolId === pool.pool)?.[1];

        return (
          <PoolRow
            key={pool.pool}
            wrapperClass={classes.wrapper}
            index={(page - 1) * maxItems + index + 1}
            poolInfo={pool}
            align={align}
            tvlUSD={tvlUSD}
          />
        );
      })}

      {sortedPools?.length === 0 && !loading ? <NoData tip={t("info.swap.pool.empty")} /> : null}

      {loading ? <ImageLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (pools?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={pools?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
