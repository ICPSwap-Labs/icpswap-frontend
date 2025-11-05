import { FilledTextField, Flex, Modal } from "@icpswap/ui";
import { Box, Button, TextField, Typography, useTheme } from "components/Mui";
import { SelectToken } from "components/Select/SelectToken";
import { PRICE_ALERTS_MODAL_WIDTH } from "constants/swap";

interface SelectButtonProps {
  height?: string;
  text: string;
  active?: boolean;
}

function SelectButton({ text, height = "48px", active }: SelectButtonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: theme.palette.background.level4,
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: active ? "1px solid #ffffff" : `1px slid ${theme.palette.background.level4}`,
      }}
    >
      <Typography sx={{ color: "text.primary", fontWeight: 500 }}>{text}</Typography>
    </Box>
  );
}

interface CreateAlertsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAlertsModal({ open, onClose }: CreateAlertsModalProps) {
  return (
    <Modal open={open} title="Create alert" dialogWidth={PRICE_ALERTS_MODAL_WIDTH} onClose={onClose}>
      <Flex fullWidth align="flex-start" vertical gap="16px 0">
        <Box sx={{ width: "100%" }}>
          <Typography>Token</Typography>
          <Box sx={{ height: "40px", margin: "12px 0 0 0" }}>
            <SelectToken filled showClean={false} fullHeight />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Alert type</Typography>
          <Box sx={{ height: "40px", margin: "12px 0 0 0" }}>
            <SelectToken filled showClean={false} fullHeight />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Targe price</Typography>
          <Box sx={{ width: "100%", margin: "12px 0 0 0" }}>
            <FilledTextField />
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography>Alert frequency</Typography>
          <Box sx={{ width: "100%", margin: "12px 0 0 0" }}>
            <Flex fullWidth gap="0 16px">
              <Box sx={{ flex: "50%" }}>
                <SelectButton text="Every time triggered" />
              </Box>
              <Box sx={{ flex: "50%" }}>
                <SelectButton text="Once only" />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>

      <Box sx={{ margin: "32px 0 0 0" }}>
        <Button variant="contained" size="large">
          Add
        </Button>
      </Box>
    </Modal>
  );
}
