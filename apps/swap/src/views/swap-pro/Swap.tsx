import { useState, useCallback, useMemo, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { SwapWrapper } from "components/swap/SwapWrapper";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";

export default function Swap() {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ background: theme.palette.background.level3, padding: "16px", borderRadius: "12px" }}>
      <Typography color="text.primary" fontSize="18px" fontWeight={600} align="center">
        ICPSwap
      </Typography>

      <Box sx={{ margin: "10px 0 0 0" }}>
        <SwapWrapper ui="pro" />
      </Box>
    </Box>
  );
}
