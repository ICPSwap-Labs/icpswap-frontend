import { useCallback, useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { NoData, MainCard, Flex, Wrapper, ScrollTop } from "components/index";
import { FilterState } from "types/staking-farm";
import { useParsedQueryString } from "@icpswap/hooks";
import { BigNumber, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { LoadingRow } from "@icpswap/ui";
import { useNavigate } from "react-router-dom";
import { FarmListHeader, GlobalData, FarmRow } from "components/farm/index";
import { useFarms } from "hooks/staking-farm/index";
import { Null } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import i18n from "i18n/index";
import FarmContext from "views/staking-farm/context";
import { YourFarmEmpty } from "components/farm/Empty";

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
  const navigate = useNavigate();
  const principal = useAccountPrincipal();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { state: _state } = useParsedQueryString() as {
    state: FilterState | undefined;
  };

  const [filterPair] = useState<string | Null>(null);
  const [filterToken] = useState<string | Null>(null);
  const [page, setPage] = useState(START_PAGE);

  const __state = useMemo(() => _state ?? FilterState.LIVE, [_state]);

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
    if (isUndefinedOrNull(farms)) return undefined;

    return farms.slice(0, PAGE_SIZE * page);
  }, [farms, page]);

  const handleToggle = useCallback((value: { label: string; state: FilterState }) => {
    navigate(`/farm?state=${value.state}`);
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

  const handleScrollNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  const hasMore = useMemo(() => {
    if (!slicedFarms || !farms) return false;
    return slicedFarms.length !== farms.length;
  }, [slicedFarms, farms]);

  return (
    <FarmContext.Provider
      value={{
        unStakedFarms,
        updateUnStakedFarms: handleUpdateUnStakedFarms,
        deleteUnStakedFarms: handleDeleteUnStakedFarms,
      }}
    >
      <MainCard
        id="farm-scroll-wrapper"
        padding="0"
        sx={{
          overflow: "visible",
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
                  "@media (max-width:640px)": {
                    fontSize: "14px",
                  },
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </Box>
        </Flex>

        <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level1 }} />

        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              position: "sticky",
              top: "64px",
              background: theme.palette.background.level3,
              zIndex: 10,
              width: "100%",
              maxWidth: "1200px",
              borderBottom: `1px solid ${theme.palette.background.level1}`,
              overflow: "auto",
            }}
          >
            <FarmListHeader
              id="farm-list-header"
              state={state}
              showState={showState}
              your={your}
              sx={{ gridTemplateColumns }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height:
                nonUndefinedOrNull(slicedFarms) && slicedFarms.length > 0
                  ? `${new BigNumber(slicedFarms.length).multipliedBy(74).toString()}px`
                  : "320px",
            }}
          >
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
                  {(unStakedFarms.length === farms?.length || !farms?.length) && !loading ? (
                    your ? (
                      <YourFarmEmpty />
                    ) : (
                      <NoData tip={t("farm.stake.empty")} />
                    )
                  ) : null}

                  {slicedFarms?.map((farmId, index) => (
                    <FarmRow
                      key={farmId.toString()}
                      farmId={farmId.toString()}
                      wrapperSx={{
                        display: "grid",
                        gridTemplateColumns,
                      }}
                      showState={showState}
                      your={your}
                      filterState={__state}
                      isFirst={index === 0}
                    />
                  ))}
                </>
              )}
            </InfiniteScroll>
          </Box>
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

      <Box sx={{ margin: "40px 0 0 0" }}>
        <MainContent />
      </Box>
    </Wrapper>
  );
}
