import { useState } from "react";
import { Box } from "@mui/material";
import { Trade, Token, TradeType } from "@icpswap/swap-sdk";

import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";

import { SwapProContext } from "./context";

export default function SwapPro() {
  const [tokenId, setTokenId] = useState<string>("");
  const [trade, setTrade] = useState<Trade<Token, Token, TradeType.EXACT_INPUT> | undefined>(undefined);

  return (
    <SwapProContext.Provider value={{ tokenId, setTokenId, trade, setTrade }}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ width: "100%", maxWidth: "1440px" }}>
          <HotTokens />

          <Box sx={{ margin: "8px 0 0 0", display: "flex", gap: "0 8px" }}>
            <Box sx={{ width: "350px", display: "flex", flexDirection: "column", gap: "8px 0" }}>
              <Swap />

              <TokenUI />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TokenChartWrapper />
            </Box>
          </Box>
        </Box>
      </Box>
    </SwapProContext.Provider>
  );
}
