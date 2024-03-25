import { useState, useMemo } from "react";
import { Button, Grid, CircularProgress, Box, useTheme } from "@mui/material";
import { t } from "@lingui/macro";
import { useTips } from "hooks/useTips";
import { stake } from "hooks/staking-farm";
import { getLocaleMessage } from "locales/services";
import Identity, { CallbackProps } from "components/Identity";
import { NoData, ListLoading, Modal } from "components/index";
import { Identity as CallIdentity, ResultStatus } from "types/global";
import { useAccountPrincipal } from "store/auth/hooks";
import { useSwapUserPositions, approvePosition } from "@icpswap/hooks";
import type { StakingFarmInfo } from "@icpswap/types";
import { collectPositionFee } from "hooks/swap/useClaimFees";
import { Theme } from "@mui/material/styles";
import { PositionItem } from "./PositionItem";

export interface StakingModalProps {
  open: boolean;
  onClose: () => void;
  resetData?: () => void;
  farm: StakingFarmInfo;
}

export default function StakingModal({ open, onClose, resetData, farm }: StakingModalProps) {
  const [openTip] = useTips();

  const principal = useAccountPrincipal();

  const swapPoolId = farm.pool;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<number | undefined>(undefined);

  const { result: allUserPositions, loading } = useSwapUserPositions(farm.pool, principal?.toString());

  const selectedPosition = useMemo(() => {
    if (!allUserPositions || !selectedPositionId) return undefined;
    return allUserPositions.filter((position) => Number(position.id) === selectedPositionId)[0];
  }, [allUserPositions, selectedPositionId]);

  const handleSubmit = async (identity: CallIdentity) => {
    if (!identity || !principal || !selectedPositionId || !selectedPosition) return;

    setConfirmLoading(true);

    const { status: approveStatus, message: approveMessage } = await approvePosition(
      identity,
      swapPoolId,
      farm.farmCid,
      selectedPosition.id,
    );

    if (approveStatus === ResultStatus.ERROR) {
      openTip(approveMessage, approveStatus);
      setConfirmLoading(false);
      return;
    }

    await collectPositionFee(swapPoolId, selectedPosition.id);

    const { status, message } = await stake(identity, farm.farmCid, BigInt(selectedPositionId));

    openTip(getLocaleMessage(message), status);

    setConfirmLoading(false);

    if (resetData) resetData();
    if (onClose) onClose();
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
            minHeight: "300px",
            maxHeight: "580px",
            overflow: "hidden auto",
          }}
        >
          {loading ? (
            <ListLoading mask={false} loading={loading} />
          ) : (
            <Box sx={{ maxHeight: "340px", overflow: "auto" }}>
              <Box>
                {allUserPositions?.map((position, index) => {
                  return (
                    <PositionItem
                      key={index}
                      poolId={farm.pool}
                      positionInfo={{
                        id: position.id,
                        liquidity: position.liquidity,
                        tickLower: position.tickLower,
                        tickUpper: position.tickUpper,
                      }}
                      selectedPositionId={selectedPositionId}
                      setSelectedPositionId={setSelectedPositionId}
                    />
                  );
                })}

                {!allUserPositions?.length && <NoData />}
              </Box>
            </Box>
          )}
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
