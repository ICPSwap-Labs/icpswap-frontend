import { useMemo, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { NoData, StaticLoading, MainCard } from "components/index";
import Switch from "components/switch";
import { Trans } from "@lingui/macro";
import { STATE } from "types/staking-farm";
import { useFarms, useParsedQueryString } from "@icpswap/hooks";
import { useHistory } from "react-router-dom";
import StakingPoolItem from "./components/StakingPoolItem";
import GlobalData from "./components/GlobalData";
import { Page, Pages } from "./components/PageToggle";
import FarmContext from "./context";

function MainContent() {
  const history = useHistory();

  const [stakeOnly, setStakeOnly] = useState(false);

  const { state } = useParsedQueryString() as { state: STATE };
  const _state = useMemo(() => state ?? STATE.LIVE, [state]);
  // TODO: page
  const { result, loading } = useFarms(_state);

  const farms = useMemo(() => {
    return result ?? [];
  }, [result]);

  const handleToggle = (value: Page) => {
    history.push(value.path);
  };

  const [unStakedFarms, setUnStakedFarms] = useState<string[]>([]);

  const handleUpdateUnStakedFarms = (unStakedFarms: string) => {
    setUnStakedFarms((prevState) => prevState.concat(unStakedFarms));
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

  const handleToggleCheck = (checked: boolean) => {
    setStakeOnly(checked);
  };

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
            {Pages.map((ele) => (
              <Typography
                key={ele.path}
                color={_state === ele.state ? "textPrimary" : "textTertiary"}
                onClick={() => handleToggle(ele)}
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
                {ele.label}
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
            <Switch
              checked={stakeOnly}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleToggleCheck(event.target.checked)}
            />
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
              {farms.map((ele) => (
                <StakingPoolItem key={ele[0].toString()} stakeOnly={stakeOnly} state={_state} farmTVL={ele} />
              ))}
            </Grid>
          ) : null}
          {((unStakedFarms.length === farms.length && stakeOnly) || !farms.length) && !loading && <NoData />}
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
