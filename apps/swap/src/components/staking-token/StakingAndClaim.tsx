import React from "react";
import { Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import BigNumber from "bignumber.js";
import { STATE } from "types/staking-token";
import type { StakingPoolControllerPoolInfo, StakingPoolUserInfo } from "@icpswap/types";

import V2StakingModal from "./V2StakingModal";
import ClaimModal from "./ClaimModal";

const useStyle = makeStyles(() => ({
  button: {
    minWidth: "28px",
    width: "44px",
    height: "44px",
    lineHeight: "100%",
    background: "#29314F",
    borderRadius: "8px",
    fontSize: "28px",
    fontWeight: "normal",
    color: "#ffffff",
    "&:hover": {
      background: "#29314F",
    },
    "&.Mui-disabled": {
      color: "#666",
    },
  },
}));

export interface OptionStakingProps {
  pool: StakingPoolControllerPoolInfo | undefined;
  userStakingInfo?: StakingPoolUserInfo;
  onStakingSuccess?: () => void;
  state: STATE | undefined;
}

export default function OptionStaking({ pool, userStakingInfo, onStakingSuccess, state }: OptionStakingProps) {
  const [openStakingModal, setOpenStakingModal] = React.useState(false);
  const [modalType, setOpenModalType] = React.useState<"Deposit" | "Withdraw">("Deposit");

  const classes = useStyle();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 10px" }}>
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
    </Box>
  );
}
