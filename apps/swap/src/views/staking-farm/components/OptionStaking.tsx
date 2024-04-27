import { useState } from "react";
import { Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getFarmsState, POOL_STATE } from "utils/staking-farm";
import { Theme } from "@mui/material/styles";
import type { FarmDepositArgs, FarmInfo } from "@icpswap/types";
import UnStakingModal from "./UnStakingModal";
import StakingModal from "./StakingModal";

const useStyle = makeStyles((theme: Theme) => ({
  button: {
    minWidth: "28px",
    width: "28px",
    height: "28px",
    lineHeight: "100%",
    background: "#29314F",
    borderRadius: "8px",
    fontSize: "28px",
    fontWeight: "normal",
    color: theme.palette.mode === "dark" ? theme.colors.darkTextSecondary : theme.colors.lightPrimaryMain,
    "&.Mui-disabled": {
      color: "#666",
    },
  },
}));

export interface OptionStakingProps {
  userFarmInfo: FarmInfo | undefined;
  resetData?: () => void;
  userAllPositions: FarmDepositArgs[];
  farmId: string;
}

export default function OptionStaking({ farmId, userFarmInfo, resetData, userAllPositions }: OptionStakingProps) {
  const classes = useStyle();

  const [unStakingModal, setUnStakingModal] = useState(false);
  const [stakingModal, setStakingModal] = useState(false);

  const state = getFarmsState(userFarmInfo);

  return (
    <>
      <Grid container sx={{ gap: "0 10px" }} justifyContent="flex-end">
        <Button
          disabled={(userFarmInfo?.numberOfStakes ?? 0).toString() === "0"}
          className={classes.button}
          onClick={() => {
            setUnStakingModal(true);
          }}
        >
          -
        </Button>
        <Button
          disabled={state !== POOL_STATE.LIVE}
          className={classes.button}
          onClick={() => {
            setStakingModal(true);
          }}
        >
          +
        </Button>
      </Grid>

      {stakingModal && userFarmInfo && (
        <StakingModal
          open={stakingModal}
          onClose={() => setStakingModal(false)}
          farm={userFarmInfo}
          farmId={farmId}
          resetData={resetData}
        />
      )}

      {unStakingModal && userFarmInfo && (
        <UnStakingModal
          open={unStakingModal}
          onClose={() => setUnStakingModal(false)}
          farm={userFarmInfo}
          farmId={farmId}
          resetData={resetData}
          userAllPositions={userAllPositions}
        />
      )}
    </>
  );
}
