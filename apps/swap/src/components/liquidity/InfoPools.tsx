import { useState, useMemo, useCallback } from "react";
import { Typography, Box, useMediaQuery, makeStyles, InputAdornment, useTheme, Theme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { t, Trans } from "@lingui/macro";
import { NoData, TokenImage, TabPanel, type Tab } from "components/index";
import {
  Header,
  HeaderCell,
  BodyCell,
  TableRow,
  SortDirection,
  FeeTierPercentLabel,
  OnlyTokenList,
  Flex,
  LoadingRow,
  FilledTextField,
  APRPanel,
} from "@icpswap/ui";
import { useAllPoolsTVL, useTokensFromList, useNodeInfoAllPools, useDebouncedChangeHandler } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { formatDollarAmount, BigNumber, isNullArgs } from "@icpswap/utils";
import type { InfoPublicPoolWithTvl } from "@icpswap/types";
import InfiniteScroll from "react-infinite-scroll-component";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { Search } from "react-feather";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import { PoolTvlTooltip } from "components/swap/index";

import { PoolCharts } from "./PoolCharts";

const useStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      background: theme.palette.background.level3,
      borderRadius: "12px",
    },
    wrapper: {
      display: "grid",
      gridGap: "1em",
      alignItems: "center",
      gridTemplateColumns: "20px 1.5fr 1fr repeat(3, 1fr) 220px",
      "@media screen and (max-width: 640px)": {
        gridTemplateColumns: "1fr 120px",
      },
      "&.body": {
        "&:hover": {
          background: theme.palette.background.level1,
        },
      },
    },
    button: {
      padding: "8px",
      borderRadius: "8px",
      fontSize: "14px",
      "&.outlined": {
        border: `1px solid ${theme.colors.secondaryMain}`,
        color: theme.colors.secondaryMain,
      },
      "&.primary": {
        background: theme.colors.secondaryMain,
        color: "#ffffff",
      },
    },
  };
});

export type HeaderType = {
  label: string;
  key: string;
  sort: boolean;
  end?: boolean;
  align?: "right";
};

export interface PoolTableHeaderProps {
  onSortChange: (sortField: string, sortDirection: SortDirection) => void;
  defaultSortFiled?: string;
  timeBase?: "24H" | "7D";
}

export function PoolTableHeader({ onSortChange, defaultSortFiled = "", timeBase }: PoolTableHeaderProps) {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const headers: HeaderType[] = matchDownSM
    ? [
        { label: t`Pairs`, key: "pool", sort: false },
        { label: t`Action`, key: "", sort: false, align: "right" },
      ]
    : [
        { label: "#", key: "#", sort: false },
        { label: t`Pairs`, key: "pool", sort: false },
        { label: t`TVL`, key: "tvlUSD", sort: true, align: "right" },
        { label: timeBase === "24H" ? t`APR 24H` : t`APR 7D`, key: "apr", sort: false, align: "right" },
        { label: timeBase === "24H" ? t`Fees 24H` : t`Fees 7D`, key: "fees24", sort: false, align: "right" },
        {
          label: timeBase === "24H" ? t`Volume 24H` : t`Volume 7D`,
          key: "volumeUSD",
          sort: true,
          align: "right",
        },
        { label: t`Action`, key: "", sort: false, align: "right" },
      ];

  return (
    <Header
      className={classes.wrapper}
      onSortChange={onSortChange}
      defaultSortFiled={defaultSortFiled}
      sx={{
        padding: "16px 24px",
      }}
      borderBottom={`1px solid ${theme.palette.background.level1}`}
    >
      {headers.map((header) => (
        <HeaderCell key={header.key} field={header.key} isSort={header.sort} align={header.align}>
          {header.label}
        </HeaderCell>
      ))}
    </Header>
  );
}

export interface PoolItemProps {
  pool: InfoPublicPoolWithTvl;
  index: number;
  timeBase?: "24H" | "7D";
}

export function PoolItem({ pool, index, timeBase }: PoolItemProps) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const [poolChartOpen, setPoolChartOpen] = useState(false);

  // const { result: token0 } = useTokenInfo(pool.token0Id);
  // const { result: token1 } = useTokenInfo(pool.token1Id);

  const fees = useMemo(() => {
    if (timeBase === "24H") {
      return (pool.volumeUSD * 3) / 1000;
    }

    return (pool.volumeUSD7d * 3) / 1000;
  }, [timeBase, pool]);

  const apr = useMemo(() => {
    if (!pool) return undefined;

    return `${new BigNumber(fees)
      .dividedBy(pool.tvlUSD)
      .multipliedBy(360 * 0.8)
      .multipliedBy(100)
      .toFixed(2)}%`;
  }, [pool, fees, timeBase]);

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: pool.token0Id, token1: pool.token1Id });

  const handleAdd = useCallback(() => {
    loadAddLiquidity();
  }, [loadAddLiquidity]);

  const handleSwap = useCallback(() => {
    history.push(`/swap?&input=${pool.token0Id}&output=${pool.token1Id}`);
  }, [history, pool]);

  const handleChart = useCallback(() => {
    setPoolChartOpen(true);
  }, [setPoolChartOpen]);

  return (
    <>
      <TableRow
        className={`${classes.wrapper} body`}
        sx={{
          padding: "20px 24px",
          "@media(max-width: 640px)": {
            padding: "12px 16px",
          },
        }}
        borderBottom={`1px solid ${theme.palette.background.level1}`}
      >
        <BodyCell sx={{ "@media(max-width: 640px)": { display: "none" } }}>{index}</BodyCell>
        <BodyCell>
          <Flex
            align="center"
            gap="0 8px"
            sx={{
              "@media(max-width: 640px)": {
                gap: "0 4px",
              },
            }}
          >
            <Flex align="center">
              <TokenImage logo={generateLogoUrl(pool.token0Id)} tokenId={pool.token0Id} size="24px" />
              <TokenImage logo={generateLogoUrl(pool.token1Id)} tokenId={pool.token1Id} size="24px" />
            </Flex>

            <Flex
              gap="0 8px"
              sx={{
                "@media(max-width: 640px)": {
                  flexDirection: "column",
                  gap: "4px 0",
                  alignItems: "flex-start",
                },
              }}
            >
              <Typography
                sx={{
                  maxWidth: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "@media screen and (max-width: 640px)": {
                    fontSize: "12px",
                  },
                }}
                color="text.primary"
                title={`${pool.token0Symbol} / ${pool.token1Symbol}`}
              >
                {pool.token0Symbol} / {pool.token1Symbol}
              </Typography>

              <FeeTierPercentLabel feeTier={pool.feeTier} />
            </Flex>
          </Flex>
        </BodyCell>
        <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
          <PoolTvlTooltip token0Id={pool.token0Id} token1Id={pool.token1Id} poolId={pool.pool}>
            <Typography
              align="right"
              sx={{
                textDecoration: "underline",
                textDecorationStyle: "dashed",
                textDecorationColor: theme.colors.darkTextSecondary,
                fontSize: "16px",
                cursor: "pointer",
                color: "text.primary",
                "@media screen and (max-width: 600px)": {
                  fontSize: "14px",
                },
              }}
            >
              {formatDollarAmount(pool.tvlUSD)}
            </Typography>
          </PoolTvlTooltip>
        </BodyCell>
        <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
          {apr ? <APRPanel value={apr} /> : null}
        </BodyCell>
        <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
          {formatDollarAmount(fees)}
        </BodyCell>
        <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
          {formatDollarAmount(timeBase === "24H" ? pool.volumeUSD : pool.volumeUSD7d)}
        </BodyCell>
        <BodyCell>
          <Flex fullWidth gap="0 5px" justify="flex-end">
            <Box className={`${classes.button} outlined`} onClick={handleChart}>
              <Trans>Chart</Trans>
            </Box>
            <Box
              className={`${classes.button} outlined`}
              onClick={handleSwap}
              sx={{ "@media(max-width: 640px)": { display: "none" } }}
            >
              <Trans>Swap</Trans>
            </Box>
            <Box className={`${classes.button} primary`} onClick={handleAdd}>
              <Trans>Add</Trans>
            </Box>
          </Flex>
        </BodyCell>
      </TableRow>

      {poolChartOpen ? <PoolCharts open={poolChartOpen} onClose={() => setPoolChartOpen(false)} pool={pool} /> : null}
    </>
  );
}

const PAGE_SIZE = 10;
const START_PAGE = 2;

export function InfoPools() {
  const classes = useStyles();
  const [searchToken, setSearchToken] = useState<string | undefined>("");
  const [onlyTokenList, setOnlyTokenList] = useState(true);
  const [sortField, setSortField] = useState<string>("volumeUSD");
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const theme = useTheme();

  const [page, setPage] = useState(START_PAGE);
  const [timeBase, setTimeBase] = useState<"24H" | "7D">("24H");
  const [debounceSearchToken, debounceSetSearchToken] = useDebouncedChangeHandler(searchToken, setSearchToken, 300);

  const { result: allPoolsTVL } = useAllPoolsTVL();
  const { result: tokenList } = useTokensFromList();
  const { result: allSwapPools } = useNodeInfoAllPools();

  const allPools = useMemo(() => {
    if (!allSwapPools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return allSwapPools.filter((pool) => {
      let __boolean = true;

      if (pool.token0Price === 0 || pool.token1Price === 0 || pool.feeTier !== BigInt(3000)) __boolean = false;

      if (onlyTokenList) {
        if (!tokenListIds.includes(pool.token0Id) || !tokenListIds.includes(pool.token1Id)) {
          __boolean = false;
        }
      }

      if (debounceSearchToken) {
        if (
          !pool.token0Symbol.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token1Symbol.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token0Id.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token1Id.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase())
        ) {
          __boolean = false;
        }
      }

      return __boolean;
    });
  }, [allSwapPools, tokenList, onlyTokenList, debounceSearchToken]);

  const slicedPools = useMemo(() => {
    if (!allPools || !allPoolsTVL) return undefined;

    return allPools
      .map((pool) => {
        const tvlUSD = allPoolsTVL.find((poolTVL) => poolTVL[0] === pool.pool);
        return { ...pool, tvlUSD: tvlUSD ? tvlUSD[1] : 0 } as InfoPublicPoolWithTvl;
      })
      .sort((a, b) => {
        if (a && b && !!sortField) {
          const __sortField = sortField === "volumeUSD" && timeBase === "7D" ? "volumeUSD7d" : sortField;

          const bool =
            a[__sortField as keyof InfoPublicPoolWithTvl] > b[__sortField as keyof InfoPublicPoolWithTvl]
              ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
              : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

          return bool;
        }
        return 0;
      })
      .slice(0, PAGE_SIZE * page);
  }, [allPools, allPoolsTVL, page, timeBase, sortField, sortDirection]);

  const handleOnlyTokenList = useCallback(
    (checked: boolean) => {
      setOnlyTokenList(checked);
      setPage(START_PAGE);
    },
    [setOnlyTokenList, setPage],
  );

  const handleSortChange = (sortField: string, sortDirection: SortDirection) => {
    setSortDirection(sortDirection);
    setSortField(sortField);
  };

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  const hasMore = useMemo(() => {
    if (!slicedPools || !allPools) return false;
    return slicedPools.length !== allPools.length;
  }, [slicedPools, allPools]);

  const handleSearchInput = useCallback(
    (value: string) => {
      debounceSetSearchToken(value);
      setPage(START_PAGE);
    },
    [debounceSetSearchToken, setPage],
  );

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab.key === "24h") {
        setTimeBase("24H");
      } else {
        setTimeBase("7D");
      }
    },
    [setTimeBase],
  );

  return (
    <Box className={classes.card}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 24px",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "16px 0",
            padding: "24px 16px",
          },
        }}
      >
        <Flex gap="0 8px" sx={{ width: "fit-content" }}>
          <Typography sx={{ whiteSpace: "nowrap" }}>
            <Trans>Time base</Trans>
          </Typography>

          <TabPanel
            size="small"
            tabs={[
              { key: "24h", value: "24H" },
              { key: "7d", value: "7D" },
            ]}
            onChange={handleTabChange}
          />
        </Flex>

        <Flex
          align="center"
          gap="0 16px"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "16px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <OnlyTokenList onChange={handleOnlyTokenList} checked={onlyTokenList} />
          <Box sx={{ width: "260px" }}>
            <FilledTextField
              width="100%"
              fullHeight
              placeholder={t`Search token`}
              onChange={handleSearchInput}
              background="level1"
              placeholderSize="14px"
              fontSize="14px"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={14} color={theme.colors.darkTextSecondary} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Flex>
      </Box>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box
          sx={{
            minWidth: "1200px",
            "@media(max-width: 640px)": {
              width: "100%",
              minWidth: "auto",
            },
          }}
        >
          <InfiniteScroll
            dataLength={slicedPools?.length ?? 0}
            next={handleScrollNext}
            hasMore={hasMore}
            loader={
              <Box sx={{ padding: "24px" }}>
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
                </LoadingRow>
              </Box>
            }
          >
            {slicedPools && slicedPools.length > 0 ? (
              <>
                <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" timeBase={timeBase} />
                {(slicedPools ?? []).map((pool, index) => (
                  <PoolItem key={pool.pool} index={index + 1} pool={pool} timeBase={timeBase} />
                ))}
              </>
            ) : isNullArgs(slicedPools) ? (
              <Box sx={{ padding: "24px" }}>
                <LoadingRow>
                  <div />
                  <div />
                  <div />
                  <div />
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
            ) : (
              <NoData />
            )}
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  );
}
