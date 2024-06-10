import { useCallback, useMemo, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { NoData, StaticLoading, MainCard } from "components/index";
import Switch from "components/switch";
import { Trans, t } from "@lingui/macro";
import { STATE } from "types/staking-farm";
import { useFarms, useParsedQueryString } from "@icpswap/hooks";
import { useHistory } from "react-router-dom";

import StakingPoolItem from "./components/StakingPoolItem";
import GlobalData from "./components/GlobalData";
import FarmContext from "./context";

const Tabs = [
  { label: t`Live`, state: STATE.LIVE },
  { label: t`Unstart`, state: STATE.NOT_STARTED },
  { label: t`Finished`, state: STATE.FINISHED },
  { label: t`Closure`, state: STATE.CLOSED },
];

function MainContent() {
  const history = useHistory();

  const { state: __state, stakeOnly } = useParsedQueryString() as { state: STATE; stakeOnly: "true" | undefined };
  const state = useMemo(() => __state ?? STATE.LIVE, [__state]);

  // TODO: page
  const { result: farms, loading } = useFarms(state);

  const handleToggle = useCallback(
    (value: { label: string; state: STATE }) => {
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

  const handleStakeOnly = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;

      if (checked) {
        history.push(`/farm?state=${state}&stakeOnly=true`);
      } else {
        history.push(`/farm?state=${state}`);
      }
    },
    [state],
  );

  return (
    <FarmContext.Provider
      value={{
        unStakedFarms,
        updateUnStakedFarms: handleUpdateUnStakedFarms,
        deleteUnStakedFarms: handleDeleteUnStakedFarms,
      }}
    >
      <MainCard padding="24px">
        <Grid
          container
          justifyContent="space-between"
          sx={{
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
                color={state === tab.state ? "textPrimary" : "textTertiary"}
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0 10px",
              "@media (max-width:640px)": {
                justifyContent: "flex-start",
              },
            }}
          >
            <Typography display="inline">
              <Trans>Staked only</Trans>
            </Typography>
            <Switch checked={stakeOnly === "true"} onChange={handleStakeOnly} />
          </Box>
        </Grid>

        <Box
          sx={{
            position: "relative",
            minHeight: "440px",
            margin: "50px 0 0 0",
          }}
        >
          {!loading ? (
            <Grid container justifyContent="center" sx={{ gap: "20px" }}>
              {farms?.map((ele) => (
                <StakingPoolItem key={ele[0].toString()} stakeOnly={stakeOnly === "true"} state={state} farmTVL={ele} />
              ))}
            </Grid>
          ) : null}

          {((unStakedFarms.length === farms?.length && stakeOnly === "true") || !farms?.length) && !loading && (
            <NoData />
          )}
          {loading ? <StaticLoading loading={loading} /> : null}
        </Box>
      </MainCard>
    </FarmContext.Provider>
  );
}

export default function Farms() {
  return (
    <>
      <GlobalData />
      <Box sx={{ margin: "20px 0 0 0" }}>
        <MainContent />
      </Box>
    </>
  );
}
