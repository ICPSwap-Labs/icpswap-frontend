import { useState } from "react";
import { Button, Box, Grid, CircularProgress, useTheme } from "@mui/material";
import { t } from "@lingui/macro";
import { useTips } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps } from "components/Identity";
import { NoData, Modal } from "components/index";
import type { StakingFarmInfo, StakingFarmDepositArgs, ActorIdentity } from "@icpswap/types";
import { unStake } from "hooks/staking-farm";
import { Theme } from "@mui/material/styles";
import { PositionItem } from "./PositionItem";

export default function UnStakingModal({
  open,
  onClose,
  resetData,
  farm,
  userAllPositions,
}: {
  open: boolean;
  onClose: () => void;
  resetData?: () => void;
  farm: StakingFarmInfo;
  userAllPositions: StakingFarmDepositArgs[];
}) {
  const [openTip] = useTips();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [selectedPositionId, setSelectedPositionId] = useState<number | undefined>(undefined);

  const handleSubmit = async (identity: ActorIdentity) => {
    if (!identity) return;
    handelUnStakeToken(identity);
  };

  const handelUnStakeToken = async (identity: ActorIdentity) => {
    if (!identity || !selectedPositionId) return;

    setConfirmLoading(true);
    const { status, message } = await unStake(identity, farm.farmCid, BigInt(selectedPositionId));
    openTip(getLocaleMessage(message), status);
    setConfirmLoading(false);
    resetData && resetData();
    onClose && onClose();
  };

  const theme = useTheme() as Theme;

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
          {userAllPositions.map((position, index) => {
            return (
              <PositionItem
                key={index}
                poolId={farm.pool}
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

          {!userAllPositions.length && <NoData />}
        </Box>

        <Box mt="20px" sx={{ padding: "0 24px" }}>
          <Identity onSubmit={handleSubmit}>
            {({ submit }: CallbackProps) => (
              <Button
                disabled={confirmLoading || !selectedPositionId}
                variant="contained"
                fullWidth
                type="button"
                onClick={submit}
                color="primary"
                size="large"
                startIcon={confirmLoading ? <CircularProgress size={24} color="inherit" /> : null}
              >
                {t`Confirm`}
              </Button>
            )}
          </Identity>
        </Box>
      </Grid>
    </Modal>
  );
}
