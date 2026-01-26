import { useState, useMemo, useCallback } from "react";
import { Typography, Box, useMediaQuery, makeStyles, InputAdornment, useTheme, Theme, BoxProps } from "components/Mui";
import { useNavigate } from "react-router-dom";
import { NoData, TokenImage, TabPanel, type Tab, ScrollTop } from "components/index";
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
  Link,
} from "@icpswap/ui";
import { useTokensFromList, useNodeInfoAllPools, useDebouncedChangeHandler, getPoolAPR } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import {
  BigNumber,
  formatDollarAmount,
  isUndefinedOrNull,
  nonUndefinedOrNull,
  percentToNum,
  urlStringFormat,
} from "@icpswap/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { Search } from "react-feather";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";
import { PoolTvlTooltip } from "components/swap/index";
import { useTranslation } from "react-i18next";
import { PoolCharts } from "components/liquidity/PoolCharts";
import { PoolInfoWithApr } from "types/info";

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
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const headers: HeaderType[] = matchDownSM
    ? [
        { label: t("common.pools"), key: "pool", sort: false },
        { label: t("common.manage"), key: "", sort: false, align: "right" },
      ]
    : [
        { label: "#", key: "#", sort: false },
        { label: t("common.pools"), key: "pool", sort: false },
        { label: t("common.tvl.dollar"), key: "tvlUSD", sort: true, align: "right" },
        {
          label: timeBase === "24H" ? t("common.apr24h") : t("common.apr.7d"),
          key: "apr",
          sort: true,
          align: "right",
        },
        {
          label: timeBase === "24H" ? t("swap.fees.24h") : t("swap.fees.7d"),
          key: "fees24",
          sort: false,
          align: "right",
        },
        {
          label: timeBase === "24H" ? t("common.volume24h") : t("common.volume7d"),
          key: "volumeUSD24H",
          sort: true,
          align: "right",
        },
        { label: t("common.manage"), key: "", sort: false, align: "right" },
      ];

  return (
    <Header
      className={`${classes.wrapper}`}
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
  pool: PoolInfoWithApr;
  index: number;
  timeBase?: "24H" | "7D";
}

export function PoolRow({ pool, index, timeBase }: PoolItemProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [poolChartOpen, setPoolChartOpen] = useState(false);

  const fees = useMemo(() => {
    if (timeBase === "24H") {
      return (Number(pool.volumeUSD24H) * 3) / 1000;
    }

    return (Number(pool.volumeUSD7D) * 3) / 1000;
  }, [timeBase, pool]);

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: pool.token0LedgerId, token1: pool.token1LedgerId });

  const handleAdd: BoxProps["onClick"] = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      loadAddLiquidity();
    },
    [loadAddLiquidity],
  );

  const handleSwap: BoxProps["onClick"] = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      navigate(`/swap?&input=${pool.token0LedgerId}&output=${pool.token1LedgerId}`);
    },
    [navigate, pool],
  );

  const handleChart: BoxProps["onClick"] = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      setPoolChartOpen(true);
    },
    [setPoolChartOpen],
  );

  return (
    <>
      <Link
        to={`/info-swap/pool/details/${pool.poolId}?path=${urlStringFormat(
          "/liquidity?tab=TopPools",
        )}&label=${urlStringFormat(t("common.liquidity"))}`}
      >
        <TableRow
          className={`${classes.wrapper} body`}
          sx={{
            padding: matchDownSM ? "12px 16px" : "20px 24px",
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
                <TokenImage logo={generateLogoUrl(pool.token0LedgerId)} tokenId={pool.token0LedgerId} size="24px" />
                <TokenImage logo={generateLogoUrl(pool.token1LedgerId)} tokenId={pool.token1LedgerId} size="24px" />
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
                    maxWidth: "120px",
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

                <FeeTierPercentLabel feeTier={pool.poolFee} />
              </Flex>
            </Flex>
          </BodyCell>
          <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
            <PoolTvlTooltip token0Id={pool.token0LedgerId} token1Id={pool.token1LedgerId} poolId={pool.poolId}>
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
            {pool.apr24h ? <APRPanel value={pool.apr24h} /> : "--"}
          </BodyCell>
          <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
            {formatDollarAmount(fees)}
          </BodyCell>
          <BodyCell align="right" sx={{ "@media(max-width: 640px)": { display: "none" } }}>
            {formatDollarAmount(timeBase === "24H" ? pool.volumeUSD24H : pool.volumeUSD7D)}
          </BodyCell>
          <BodyCell>
            <Flex fullWidth gap="0 5px" justify="flex-end">
              <Box className={`${classes.button} outlined`} onClick={handleChart}>
                {t("common.chart")}
              </Box>
              <Box
                className={`${classes.button} outlined`}
                onClick={handleSwap}
                sx={{ "@media(max-width: 640px)": { display: "none" } }}
              >
                {t("common.swap")}
              </Box>
              <Box className={`${classes.button} primary`} onClick={handleAdd}>
                {t("common.add")}
              </Box>
            </Flex>
          </BodyCell>
        </TableRow>
      </Link>

      {poolChartOpen ? <PoolCharts open={poolChartOpen} onClose={() => setPoolChartOpen(false)} pool={pool} /> : null}
    </>
  );
}

const PAGE_SIZE = 10;
const START_PAGE = 2;

const DEFAULT_SORT_FILED = "volumeUSD24H";

export function InfoPools() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [searchToken, setSearchToken] = useState<string | undefined>("");
  const [onlyTokenList, setOnlyTokenList] = useState(true);
  const [sortField, setSortField] = useState<string>(DEFAULT_SORT_FILED);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC);
  const theme = useTheme();

  const [page, setPage] = useState(START_PAGE);
  const [timeBase, setTimeBase] = useState<"24H" | "7D">("24H");
  const [debounceSearchToken, debounceSetSearchToken] = useDebouncedChangeHandler(searchToken, setSearchToken, 300);

  const { result: tokenList } = useTokensFromList();
  const { result: allSwapPools } = useNodeInfoAllPools();

  const allPools = useMemo(() => {
    if (!allSwapPools || !tokenList) return undefined;

    const tokenListIds = tokenList.map((token) => token.canisterId).concat(ICP.address);

    return allSwapPools.filter((pool) => {
      let __boolean = true;

      if (
        new BigNumber(pool.token0Price).isEqualTo(0) ||
        new BigNumber(pool.token1Price).isEqualTo(0) ||
        pool.poolFee !== 3000
      )
        __boolean = false;

      if (onlyTokenList) {
        if (!tokenListIds.includes(pool.token0LedgerId) || !tokenListIds.includes(pool.token1LedgerId)) {
          __boolean = false;
        }
      }

      if (debounceSearchToken) {
        if (
          !pool.token0Symbol.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token1Symbol.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token0LedgerId.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase()) &&
          !pool.token1LedgerId.toLocaleLowerCase().includes(debounceSearchToken.toLocaleLowerCase())
        ) {
          __boolean = false;
        }
      }

      return __boolean;
    });
  }, [allSwapPools, tokenList, onlyTokenList, debounceSearchToken]);

  const slicedPools = useMemo(() => {
    if (!allPools) return undefined;

    return allPools
      .map((pool) => {
        const apr24h = getPoolAPR({
          volumeUSD: timeBase === "24H" ? pool.volumeUSD24H : pool.volumeUSD7D,
          tvlUSD: pool.tvlUSD,
          timeBase,
        });

        return { ...pool, apr24h, apr: apr24h ? percentToNum(apr24h) : 0 } as PoolInfoWithApr;
      })
      .sort((a, b) => {
        if (a && b && !!sortField) {
          const __sortField = sortField === "volumeUSD24H" && timeBase === "7D" ? "volumeUSD7D" : sortField;

          const bool = new BigNumber(a[__sortField as keyof PoolInfoWithApr]).isGreaterThan(
            b[__sortField as keyof PoolInfoWithApr],
          )
            ? (sortDirection === SortDirection.ASC ? 1 : -1) * 1
            : (sortDirection === SortDirection.ASC ? 1 : -1) * -1;

          return bool;
        }
        return 0;
      })
      .slice(0, PAGE_SIZE * page);
  }, [allPools, page, timeBase, sortField, sortDirection]);

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
    <>
      <Box className={classes.card} id="scroll-main-wrapper">
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
            <Typography sx={{ whiteSpace: "nowrap" }}>{t("common.time.base")}</Typography>

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
                placeholder={t("common.search.by.token")}
                onChange={handleSearchInput}
                background="level1"
                placeholderSize="14px"
                fontSize="14px"
                textFieldProps={{
                  slotProps: {
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={14} color={theme.colors.darkTextSecondary} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>
          </Flex>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              position: "sticky",
              top: "64px",
              background: theme.palette.background.level3,
              zIndex: 10,
              width: "100%",
              maxWidth: "1200px",
            }}
          >
            <PoolTableHeader onSortChange={handleSortChange} defaultSortFiled="volumeUSD" timeBase={timeBase} />
          </Box>

          <Box
            sx={{
              minWidth: "1200px",
              height: nonUndefinedOrNull(slicedPools)
                ? `${new BigNumber(slicedPools.length).multipliedBy(73).toString()}px`
                : "640px",
              "@media(max-width: 640px)": {
                width: "100%",
                minWidth: "auto",
                height: nonUndefinedOrNull(slicedPools)
                  ? `${new BigNumber(slicedPools.length).multipliedBy(65).toString()}px`
                  : "640px",
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
                  {(slicedPools ?? []).map((pool, index) => (
                    <PoolRow key={pool.poolId} index={index + 1} pool={pool} timeBase={timeBase} />
                  ))}
                </>
              ) : isUndefinedOrNull(slicedPools) ? (
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

        <ScrollTop target="scroll-main-wrapper" heightShowScrollTop={510} />
      </Box>
    </>
  );
}
