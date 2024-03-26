import { useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { Override } from "@icpswap/types";
import { NoData, StaticLoading, TokenImage } from "ui-component/index";
import { useTokenInfo } from "hooks/token/index";
import { PublicPoolOverView } from "types/analytic";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection } from "@icpswap/ui";
import FeeTierLabel from "ui-component/FeeTierLabel";
import Pagination from "ui-component/pagination/cus";
import { useAllPoolsTVL } from "@icpswap/hooks";
import { formatDollarAmount } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2fr repeat(4, 1fr)",
      "@media screen and (max-width: 500px)": {
        gridTemplateColumns: "20px 1fr repeat(4, 1fr)",
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
}

export function PoolTableHeader({ onSortChange, defaultSortFiled = "" }: PoolTableHeaderProps) {
  const classes = useStyles();

  const headers: HeaderType[] = [
    { label: "#", key: "#", sort: false },
    { label: t`Pool`, key: "pool", sort: false },
    { label: t`TVL`, key: "tvlUSD", sort: true },
    { label: t`Volume 24H`, key: "volumeUSD", sort: true },
    { label: t`Volume 7D`, key: "volumeUSD7d", sort: true },
    { label: t`Total Volume`, key: "totalVolumeUSD", sort: true },
  ];

  return (
    <Header className={classes.wrapper} onSortChange={onSortChange} defaultSortFiled={defaultSortFiled}>
      {headers.map((header) => (
        <HeaderCell
          key={header.key}
          field={header.key}
          isSort={header.sort}
          align={header.key !== "#" && header.key !== "pool" ? "right" : "left"}
        >
          {header.label}
        </HeaderCell>
      ))}
    </Header>
  );
}

export function PoolItem({ pool, index }: { pool: PoolData; index: number }) {
  const classes = useStyles();
  const history = useHistory();

  const { result: token0 } = useTokenInfo(pool.token0Id);
  const { result: token1 } = useTokenInfo(pool.token1Id);

  const handlePoolClick = () => {
    history.push(`/swap/pool/details/${pool.pool}`);
  };

  return (
    <TableRow className={classes.wrapper} onClick={handlePoolClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Grid container alignItems="center" gap="0 8px">
          <Box sx={{ display: "flex" }}>
            <TokenImage logo={token0?.logo} tokenId={token0?.canisterId} />
            <TokenImage logo={token1?.logo} tokenId={token1?.canisterId} />
          </Box>

          <BodyCell>
            {pool.token0Symbol} / {pool.token1Symbol}
          </BodyCell>

          <FeeTierLabel feeTier={pool.feeTier} />
        </Grid>
      </BodyCell>
      <BodyCell align="right">{formatDollarAmount(pool.tvlUSD)}</BodyCell>
      <BodyCell align="right">{formatDollarAmount(pool.volumeUSD)}</BodyCell>
      <BodyCell align="right">{formatDollarAmount(pool.volumeUSD7d)}</BodyCell>
      <BodyCell align="right">{formatDollarAmount(pool.totalVolumeUSD)}</BodyCell>
    </TableRow>
  );
}

type PoolData = Override<PublicPoolOverView, { tvlUSD: number }>;

export interface PoolsProps {
  pools: PublicPoolOverView[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

export default function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
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
        return pool.token0Price !== 0 && pool.token1Price !== 0;
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

  return (
    <>
      <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" />

      {(sortedPools ?? []).map((pool, index) => (
        <PoolItem key={pool.pool} index={(page - 1) * maxItems + index + 1} pool={pool} />
      ))}

      {sortedPools?.length === 0 && !loading ? (
        <NoData
          tip={t`If the token or trading pair you're searching for isn't in the Tokenlist, try adjusting the settings to display all tokens and trading pairs.`}
        />
      ) : null}

      {loading ? <StaticLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (pools?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={pools?.length ?? 0} onPageChange={setPage} page={page} />
        ) : null}
      </Box>
    </>
  );
}
