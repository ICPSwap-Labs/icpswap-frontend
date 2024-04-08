import { useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import { NoData, StaticLoading, TokenImage } from "ui-component/index";
import { useTokenInfo } from "hooks/token/index";
import { Header, HeaderCell, BodyCell, TableRow, SortDirection } from "@icpswap/ui";
import FeeTierLabel from "ui-component/FeeTierLabel";
import Pagination from "ui-component/pagination/cus";
import { useAllPoolsTVL, useTokensFromList } from "@icpswap/hooks";
import { PoolData, usePoolsOfToken } from "hooks/info/usePoolsOfToken";
import InTokenListCheck from "ui-component/InTokenListCheck";
import { ICP } from "@icpswap/tokens";
import { formatDollarAmount } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2.5fr repeat(4, 1fr)",
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
    { label: t`Volume 7D`, key: "volume7D", sort: true },
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
        <Grid container alignItems="center">
          <TokenImage logo={token0?.logo} tokenId={token0?.canisterId} />
          <TokenImage logo={token1?.logo} tokenId={token1?.canisterId} />

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
      <BodyCell>{formatDollarAmount(pool.volume7D)}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.totalVolumeUSD)}</BodyCell>
    </TableRow>
  );
}

export interface PoolsProps {
  pools: PoolData[] | undefined | null;
  maxItems?: number;
  loading?: boolean;
}

export function Pools({ pools: _pools, maxItems = 10, loading }: PoolsProps) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const { result: allPoolsTVL } = useAllPoolsTVL();

  const pools: PoolData[] = useMemo(() => {
    if (!_pools || !allPoolsTVL) return [];

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
                a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
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

export interface TokenPoolsProps {
  canisterId: string;
}

export default function TokenPools({ canisterId }: TokenPoolsProps) {
  const [checked, setChecked] = useState(false);
  const { pools, loading } = usePoolsOfToken(canisterId);

  const { result: tokenList } = useTokensFromList();

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
  };

  const filteredAllPools = useMemo(() => {
    if (!pools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return pools
      .filter((pool) => {
        if (checked) {
          return tokenListIds.includes(pool.token0Id) && tokenListIds.includes(pool.token1Id);
        }

        return pool;
      })
      .filter((pool) => pool.feeTier === BigInt(3000));
  }, [pools, checked, tokenList]);

  return (
    <Box sx={{ minWidth: "1200px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "10px 0",
          },
        }}
      >
        <Typography variant="h4">
          <Trans>Pools</Trans>
        </Typography>

        <InTokenListCheck onChange={handleCheckChange} checked={checked} />
      </Box>

      <Box mt="20px">
        <Pools pools={filteredAllPools} loading={loading} />
      </Box>
    </Box>
  );
}
