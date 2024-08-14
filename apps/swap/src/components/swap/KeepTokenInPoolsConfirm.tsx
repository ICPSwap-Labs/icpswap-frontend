import { Typography, Button, Box } from "components/Mui";
import SwapModal from "components/modal/swap";
import { Trans } from "@lingui/macro";
import { AlertTriangle } from "react-feather";
import { Flex } from "@icpswap/ui";

export interface KeepTokenInPoolsConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function KeepTokenInPoolsConfirmModal({ open, onCancel, onConfirm }: KeepTokenInPoolsConfirmModalProps) {
  return (
    <SwapModal open={open} onClose={onCancel} title="Note">
      <Box
        sx={{
          padding: "14px 16px",
          background: "rgba(183, 156, 74, 0.2)",
          border: "1px solid var(--warning, #B79C4A)",
          borderRadius: "12px",
        }}
      >
        <Flex gap="0 16px" align="flex-start">
          <Box>
            <AlertTriangle color="rgba(183, 156, 74, 1)" size={16} />
          </Box>
          <Typography color="#B79C4A" sx={{ fontSize: "12px", lineHeight: "20px" }}>
            <Trans>
              Please note that by checking the box, you agree to keep your swapped tokens in the Swap Pools. Click "View
              All" below to see all the tokens you've stored. You can manage them anytime, with options to deposit or
              withdraw as needed.
            </Trans>
          </Typography>
        </Flex>
      </Box>

      <Button variant="contained" size="large" fullWidth sx={{ marginTop: "16px" }} onClick={onConfirm}>
        <Trans>Confirm</Trans>
      </Button>
    </SwapModal>
  );
}
