import { Trans } from "@lingui/macro";
import { Box, Typography } from "components/Mui";

export function LimitPanel() {
  return (
    <Box
      sx={{
        background: "rgb(84 192 129 / 10%)",
        borderRadius: "8px",
        padding: "6px 9px",
      }}
    >
      <Typography color="text.success" sx={{ fontSize: "12px" }}>
        <Trans>Limit</Trans>
      </Typography>
    </Box>
  );
}
