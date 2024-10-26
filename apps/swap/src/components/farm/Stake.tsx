import { useState, useMemo } from "react";
import { Button, Box, CircularProgress, useTheme } from "components/Mui";
import { t } from "@lingui/macro";
import { useTips } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import { Modal } from "components/index";
import { type FarmInfo, ResultStatus, InitFarmArgs } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { approvePosition, farmStake } from "@icpswap/hooks";
import { Position, Token } from "@icpswap/swap-sdk";

import { PositionCard } from "./PositionCard1";

export interface StakingModalProps {
  open: boolean;
  onClose: () => void;
  resetData?: () => void;
  farmInfo: FarmInfo | undefined;
  farmId: string;
  position: Position | undefined;
  positionId: bigint;
  farmInitArgs: InitFarmArgs | undefined;
  rewardToken: Token | undefined;
}

export function Stake({ open, onClose, resetData, farmId, position, positionId }: StakingModalProps) {
  const theme = useTheme() as Theme;
  const [openTip] = useTips();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const { pool } = useMemo(() => {
    return {
      pool: position?.pool,
    };
  }, [position]);

  const handelStake = async () => {
    if (!pool) return;

    setConfirmLoading(true);

    const { status: approveStatus, message: approveMessage } = await approvePosition(pool.id, farmId, positionId);

    if (approveStatus === ResultStatus.ERROR) {
      openTip(approveMessage, approveStatus);
      setConfirmLoading(false);
      return;
    }

    const { status, message } = await farmStake(farmId, positionId);

    openTip(getLocaleMessage(message), status);

    if (status === ResultStatus.OK) {
      if (resetData) resetData();
      if (onClose) onClose();
    }

    setConfirmLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} title={t`Stake`} background={theme.palette.background.level1}>
      <Box>
        <PositionCard position={position} positionId={positionId} />
      </Box>

      <Box mt="24px">
        <Button
          disabled={confirmLoading}
          variant="contained"
          fullWidth
          type="button"
          onClick={handelStake}
          color="primary"
          size="large"
          startIcon={confirmLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {t`Confirm`}
        </Button>
      </Box>
    </Modal>
  );
}
