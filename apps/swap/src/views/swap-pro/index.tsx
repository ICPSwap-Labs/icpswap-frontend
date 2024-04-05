import { useMemo, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useTokenListTokenInfo } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useInfoToken } from "hooks/info/useInfoTokens";

import { SwapProContext } from "./context";
import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";
import Transactions from "./Transactions";
import { SwapProLayout } from "./layout";
import TokenChartInfo from "./TokenChart/Token";

export default function SwapPro() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [inputToken, setInputToken] = useState<Token | undefined>(undefined);
  const [outputToken, setOutputToken] = useState<Token | undefined>(undefined);
  const [tradePoolId, setTradePoolId] = useState<string | undefined>(undefined);

  const { result: tokenInfo } = useTokenInfo(outputToken?.address);
  const { result: tokenListInfo } = useTokenListTokenInfo(outputToken?.address);

  const inputTokenInfo = useInfoToken(inputToken?.address);
  const outputTokenInfo = useInfoToken(outputToken?.address);

  const { inputTokenPrice, outputTokenPrice } = useMemo(() => {
    return {
      inputTokenPrice: inputTokenInfo?.priceUSD,
      outputTokenPrice: outputTokenInfo?.priceUSD,
    };
  }, [inputTokenInfo, outputTokenInfo]);

  return (
    <SwapProContext.Provider
      value={{
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
        tradePoolId,
        setTradePoolId,
        inputTokenPrice,
        outputTokenPrice,
      }}
    >
      <SwapProLayout>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <HotTokens />

            <Box
              sx={{
                margin: "8px 0 0 0",
                display: "flex",
                gap: "0 8px",
                "@media(max-width: 960px)": {
                  flexDirection: "column",
                  gap: "20px 0",
                },
              }}
            >
              <Box
                sx={{
                  width: "350px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px 0",
                  "@media(max-width: 960px)": {
                    gap: "20px 0",
                    width: "100%",
                  },
                }}
              >
                <Swap />
                {matchDownSM ? (
                  <TokenChartInfo infoToken={outputTokenInfo} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
                ) : null}
                <TokenUI infoToken={outputTokenInfo} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px 0",
                  overflow: "hidden",
                  "@media(max-width: 640px)": {
                    gap: "20px 0",
                  },
                }}
              >
                <TokenChartWrapper infoToken={outputTokenInfo} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
                <Transactions />
              </Box>
            </Box>
          </Box>
        </Box>
      </SwapProLayout>
    </SwapProContext.Provider>
  );
}
