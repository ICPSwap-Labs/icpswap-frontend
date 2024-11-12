import { useContext, useCallback, useRef } from "react";
import { parseTokenAmount } from "@icpswap/utils";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { SwapWrapper, type SwapWrapperRef } from "components/swap/SwapWrapper";
import SwapSettings from "components/swap/SettingIcon";
import { Reclaim, SwapContext } from "components/swap/index";
import { MainCard } from "components/index";
import { SWAP_REFRESH_KEY } from "constants/index";

import { SwapProCardWrapper } from "./SwapProWrapper";
import { SwapProContext } from "./context";

export default function Swap() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const swapWrapperRef = useRef<SwapWrapperRef>(null);
  const { setTradePoolId, inputToken, setInputToken, setOutputToken } = useContext(SwapProContext);
  const { selectedPool, noLiquidity } = useContext(SwapContext);

  const handleInputTokenClick = useCallback(
    (tokenAmount: string) => {
      if (!inputToken) return;
      swapWrapperRef.current?.setInputAmount(parseTokenAmount(tokenAmount, inputToken.decimals).toString());
    },
    [swapWrapperRef, inputToken],
  );

  return (
    <>
      <SwapProCardWrapper overflow="visible">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography color="text.primary" fontSize="18px" fontWeight={600} align="center">
            ICPSwap Pro
          </Typography>

          <SwapSettings ui="pro" type="swap" position={matchDownSM ? "right" : "left"} />
        </Box>

        <Box sx={{ margin: "10px 0 0 0" }}>
          <SwapWrapper
            ref={swapWrapperRef}
            ui="pro"
            onOutputTokenChange={setOutputToken}
            onTradePoolIdChange={setTradePoolId}
            onInputTokenChange={setInputToken}
          />
        </Box>

        {noLiquidity === false ? (
          <MainCard level={1} sx={{ margin: "8px 0 0 0" }} padding="10px" borderRadius="12px">
            <Reclaim
              fontSize="12px"
              margin="9px"
              ui="pro"
              pool={selectedPool}
              refreshKey={SWAP_REFRESH_KEY}
              inputToken={inputToken}
              onInputTokenClick={handleInputTokenClick}
            />
          </MainCard>
        ) : null}
      </SwapProCardWrapper>
    </>
  );
}
