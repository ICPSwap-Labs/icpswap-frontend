import { getPoolAPR } from "@icpswap/hooks";
import type { InfoPoolRealTimeDataResponse, Null } from "@icpswap/types";
import { Header, HeaderCell, ImageLoading, NoData, Pagination, SortDirection } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, percentToNum } from "@icpswap/utils";
import { PoolRow } from "components/info/swap/pool";
import { makeStyles } from "components/Mui";
import { HIDDEN_POOLS } from "constants/info";
import { useMediaQueryMD } from "hooks/theme";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PoolInfoWithApr } from "types/info";

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
    { label: t`APR(24H)`, key: "apr", sort: true },
    { label: t("common.volume24h"), key: "volumeUSD24H", sort: true },
    { label: t("common.volume7d"), key: "volumeUSD7D", sort: true },
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
  pools: InfoPoolRealTimeDataResponse[] | Null;
  maxItems?: number;
  loading?: boolean;
}

const DEFAULT_SORT_FILED = "volumeUSD24H";

export default function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const matchDownMD = useMediaQueryMD();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>(DEFAULT_SORT_FILED);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const pools = useMemo(() => {
    if (!_pools) return undefined;

    setPage(1);

    return _pools
      .slice()
      .filter((pool) => {
        return (
          !new BigNumber(pool.token0Price).isEqualTo(0) &&
          !new BigNumber(pool.token1Price).isEqualTo(0) &&
          !HIDDEN_POOLS.includes(pool.poolId)
        );
      })
      .map((pool) => {
        const apr24h = getPoolAPR({ volumeUSD: pool.volumeUSD24H, tvlUSD: pool.tvlUSD });
        return { ...pool, apr24h, apr: apr24h ? percentToNum(apr24h) : 0 } as PoolInfoWithApr;
      });
  }, [_pools]);

  const sortedPools = useMemo(() => {
    return pools
      ? pools
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool = new BigNumber(a[sortField as keyof InfoPoolRealTimeDataResponse] ?? 0).isGreaterThan(
                b[sortField as keyof InfoPoolRealTimeDataResponse] ?? 0,
              )
                ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
                : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

              return bool;
            }
            return 0;
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : undefined;
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
      <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled={DEFAULT_SORT_FILED} align={align} />

      {loading || isUndefinedOrNull(sortedPools) ? (
        <ImageLoading />
      ) : sortedPools.length > 0 ? (
        sortedPools.map((pool, index) => {
          return (
            <PoolRow
              key={pool.poolId}
              wrapperClass={classes.wrapper}
              index={(page - 1) * maxItems + index + 1}
              poolInfo={pool}
              align={align}
            />
          );
        })
      ) : (
        <NoData tip={t("info.swap.pool.empty")} />
      )}

      {!loading && (pools?.length ?? 0) > 0 ? (
        <Pagination maxItems={maxItems} length={pools?.length ?? 0} onPageChange={setPage} page={page} />
      ) : null}
    </>
  );
}
