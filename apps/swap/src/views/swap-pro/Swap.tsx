import { useContext } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { SwapWrapper } from "components/swap/SwapWrapper";
import SwapSettings from "components/swap/SettingIcon";
import { Reclaim, SwapContext } from "components/swap/index";
import { MainCard } from "components/index";
import { SWAP_REFRESH_KEY } from "constants/index";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

export default function Swap() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { setTradePoolId, setInputToken, setOutputToken } = useContext(SwapProContext);
  const { selectedPool } = useContext(SwapContext);

  return (
    <>
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

        <MainCard level={1} sx={{ margin: "8px 0 0 0" }} padding="10px" borderRadius="12px">
          <Reclaim fontSize="12px" margin="9px" ui="pro" pool={selectedPool} refreshKey={SWAP_REFRESH_KEY} />
        </MainCard>
      </SwapProCardWrapper>
    </>
  );
}
