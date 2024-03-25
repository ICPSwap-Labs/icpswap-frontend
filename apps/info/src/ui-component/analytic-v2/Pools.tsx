import { useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { t } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { NoData, StaticLoading, TokenImage } from "ui-component/index";
import { useTokenInfo } from "hooks/token/index";
import { Pool } from "types/analytic-v2";
import { Header, HeaderCell, BodyCell, Row, SortDirection } from "ui-component/Table/index";
import FeeTierLabel from "ui-component/FeeTierLabel";
import Pagination from "ui-component/pagination/cus";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2.5fr repeat(3, 1fr)",

      "@media screen and (max-width: 500px)": {
        gridTemplateColumns: "20px 1fr repeat(3, 1fr)",
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
    { label: t`Total Volume`, key: "totalVolumeUSD", sort: true },
  ];

  return (
    <Header className={classes.wrapper} onSortChange={onSortChange} defaultSortFiled={defaultSortFiled}>
      {headers.map((header) => (
        <HeaderCell key={header.key} field={header.key} isSort={header.sort}>
          {header.label}
        </HeaderCell>
      ))}
    </Header>
  );
}

export function PoolItem({ pool, index }: { pool: Pool; index: number }) {
  const classes = useStyles();
  const history = useHistory();

  const { result: token0 } = useTokenInfo(pool.token0Id);
  const { result: token1 } = useTokenInfo(pool.token1Id);

  const handlePoolClick = () => {
    history.push(`/swap/v2/pool/details/${pool.pool}`);
  };

  return (
    <Row className={classes.wrapper} onClick={handlePoolClick}>
      <BodyCell>{index}</BodyCell>
      <BodyCell>
        <Grid container alignItems="center">
          <TokenImage logo={token0?.logo} />
          <TokenImage logo={token1?.logo} />

          <Typography
            sx={{
              margin: "0 8px 0 8px",
              "@media screen and (max-width: 500px)": {
                fontSize: "12px",
              },
            }}
            color="text.primary"
          >
            {pool.token0Symbol} / {pool.token1Symbol}
          </Typography>

          <FeeTierLabel feeTier={pool.feeTier} />
        </Grid>
      </BodyCell>
      <BodyCell>{formatDollarAmount(pool.tvlUSD)}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.volumeUSD)}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.totalVolumeUSD)}</BodyCell>
    </Row>
  );
}

export interface PoolsProps {
  pools: Pool[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

export default function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("totalVolumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const pools = useMemo(() => {
    return _pools
      ? _pools.slice().filter((pool) => {
          return pool.tvlUSD !== Infinity && pool.tvlUSD !== 0;
        })
      : [];
  }, [_pools]);

  const sortedPools = useMemo(() => {
    return pools
      ? pools
          .slice()
          .sort((a, b) => {
            if (a && b && !!sortField) {
              const bool =
                a[sortField as keyof Pool] > b[sortField as keyof Pool]
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
      <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="totalVolumeUSD" />

      {(sortedPools ?? []).map((pool, index) => (
        <PoolItem key={pool.pool} index={(page - 1) * maxItems + index + 1} pool={pool} />
      ))}

      {sortedPools?.length === 0 && !loading ? <NoData /> : null}

      {loading ? <StaticLoading loading={loading} /> : null}

      <Box mt="20px">
        {!loading && (pools?.length ?? 0) > 0 ? (
          <Pagination maxItems={maxItems} length={pools?.length ?? 0} onPageChange={setPage} />
        ) : null}
      </Box>
    </>
  );
}
