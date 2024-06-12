import { useState } from "react";
import { Button, Box, Grid, CircularProgress, useTheme } from "@mui/material";
import { t } from "@lingui/macro";
import { useTips } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import { NoData, Modal } from "components/index";
import { type FarmInfo, type FarmDepositArgs, ResultStatus } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { farmUnstake, farmWithdraw } from "@icpswap/hooks";

import { PositionItem } from "./PositionItem";

export interface UnStakingModalProps {
  open: boolean;
  onClose: () => void;
  resetData?: () => void;
  farm: FarmInfo;
  userStakedPositions: FarmDepositArgs[];
  farmId: string;
}

export default function UnStakingModal({
  open,
  onClose,
  resetData,
  farmId,
  farm,
  userStakedPositions,
}: UnStakingModalProps) {
  const theme = useTheme() as Theme;
  const [openTip] = useTips();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [selectedPositionId, setSelectedPositionId] = useState<number | undefined>(undefined);

  const handelUnStakeToken = async () => {
    if (!selectedPositionId) return;

    setConfirmLoading(true);
    const { status, message } = await farmUnstake(farmId, BigInt(selectedPositionId));

    if (status === ResultStatus.OK) {
      await farmWithdraw(farmId);
      openTip(getLocaleMessage(message) ?? t`Unstake successfully`, ResultStatus.OK);
    } else {
      openTip(getLocaleMessage(message) ?? t`Failed to unstake`, ResultStatus.ERROR);
    }

    setConfirmLoading(false);

    if (resetData) resetData();
    if (onClose) onClose();
  };

  return (
    <Modal
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={t`Select a position`}
      dialogProps={{
        sx: {
          "& .MuiDialog-paper": {
            width: "632px",
          },
          "& .MuiDialogContent-root": {
            padding: "0",
          },
          "& .MuiDialogTitle-root": {
            padding: "8px 12px",
          },
        },
      }}
      background={theme.palette.background.level1}
    >
      <Grid style={{ minHeight: "300px" }}>
        <Box
          sx={{
            maxHeight: "340px",
            overflow: "auto",
          }}
        >
          {userStakedPositions.map((position, index) => {
            return (
              <PositionItem
                key={index}
                poolId={farm.pool.toString()}
                positionInfo={{
                  id: position.positionId,
                  liquidity: position.liquidity,
                  tickLower: position.tickLower,
                  tickUpper: position.tickUpper,
                }}
                selectedPositionId={selectedPositionId}
                setSelectedPositionId={setSelectedPositionId}
              />
            );
          })}

          {!userStakedPositions.length && <NoData />}
        </Box>

        <Box mt="20px" sx={{ padding: "0 24px" }}>
          <Button
            disabled={confirmLoading || !selectedPositionId}
            variant="contained"
            fullWidth
            type="button"
            onClick={handelUnStakeToken}
            color="primary"
            size="large"
            startIcon={confirmLoading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {t`Confirm`}
          </Button>
        </Box>
      </Grid>
    </Modal>
  );
}
