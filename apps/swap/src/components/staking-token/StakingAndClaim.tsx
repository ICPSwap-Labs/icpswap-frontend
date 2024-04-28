import React from "react";
import { Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import BigNumber from "bignumber.js";
import { Theme } from "@mui/material/styles";
import { STATE, UserStakingInfo } from "types/staking-token";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import V2StakingModal from "./V2StakingModal";
import ClaimModal from "./ClaimModal";

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
  pool: StakingPoolControllerPoolInfo | undefined;
  userStakingInfo?: UserStakingInfo;
  onStakingSuccess?: () => void;
  state: STATE;
}

export default function OptionStaking({ pool, userStakingInfo, onStakingSuccess, state }: OptionStakingProps) {
  const [openStakingModal, setOpenStakingModal] = React.useState(false);
  const [modalType, setOpenModalType] = React.useState<"Deposit" | "Withdraw">("Deposit");

  const classes = useStyle();

  return (
    <Grid container direction="row" spacing={3} justifyContent="flex-end">
      <Grid item>
        <Button
          disabled={!new BigNumber(Number(userStakingInfo?.amount ?? 0)).isGreaterThan(0)}
          className={classes.button}
          onClick={() => {
            setOpenModalType("Withdraw");
            setOpenStakingModal(true);
          }}
        >
          -
        </Button>
      </Grid>
      <Grid item>
        <Button
          disabled={state !== STATE.LIVE}
          className={classes.button}
          onClick={() => {
            setOpenModalType("Deposit");
            setOpenStakingModal(true);
          }}
        >
          +
        </Button>
      </Grid>
      {openStakingModal &&
        (modalType === "Deposit" ? (
          <V2StakingModal
            open={openStakingModal}
            onClose={() => setOpenStakingModal(false)}
            onStakingSuccess={onStakingSuccess}
            pool={pool}
          />
        ) : pool ? (
          <ClaimModal
            open={openStakingModal}
            onClose={() => setOpenStakingModal(false)}
            onStakingSuccess={onStakingSuccess}
            pool={pool}
          />
        ) : null)}
    </Grid>
  );
}
