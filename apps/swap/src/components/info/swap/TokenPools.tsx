import { useState, useMemo } from "react";
import { makeStyles, Typography, Box } from "components/Mui";
import { NoData, ImageLoading } from "components/index";
import { Header, HeaderCell, SortDirection, OnlyTokenList } from "@icpswap/ui";
import Pagination from "components/pagination/cus";
import { useAllPoolsTVL, useTokensFromList, useNodeInfoAllPools } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import type { InfoPublicPoolWithTvl } from "@icpswap/types";
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

type HeaderType = {
  label: string;
  key: string;
  sort: boolean;
  end?: boolean;
};

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
    { label: t`APR(24H)`, key: "apr", sort: false },
    { label: t("common.volume24h"), key: "volumeUSD", sort: true },
    { label: t("common.volume7d"), key: "volumeUSD7d", sort: true },
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
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const classes = useStyles();

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
          pool.feeTier === BigInt(3000) &&
          !HIDDEN_POOLS.includes(pool.pool)
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
        return { ...pool, tvlUSD: tvlUSD ? tvlUSD[1] : 0 } as InfoPublicPoolWithTvl;
      })
      .sort((a, b) => {
        if (a && b && !!sortField) {
          const bool =
            a[sortField as keyof InfoPublicPoolWithTvl] > b[sortField as keyof InfoPublicPoolWithTvl]
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
            <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" />
            {(slicedPoolsOfToken ?? []).map((pool, index) => {
              const __tvlUSD = allPoolsTVL?.find((poolTVL) => poolTVL[0] === pool.pool);
              const tvlUSD = __tvlUSD ? __tvlUSD[1] : undefined;

              return (
                <PoolRow
                  key={pool.pool}
                  index={(page - 1) * PAGE_SIZE + index + 1}
                  poolInfo={pool}
                  tvlUSD={tvlUSD}
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
