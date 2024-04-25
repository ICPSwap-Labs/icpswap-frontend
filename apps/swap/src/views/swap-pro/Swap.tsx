import { useContext } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { SwapWrapper } from "components/swap/SwapWrapper";
import SwapSettings from "components/swap/SettingIcon";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

export default function Swap() {
  const { setTradePoolId, setInputToken, setOutputToken } = useContext(SwapProContext);
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <SwapProCardWrapper overflow="visible">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="text.primary" fontSize="18px" fontWeight={600} align="center">
          ICPSwap Pro
        </Typography>

        <SwapSettings type="swap" position={matchDownSM ? "right" : "left"} />
      </Box>

      <Box sx={{ margin: "10px 0 0 0" }}>
        <SwapWrapper
          ui="pro"
          onOutputTokenChange={setOutputToken}
          onTradePoolIdChange={setTradePoolId}
          onInputTokenChange={setInputToken}
        />
      </Box>
    </SwapProCardWrapper>
  );
}
