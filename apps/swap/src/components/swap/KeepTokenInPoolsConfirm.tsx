import { Typography, Button, Box } from "components/Mui";
import SwapModal from "components/modal/swap";
import { AlertTriangle } from "react-feather";
import { Flex } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface KeepTokenInPoolsConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function KeepTokenInPoolsConfirmModal({ open, onCancel, onConfirm }: KeepTokenInPoolsConfirmModalProps) {
  const { t } = useTranslation();

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
            {t("swap.keep.in.pool.confirms")}
          </Typography>
        </Flex>
      </Box>

      <Button variant="contained" size="large" fullWidth sx={{ marginTop: "16px" }} onClick={onConfirm}>
        {t("common.confirm")}
      </Button>
    </SwapModal>
  );
}
