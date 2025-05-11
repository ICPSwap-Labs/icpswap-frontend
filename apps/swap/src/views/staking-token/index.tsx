import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { NoData, MainCard, Flex, Wrapper, ObserverWrapper, ScrollTop } from "components/index";
import { useParsedQueryString } from "@icpswap/hooks";
import { FilterState } from "types/staking-token";
import { GlobalData, StakeRow, PoolListHeader } from "components/stake/index";
import { LoadingRow } from "@icpswap/ui";
import { getStateValueByFilterState } from "utils/stake/index";
import { usePools } from "hooks/staking-token/index";
import i18n from "i18n/index";
import { useTranslation } from "react-i18next";

const Tabs = [
  { label: i18n.t("common.pools.all"), state: FilterState.ALL },
  { label: i18n.t("common.live"), state: FilterState.LIVE },
  { label: i18n.t("common.unstart"), state: FilterState.NOT_STARTED },
  { label: i18n.t("common.finished"), state: FilterState.FINISHED },
  { label: i18n.t("common.pools.your"), state: FilterState.YOUR },
];

function MainContent() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [headerInViewport, setHeaderInViewport] = useState(true);

  const [stakeTokenId] = useState<string | undefined | null>(null);
  const [rewardTokenId] = useState<string | undefined | null>(null);

  const { state: _state } = useParsedQueryString() as {
    state: FilterState | undefined;
  };

  const __state = useMemo(() => _state ?? FilterState.LIVE, [_state]);

  const state = getStateValueByFilterState(__state);

  const { result: pools, loading } = usePools({
    filterState: __state,
    stakeTokenId,
    rewardTokenId,
    offset: 0,
    limit: 100,
  });

  const handleToggle = useCallback((value: { label: string; state: FilterState }) => {
    history.push(`/stake?state=${value.state}`);
  }, []);

  const { showState, gridTemplateColumns } = useMemo(() => {
    return {
      showState: state === undefined,
      gridTemplateColumns:
        __state === FilterState.YOUR
          ? matchDownSM
            ? "180px 180px 120px 240px 180px 180px 120px"
            : "180px 180px 120px 1fr 180px 180px 120px"
          : matchDownSM
          ? state === undefined
            ? "220px 220px 100px 240px 180px 180px"
            : "220px 220px 100px 240px 180px"
          : state === undefined
          ? "220px 220px 120px 1fr 1fr 180px"
          : "220px 220px 120px 1fr 1fr",
    };
  }, [state, matchDownSM, __state]);

  // const handleStakeTokenChange = useCallback(
  //   (tokenId: string | undefined) => {
  //     setStakeTokenId(tokenId);
  //   },
  //   [setStakeTokenId],
  // );

  // const handleRewardTokenChange = useCallback(
  //   (tokenId: string | undefined) => {
  //     setRewardTokenId(tokenId);
  //   },
  //   [setRewardTokenId],
  // );

  const [headerScrollOutOnTop, setHeaderScrollOutOnTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const target = document.querySelector("#stake-list-header");
      if (target) {
        const boundingClientRect = target.getBoundingClientRect();
        setHeaderScrollOutOnTop(boundingClientRect.top < 200);
        return;
      }

      setHeaderScrollOutOnTop(false);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
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
        <PoolListHeader
          showState={showState}
          gridTemplateColumns={gridTemplateColumns}
          your={__state === FilterState.YOUR}
          finished={__state === FilterState.FINISHED}
        />
      </Box>

      <MainCard
        id="stake-scroll-wrapper"
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

          {/* <Flex
            gap="10px 20px"
            sx={{
              "@media(max-width: 640px)": {
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            <Flex gap="0 4px">
              <Typography>{t("stake.token.colon")}</Typography>
              <SelectToken
                showBackground={false}
                search
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.token.all")}</Typography>}
                onTokenChange={handleStakeTokenChange}
              />
            </Flex>
            <Flex gap="0 4px">
              <Typography>{t("common.reward.token.colon")}</Typography>
              <SelectToken
                showBackground={false}
                search
                panelPadding="0px"
                defaultPanel={<Typography color="text.primary">{t("common.token.all")}</Typography>}
                onTokenChange={handleRewardTokenChange}
              />
            </Flex>
          </Flex> */}
        </Flex>

        <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level1 }} />

        <Box sx={{ width: "100%", overflow: "auto hidden" }}>
          <ObserverWrapper
            scrollInViewport={() => setHeaderInViewport(true)}
            scrollOutViewport={() => setHeaderInViewport(false)}
          >
            <PoolListHeader
              id="stake-list-header"
              showState={showState}
              gridTemplateColumns={gridTemplateColumns}
              your={__state === FilterState.YOUR}
              finished={__state === FilterState.FINISHED}
            />
          </ObserverWrapper>

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
              {!pools?.length && !loading && <NoData tip={t("farm.stake.empty")} />}

              {pools?.map((pool) => (
                <StakeRow
                  key={pool.canisterId.toString()}
                  poolInfo={pool}
                  showState={showState}
                  wrapperSx={{
                    display: "grid",
                    gridTemplateColumns,
                  }}
                  filterState={__state}
                  your={__state === FilterState.YOUR}
                />
              ))}
            </>
          )}
        </Box>
      </MainCard>

      <ScrollTop target="stake-scroll-wrapper" heightShowScrollTop={510} />
    </>
  );
}

function V2Icon() {
  return (
    <svg width="39" height="28" viewBox="0 0 39 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="39" height="28" rx="8" fill="#29314F" />
      <path
        d="M13.058 20L8.342 7.49H10.538L14.228 17.876L17.954 7.49H20.132L15.434 20H13.058ZM21.416 19.82V18.326C21.716 18.062 22.154 17.684 22.73 17.192C23.306 16.7 23.744 16.322 24.044 16.058C24.356 15.782 24.74 15.434 25.196 15.014C25.652 14.582 26.006 14.216 26.258 13.916C26.51 13.604 26.768 13.256 27.032 12.872C27.524 12.176 27.77 11.48 27.77 10.784C27.77 9.296 27.062 8.552 25.646 8.552C24.938 8.552 24.386 8.78 23.99 9.236C23.606 9.68 23.402 10.28 23.378 11.036H21.398C21.434 9.668 21.842 8.624 22.622 7.904C23.414 7.172 24.44 6.806 25.7 6.806C26.96 6.806 27.956 7.16 28.688 7.868C29.432 8.576 29.804 9.512 29.804 10.676C29.804 11.552 29.57 12.386 29.102 13.178C28.85 13.586 28.61 13.952 28.382 14.276C28.154 14.588 27.836 14.948 27.428 15.356C27.02 15.764 26.696 16.082 26.456 16.31C26.216 16.538 25.862 16.856 25.394 17.264C24.938 17.672 24.626 17.954 24.458 18.11H30.164V19.82H21.416Z"
        fill="white"
      />
    </svg>
  );
}

export default function Staking() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Flex gap="0 12px">
        <Typography sx={{ fontSize: "32px", color: "text.primary", fontWeight: 600 }}>
          {t("stake.staking.pool.title")}
        </Typography>
        <V2Icon />
      </Flex>

      <Typography sx={{ fontSize: "16px", margin: "24px 0 0 0" }}>{t("stake.staking.description")}</Typography>

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

      <Box sx={{ margin: "20px 0 0 0" }}>
        <MainContent />
      </Box>
    </Wrapper>
  );
}
