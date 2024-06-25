import { useCallback, useMemo, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { NoData, MainCard, Flex } from "components/index";
import { Trans, t } from "@lingui/macro";
import { FilterState } from "types/staking-farm";
import { useParsedQueryString } from "@icpswap/hooks";
import { useHistory } from "react-router-dom";
import { LoadingRow } from "@icpswap/ui";
import { FarmListCard, GlobalData, TopLiveFarms } from "components/farm/index";
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

  const { state: _state, stakeOnly } = useParsedQueryString() as {
    state: FilterState | undefined;
    stakeOnly: "true" | undefined;
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

  const handleToggle = useCallback(
    (value: { label: string; state: FilterState }) => {
      if (stakeOnly === "true") {
        history.push(`/farm?state=${value.state}&stakeOnly=true`);
        return;
      }
      history.push(`/farm?state=${value.state}`);
    },
    [stakeOnly],
  );

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
      gridTemplateColumns: state === undefined ? "220px 220px 1fr 1fr 1fr 180px" : "220px 220px 1fr 1fr 1fr",
    };
  }, [state]);

  return (
    <FarmContext.Provider
      value={{
        unStakedFarms,
        updateUnStakedFarms: handleUpdateUnStakedFarms,
        deleteUnStakedFarms: handleDeleteUnStakedFarms,
      }}
    >
      <MainCard padding="0">
        <Grid
          container
          justifyContent="space-between"
          sx={{
            padding: "24px",
            "@media (max-width:640px)": {
              flexDirection: "column",
              gap: "24px 0",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "0 20px",
            }}
          >
            {Tabs.map((tab) => (
              <Typography
                key={tab.state}
                color={__state === tab.state ? "text.primary" : "textTertiary"}
                onClick={() => handleToggle(tab)}
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  "@media (max-width:640px)": {
                    fontSize: "16px",
                  },
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </Box>
        </Grid>

        <Box sx={{ width: "100%", height: "1px", background: theme.palette.background.level1 }} />

        <Box
          sx={{
            display: "grid",
            padding: "12px 24px",
            gridTemplateColumns,
          }}
        >
          <Typography variant="body2">
            <Trans>Staked Position</Trans>
          </Typography>
          <Typography variant="body2">
            <Trans>Reward Token</Trans>
          </Typography>
          <Flex justify="flex-end">
            <Typography variant="body2">
              <Trans>APR</Trans>
            </Typography>
          </Flex>
          <Flex justify="flex-end">
            <Typography variant="body2">
              <Trans>Your Available to Stake</Trans>
            </Typography>
          </Flex>
          <Flex justify="flex-end">
            <Typography variant="body2">
              <Trans>Total Staked</Trans>
            </Typography>
          </Flex>
          {showState ? (
            <Flex justify="flex-end">
              <Typography variant="body2">
                <Trans>Status</Trans>
              </Typography>
            </Flex>
          ) : null}
        </Box>

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
            {((unStakedFarms.length === farms?.length && stakeOnly === "true") || !farms?.length) && !loading && (
              <NoData />
            )}

            {farms?.map((farm) => (
              <FarmListCard
                key={farm[0].toString()}
                farmId={farm[0].toString()}
                farmTvl={farm[1]}
                wrapperSx={{
                  display: "grid",
                  padding: "12px 24px",
                  gridTemplateColumns,
                }}
                showState={showState}
              />
            ))}
          </>
        )}
      </MainCard>
    </FarmContext.Provider>
  );
}

export default function Farms() {
  return (
    <Flex sx={{ width: "100%" }} justify="center">
      <Box sx={{ maxWidth: "1440px", width: "100%" }}>
        <Box>
          <Typography color="text.primary" sx={{ fontSize: "36px", fontWeight: 600, margin: "40px 0 0 0" }}>
            <Trans>Farm</Trans>
          </Typography>
          <Typography fontSize={18} mt="24px">
            <Trans>Farm Your Liquidity, Harvest Your Rewards!</Trans>
          </Typography>
        </Box>

        <Box mt="88px">
          <GlobalData />
        </Box>

        <Box mt="58px">
          <TopLiveFarms />
        </Box>

        <Box sx={{ margin: "20px 0 0 0" }}>
          <MainContent />
        </Box>
      </Box>
    </Flex>
  );
}
