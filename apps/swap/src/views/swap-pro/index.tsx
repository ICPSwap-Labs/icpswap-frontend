import { useState } from "react";
import { Box } from "@mui/material";

import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useInfoToken } from "hooks/uesInfoToken";
import { useTokenListTokenInfo } from "@icpswap/hooks";

import { SwapProContext } from "./context";
import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";
import Transactions from "./Transactions";

export default function SwapPro() {
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [tradePoolId, setTradePoolId] = useState<string | undefined>(undefined);

  const { result: infoToken } = useInfoToken(tokenId);
  const { result: tokenInfo } = useTokenInfo(tokenId);
  const { result: tokenListInfo } = useTokenListTokenInfo(tokenId);

  return (
    <SwapProContext.Provider value={{ tokenId, setTokenId, tradePoolId, setTradePoolId }}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ width: "100%", maxWidth: "1440px" }}>
          <HotTokens />

          <Box sx={{ margin: "8px 0 0 0", display: "flex", gap: "0 8px" }}>
            <Box sx={{ width: "350px", display: "flex", flexDirection: "column", gap: "8px 0" }}>
              <Swap />
              <TokenUI infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px 0", overflow: "hidden" }}>
              <TokenChartWrapper infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
              <Transactions />
            </Box>
          </Box>
        </Box>
      </Box>
    </SwapProContext.Provider>
  );
}
