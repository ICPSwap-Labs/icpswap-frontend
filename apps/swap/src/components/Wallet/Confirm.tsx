import { Flex } from "@icpswap/ui";
import { Box, Button, CircularProgress, Typography, useTheme } from "components/Mui";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { WALLET_DRAWER_WIDTH } from "constants/wallet";

interface ConfirmProps {
  title: ReactNode;
  content: ReactNode;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  noCancel?: boolean;
  confirmLoading?: boolean;
}

export function Confirm({
  open,
  title,
  content,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  noCancel = false,
  confirmLoading,
}: ConfirmProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return open ? (
    <Box
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        // Drawer index is 1200
        zIndex: 1201,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          background: "rgba(0, 0, 0, 0.50)",
          maxWidth: `${WALLET_DRAWER_WIDTH}px`,
          padding: "24px",
        }}
      >
        <Box sx={{ background: theme.palette.background.level2, borderRadius: "12px", padding: "16px" }}>
          <Flex fullWidth justify="space-between">
            <Typography sx={{ color: "text.primary", fontSize: "18px" }}>{title}</Typography>
            <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={onCancel}>
              <img width="24px" height="24px" src="/images/wallet/close.svg" alt="" />
            </Box>
          </Flex>

          <Typography sx={{ color: "text.primary", margin: "24px 0 0 0", lineHeight: "20px" }} component="div">
            {content}
          </Typography>

          <Flex sx={{ margin: "32px 0 0 0" }} gap="0 16px">
            {noCancel ? null : (
              <Box sx={{ flex: 1 }}>
                <Button size="large" variant="contained" className="secondary" fullWidth onClick={onCancel}>
                  {cancelText ?? t("common.cancel")}
                </Button>
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Button size="large" variant="contained" fullWidth onClick={onConfirm} disabled={confirmLoading}>
                {confirmLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {confirmText ?? t("common.confirm")}
              </Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  ) : null;
}
