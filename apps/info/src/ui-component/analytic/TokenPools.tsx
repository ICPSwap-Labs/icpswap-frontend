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
import { useAllPoolsTVL, useTokensFromList, useNodeInfoAllPools } from "@icpswap/hooks";
import { PoolData } from "hooks/info/usePoolsOfToken";
import InTokenListCheck from "ui-component/InTokenListCheck";
import { ICP } from "@icpswap/tokens";
import { formatDollarAmount, BigNumber } from "@icpswap/utils";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 2fr 1fr repeat(4, 1fr)",
      "@media screen and (max-width: 500px)": {
        gridTemplateColumns: "20px 1fr 1fr repeat(4, 1fr)",
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
    { label: t`APR(24H)`, key: "apr", sort: false },
    { label: t`Volume 24H`, key: "volumeUSD", sort: true },
    { label: t`Volume 7D`, key: "volumeUSD7d", sort: true },
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

export interface PoolItemProps {
  pool: PoolData;
  index: number;
}

export function PoolItem({ pool, index }: PoolItemProps) {
  const classes = useStyles();
  const history = useHistory();

  const { result: token0 } = useTokenInfo(pool.token0Id);
  const { result: token1 } = useTokenInfo(pool.token1Id);

  const handlePoolClick = () => {
    history.push(`/swap/pool/details/${pool.pool}`);
  };

  const apr = useMemo(() => {
    if (!pool) return undefined;

    const fee24h = (pool.volumeUSD * 3) / 1000;

    return `${new BigNumber(fee24h)
      .dividedBy(pool.tvlUSD)
      .multipliedBy(360 * 0.8)
      .multipliedBy(100)
      .toFixed(2)}%`;
  }, [pool]);

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
      <BodyCell color="text.theme-secondary">{apr ?? "--"}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.volumeUSD)}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.volumeUSD7d)}</BodyCell>
      <BodyCell>{formatDollarAmount(pool.totalVolumeUSD)}</BodyCell>
    </TableRow>
  );
}

const PAGE_SIZE = 10;

export interface TokenPoolsProps {
  canisterId: string;
}

export default function TokenPools({ canisterId }: TokenPoolsProps) {
  const [checked, setChecked] = useState(true);
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);

  const [page, setPage] = useState(1);

  const { result: allPoolsTVL } = useAllPoolsTVL();
  const { result: tokenList } = useTokensFromList();
  const { result: allSwapPools, loading } = useNodeInfoAllPools();

  const allPoolsOfToken = useMemo(() => {
    if (!allSwapPools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return allSwapPools
      .filter((pool) => {
        return (
          (pool.token0Id === canisterId || pool.token1Id === canisterId) &&
          pool.token0Price !== 0 &&
          pool.token1Price !== 0 &&
          pool.feeTier === BigInt(3000)
        );
      })
      .filter((pool) => {
        if (checked) return tokenListIds.includes(pool.token0Id) && tokenListIds.includes(pool.token1Id);
        return !!pool;
      });
  }, [allSwapPools, canisterId, tokenList, checked]);

  const slicedPoolsOfToken = useMemo(() => {
    if (!allPoolsOfToken || !allPoolsTVL) return undefined;

    return allPoolsOfToken
      .map((pool) => {
        const tvlUSD = allPoolsTVL.find((poolTVL) => poolTVL[0] === pool.pool);
        return { ...pool, tvlUSD: tvlUSD ? tvlUSD[1] : 0 } as PoolData;
      })
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
      .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
  }, [allPoolsOfToken, allPoolsTVL, page, sortField, sortDirection]);

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
  };

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

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
        {slicedPoolsOfToken && slicedPoolsOfToken.length > 0 ? (
          <>
            <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" />
            {(slicedPoolsOfToken ?? []).map((pool, index) => (
              <PoolItem key={pool.pool} index={(page - 1) * PAGE_SIZE + index + 1} pool={pool} />
            ))}
          </>
        ) : loading ? (
          <StaticLoading loading={loading} />
        ) : (
          <NoData />
        )}

        <Box mt="20px">
          {!loading && allPoolsOfToken && allPoolsOfToken.length > 0 ? (
            <Pagination maxItems={PAGE_SIZE} length={allPoolsOfToken?.length ?? 0} onPageChange={setPage} page={page} />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
