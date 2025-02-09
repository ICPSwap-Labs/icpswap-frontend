import { useCallback, useMemo, useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { NoData, MainCard, Flex, Wrapper, ObserverWrapper, ScrollTop } from "components/index";
import { FilterState } from "types/staking-farm";
import { useParsedQueryString } from "@icpswap/hooks";
import { isNullArgs } from "@icpswap/utils";
import { LoadingRow } from "@icpswap/ui";
import { useHistory } from "react-router-dom";
import { FarmListCard, FarmListHeader, GlobalData, TopLiveFarms } from "components/farm/index";
import { useFarms } from "hooks/staking-farm/index";
import { SelectToken } from "components/Select/SelectToken";
import { SelectPair } from "components/Select/SelectPair";
import { Null } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import i18n from "i18n/index";

import FarmContext from "./context";

const Tabs = [
  { label: i18n.t("farm.tabs.all"), state: FilterState.ALL },
  { label: i18n.t("common.live"), state: FilterState.LIVE },
  { label: i18n.t("common.unstart"), state: FilterState.NOT_STARTED },
  { label: i18n.t("common.finished"), state: FilterState.FINISHED },
  { label: i18n.t("farm.tabs.your"), state: FilterState.YOUR },
];

const PAGE_SIZE = 10;
const START_PAGE = 1;

function MainContent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const principal = useAccountPrincipal();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { state: _state } = useParsedQueryString() as {
    state: FilterState | undefined;
  };

  const [filterPair, setFilterPair] = useState<string | Null>(null);
  const [filterToken, setFilterToken] = useState<string | Null>(null);
  const [page, setPage] = useState(START_PAGE);
  const [headerInViewport, setHeaderInViewport] = useState(true);

  const __state = useMemo(() => _state ?? FilterState.ALL, [_state]);

  const state = useMemo(() => {
    switch (__state) {
      case FilterState.ALL:
        return undefined;
      case FilterState.NOT_STARTED:
        return "NOT_STARTED";
      case FilterState.LIVE:
        return "LIVE";
      case FilterState.FINISHED:
        return "FINISHED";
      case FilterState.YOUR:
        return undefined;
      default:
        return undefined;
    }
  }, [__state]);

  const your = useMemo(() => {
    return __state === FilterState.YOUR;
  }, [__state, FilterState]);

  const filterUser = useMemo(() => {
    if (your) return principal?.toString();
    return null;
  }, [your, principal]);

  const { result: farms, loading } = useFarms({
    state,
    filter: __state,
    pair: filterPair,
    token: filterToken,
    user: filterUser,
  });

  const slicedFarms = useMemo(() => {
    if (isNullArgs(farms)) return undefined;

    return farms.slice(0, PAGE_SIZE * page);
  }, [farms, page]);

  const handleToggle = useCallback((value: { label: string; state: FilterState }) => {
    history.push(`/farm?state=${value.state}`);
  }, []);

  const [unStakedFarms, setUnStakedFarms] = useState<string[]>([]);

  const handleUpdateUnStakedFarms = (unStakedFarms: string) => {
    setUnStakedFarms((prevState) => [...new Set(prevState.concat(unStakedFarms))]);
  };

  const handleDeleteUnStakedFarms = (unStakedFarm: string) => {
    setUnStakedFarms((prevState) => {
      const state = [...prevState];
      const index = prevState.indexOf(unStakedFarm);
      if (index !== -1) {
        state.splice(index, 1);
      }
      return state;
    });
  };

  const { showState, gridTemplateColumns } = useMemo(() => {
    return {
      showState: state === undefined,
      gridTemplateColumns: matchDownSM
        ? state === undefined
          ? __state === FilterState.YOUR
            ? "180px 180px 80px 220px 160px 160px 160px"
            : "220px 220px 100px 240px 180px 180px"
          : "220px 220px 100px 240px 180px"
        : state === undefined
        ? __state === FilterState.YOUR
          ? "180px 180px 80px 1fr 1fr 1fr 120px"
          : "220px 220px 120px 1fr 1fr 180px"
        : "220px 220px 120px 1fr 1fr",
    };
  }, [state, matchDownSM, __state]);

  const handlePairChange = (pairId: string | undefined) => {
    setFilterPair(pairId);
  };

  const handleTokenChange = (tokenId: string | undefined) => {
    setFilterToken(tokenId);
  };

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  const hasMore = useMemo(() => {
    if (!slicedFarms || !farms) return false;
    return slicedFarms.length !== farms.length;
  }, [slicedFarms, farms]);

  const [headerScrollOutOnTop, setHeaderScrollOutOnTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const target = document.querySelector("#farm-list-header");
      if (target) {
        const boundingClientRect = target.getBoundingClientRect();
        setHeaderScrollOutOnTop(boundingClientRect.top < 50);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <FarmContext.Provider
      value={{
        unStakedFarms,
        updateUnStakedFarms: handleUpdateUnStakedFarms,
        deleteUnStakedFarms: handleDeleteUnStakedFarms,
      }}
    >
      <Box
        sx={{
          display: !headerInViewport && headerScrollOutOnTop ? "block" : "none",
          position: "sticky",
          top: "64px",
          background: theme.palette.background.level3,
          zIndex: 10,
          width: "100%",
          maxWidth: "1200px",
          borderBottom: `1px solid ${theme.palette.background.level1}`,
        }}
      >
        <FarmListHeader state={state} showState={showState} your={your} sx={{ gridTemplateColumns }} />
      </Box>

      <MainCard
        id="farm-scroll-wrapper"
        padding="0"
        sx={{
          "@media(max-width: 640px)": {
            padding: "0",
          },
        }}
      >
        <Flex
          justify="space-between"
          sx={{
            padding: "24px",
            "@media (max-width:640px)": {
              flexDirection: "column",
              gap: "24px 0",
              padding: "16px",
              alignItems: "flex-start",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0 20px",
              "@media (max-width:640px)": {
                gap: "0 9px",
              },
            }}
          >
            {Tabs.map((tab) => (
              <Typography
                key={tab.state}
                color={__state === tab.state ? "text.primary" : "textTertiary"}
                onClick={() => handleToggle(tab)}
                sx={{
                  fontSize: "18px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  "@media (max-width:640px)": {
                    fontSize: "14px",
                  },
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </Box>

          <Flex
            justify="flex-end"
            sx={{
              flex: 1,
              "@media(max-width: 640px)": {
                flexDirection: "column",
                gap: "16px 0",
                alignItems: "flex-start",
              },
            }}
            gap="0 20px"
          >
            <Flex sx={{ width: "fit-content" }} gap="0 4px">
              <Typography>{t("common.select.pair.colon")}</Typography>

              <SelectPair
                showBackground={false}
                search
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.select.all.pair")}</Typography>}
                onPairChange={handlePairChange}
              />
            </Flex>

            <Flex sx={{ width: "fit-content" }} gap="0 4px">
              <Typography>{t("common.reward.token.colon")}</Typography>

              <SelectToken
                showBackground={false}
                search
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.token.all")}</Typography>}
                onTokenChange={handleTokenChange}
              />
            </Flex>
          </Flex>
        </Flex>

        <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level1 }} />

        <Box sx={{ width: "100%", overflow: "auto hidden" }}>
          <ObserverWrapper
            scrollInViewport={() => setHeaderInViewport(true)}
            scrollOutViewport={() => setHeaderInViewport(false)}
          >
            <FarmListHeader
              id="farm-list-header"
              state={state}
              showState={showState}
              your={your}
              sx={{ gridTemplateColumns }}
            />
          </ObserverWrapper>

          <InfiniteScroll
            dataLength={slicedFarms?.length ?? 0}
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
            {loading ? (
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
                </LoadingRow>
              </Box>
            ) : (
              <>
                {(unStakedFarms.length === farms?.length || !farms?.length) && !loading ? <NoData /> : null}

                {slicedFarms?.map((farmId) => (
                  <FarmListCard
                    key={farmId.toString()}
                    farmId={farmId.toString()}
                    wrapperSx={{
                      display: "grid",
                      gridTemplateColumns,
                    }}
                    showState={showState}
                    your={your}
                    filterState={__state}
                  />
                ))}
              </>
            )}
          </InfiniteScroll>
        </Box>
      </MainCard>

      <ScrollTop target="farm-scroll-wrapper" heightShowScrollTop={510} />
    </FarmContext.Provider>
  );
}

export default function Farms() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Box>
        <Typography color="text.primary" sx={{ fontSize: "32px", fontWeight: 600 }}>
          {t("common.farm")}
        </Typography>
        <Typography fontSize={16} mt="16px">
          {t("common.farm.description")}
        </Typography>
      </Box>

      <Box
        sx={{
          margin: "44px 0 0 0",
          "@media(max-width: 640px)": {
            margin: "20px 0 0 0",
          },
        }}
      >
        <GlobalData />
      </Box>

      <Box
        sx={{
          margin: "58px 0 0 0",
          "@media(max-width: 640px)": {
            margin: "40px 0 0 0",
          },
        }}
      >
        <TopLiveFarms />
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <MainContent />
      </Box>
    </Wrapper>
  );
}
