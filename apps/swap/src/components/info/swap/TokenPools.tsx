import { useState, useMemo } from "react";
import { makeStyles, Typography, Box } from "components/Mui";
import { NoData, ImageLoading } from "components/index";
import { Header, HeaderCell, SortDirection, OnlyTokenList } from "@icpswap/ui";
import Pagination from "components/pagination/cus";
import { useTokensFromList, getPoolAPR, useInfoTokenPools } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { HIDDEN_POOLS } from "constants/info";
import { useTranslation } from "react-i18next";
import { PoolRow } from "components/info/swap/pool";
import { PoolInfoWithApr } from "types/info";
import { BigNumber, percentToNum } from "@icpswap/utils";

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

const DEFAULT_SORT_FILED = "volumeUSD24H";

interface PoolTableHeaderProps {
  onSortChange: (sortField: string, sortDirection: SortDirection) => void;
  defaultSortFiled?: string;
}

function PoolTableHeader({ onSortChange, defaultSortFiled = "" }: PoolTableHeaderProps) {
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
        <HeaderCell key={header.key} field={header.key} isSort={header.sort}>
          {header.label}
        </HeaderCell>
      ))}
    </Header>
  );
}

const PAGE_SIZE = 10;

export interface TokenPoolsProps {
  canisterId: string;
}

export function TokenPools({ canisterId }: TokenPoolsProps) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);
  const [sortField, setSortField] = useState<string>(DEFAULT_SORT_FILED);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const classes = useStyles();

  const [page, setPage] = useState(1);

  const { result: tokenList } = useTokensFromList();
  const { result: tokenPools, loading } = useInfoTokenPools(canisterId);

  const allPoolsOfToken = useMemo(() => {
    if (!tokenPools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return tokenPools
      .filter((pool) => {
        return (
          (pool.token0LedgerId === canisterId || pool.token1LedgerId === canisterId) &&
          !new BigNumber(pool.token0Price).isEqualTo(0) &&
          !new BigNumber(pool.token1Price).isEqualTo(0) &&
          pool.poolFee === 3000 &&
          !HIDDEN_POOLS.includes(pool.poolId)
        );
      })
      .filter((pool) => {
        if (checked) return tokenListIds.includes(pool.token0LedgerId) && tokenListIds.includes(pool.token1LedgerId);
        return !!pool;
      });
  }, [tokenPools, canisterId, tokenList, checked]);

  const slicedPoolsOfToken = useMemo(() => {
    if (!allPoolsOfToken) return undefined;

    return allPoolsOfToken
      .map((pool) => {
        const apr24h = getPoolAPR({ volumeUSD: pool.volumeUSD24H ?? 0, tvlUSD: pool.tvlUSD ?? 0 });
        return { ...pool, apr24h, apr: apr24h ? percentToNum(apr24h) : 0 } as PoolInfoWithApr;
      })
      .sort((a, b) => {
        if (a && b && !!sortField) {
          const bool =
            a[sortField as keyof PoolInfoWithApr] > b[sortField as keyof PoolInfoWithApr]
              ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
              : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

          return bool;
        }
        return 0;
      })
      .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page);
  }, [allPoolsOfToken, page, sortField, sortDirection]);

  const handleCheckChange = (checked: boolean) => {
    setChecked(checked);
  };

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  return (
    <Box sx={{ minWidth: "1136px" }}>
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
        <Typography variant="h4">{t("common.pools")}</Typography>

        <OnlyTokenList onChange={handleCheckChange} checked={checked} />
      </Box>

      <Box mt="20px">
        {slicedPoolsOfToken && slicedPoolsOfToken.length > 0 ? (
          <>
            <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled={DEFAULT_SORT_FILED} />
            {(slicedPoolsOfToken ?? []).map((pool, index) => {
              return (
                <PoolRow
                  key={pool.poolId}
                  index={(page - 1) * PAGE_SIZE + index + 1}
                  poolInfo={pool}
                  wrapperClass={classes.wrapper}
                />
              );
            })}
          </>
        ) : loading ? (
          <ImageLoading loading={loading} />
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
