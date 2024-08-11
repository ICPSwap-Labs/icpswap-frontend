import { useCallback, useMemo, useState } from "react";
import { Grid, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { NoData, MainCard, Flex } from "components/index";
import { Trans, t } from "@lingui/macro";
import { FilterState } from "types/staking-farm";
import { useParsedQueryString } from "@icpswap/hooks";
import { useHistory } from "react-router-dom";
import { LoadingRow } from "@icpswap/ui";
import { FarmListCard, GlobalData, TopLiveFarms, FarmListHeader, YourFarmListHeader } from "components/farm/index";
import { useFarms } from "hooks/staking-farm/index";

import FarmContext from "./context";

const Tabs = [
  { label: t`All Farms`, state: FilterState.ALL },
  { label: t`Live`, state: FilterState.LIVE },
  { label: t`Unstart`, state: FilterState.NOT_STARTED },
  { label: t`Finished`, state: FilterState.FINISHED },
  { label: t`Your Farms`, state: FilterState.YOUR },
];

function MainContent() {
  const theme = useTheme() as Theme;
  const history = useHistory();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { state: _state } = useParsedQueryString() as {
    state: FilterState | undefined;
  };

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

  const { result: farms, loading } = useFarms({ state, filter: __state });

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
          ? "180px 180px 80px 1fr 1fr 1fr 100px"
          : "220px 220px 120px 1fr 1fr 180px"
        : "220px 220px 120px 1fr 1fr",
    };
  }, [state, matchDownSM, __state]);

  return (
    <FarmContext.Provider
      value={{
        unStakedFarms,
        updateUnStakedFarms: handleUpdateUnStakedFarms,
        deleteUnStakedFarms: handleDeleteUnStakedFarms,
      }}
    >
      <MainCard
        padding="0"
        sx={{
          "@media(max-width: 640px)": {
            padding: "0",
          },
        }}
      >
        <Grid
          container
          justifyContent="space-between"
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
        </Grid>

        <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level1 }} />

        <Box sx={{ width: "100%", overflow: "auto hidden" }}>
          {__state === FilterState.YOUR ? <YourFarmListHeader /> : <FarmListHeader state={state} />}

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
              {(unStakedFarms.length === farms?.length || !farms?.length) && !loading && <NoData />}

              {farms?.map((farm) => (
                <FarmListCard
                  key={farm[0].toString()}
                  farmId={farm[0].toString()}
                  farmTvl={farm[1]}
                  wrapperSx={{
                    display: "grid",
                    gridTemplateColumns,
                  }}
                  showState={showState}
                  filter={__state === FilterState.YOUR ? "YOUR" : undefined}
                />
              ))}
            </>
          )}
        </Box>
      </MainCard>
    </FarmContext.Provider>
  );
}

export default function Farms() {
  return (
    <Flex sx={{ width: "100%" }} justify="center">
      <Box sx={{ maxWidth: "1200px", width: "100%" }}>
        <Box>
          <Typography color="text.primary" sx={{ fontSize: "32px", fontWeight: 600, margin: "32px 0 0 0" }}>
            <Trans>Farm</Trans>
          </Typography>
          <Typography fontSize={16} mt="16px">
            <Trans>Farm Your Liquidity, Harvest Your Rewards!</Trans>
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
      </Box>
    </Flex>
  );
}
