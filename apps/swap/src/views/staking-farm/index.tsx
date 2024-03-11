import { useMemo, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { NoData, StaticLoading, MainCard } from "components/index";
import { Page, Pages } from "./components/PageToggle";
import GlobalData from "./components/GlobalData";
import StakingPoolItem from "./components/StakingPoolItem";
import Switch from "components/switch";
import { Trans } from "@lingui/macro";
import { STATE } from "types/staking-farm";
import type { StakingFarmInfo } from "@icpswap/types";
import { useV3StakingFarms } from "@icpswap/hooks";
import { useHistory } from "react-router-dom";
import useParsedQueryString from "hooks/useParsedQueryString";
import FarmContext from "./context";

function MainContent() {
  const history = useHistory();

  const [stakeOnly, setStakeOnly] = useState(false);

  const { state } = useParsedQueryString() as { state: STATE };
  const _state = useMemo(() => state ?? STATE.LIVE, [state]);
  const { result, loading } = useV3StakingFarms(0, 200, _state);
  const { content: list } = result ?? { content: [] as StakingFarmInfo[] };

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
      <MainCard>
        <Grid
          container
          direction="row"
          sx={{
            padding: "10px 0 40px",
            "@media (max-width: 960px)": {
              padding: "10px 0px 0px 0px",
            },
          }}
        >
          <Grid item>
            <Box sx={{ display: "flex", gap: "0 20px" }}>
              {Pages.map((ele) => (
                <Typography
                  key={ele.path}
                  variant="h3"
                  color={_state === ele.state ? "textPrimary" : "textTertiary"}
                  onClick={() => handleToggle(ele)}
                  sx={{
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
          </Grid>
          <Grid item style={{ marginLeft: "auto" }}>
            <Grid container alignItems={"center"}>
              <Typography display="inline">
                <Trans>Staked only</Trans>
              </Typography>
              <Switch checked={stakeOnly} onChange={(event: any) => handleToggleCheck(event.target.checked)} />
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            position: "relative",
            minHeight: "440px",
          }}
        >
          {!loading ? (
            <Grid container justifyContent="center" sx={{ gap: "20px" }}>
              {list.map((ele) => (
                <StakingPoolItem key={ele.farmCid} stakeOnly={stakeOnly} state={_state} farm={ele} />
              ))}
            </Grid>
          ) : null}
          {((unStakedFarms.length === list.length && stakeOnly) || !list.length) && !loading && <NoData />}
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
