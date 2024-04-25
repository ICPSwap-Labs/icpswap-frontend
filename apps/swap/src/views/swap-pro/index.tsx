import { useMemo, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useTokenListTokenInfo } from "@icpswap/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useInfoToken } from "hooks/info/useInfoTokens";
import { ICP } from "@icpswap/tokens";

import { SwapProContext } from "./context";
import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";
import Transactions from "./Transactions";
import { SearchWrapper } from "./layout/SearchWrapper";
import TokenChartInfo from "./TokenChart/Token";

export default function SwapPro() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [inputToken, setInputToken] = useState<Token | undefined>(undefined);
  const [outputToken, setOutputToken] = useState<Token | undefined>(undefined);
  const [tradePoolId, setTradePoolId] = useState<string | undefined>(undefined);

  const inputTokenInfo = useInfoToken(inputToken?.address);
  const outputTokenInfo = useInfoToken(outputToken?.address);

  const { inputTokenPrice, outputTokenPrice } = useMemo(() => {
    return {
      inputTokenPrice: inputTokenInfo?.priceUSD,
      outputTokenPrice: outputTokenInfo?.priceUSD,
    };
  }, [inputTokenInfo, outputTokenInfo]);

  const { token, infoToken } = useMemo(() => {
    if (!outputToken || !inputToken) return { token: undefined, infoToken: undefined };

    if (outputToken.address === ICP.address) return { token: inputToken, infoToken: inputTokenInfo };
    if (inputToken.address === ICP.address) return { token: outputToken, infoToken: outputTokenInfo };

    return { token: outputToken, infoToken: outputTokenInfo };
  }, [outputToken, inputToken, outputTokenInfo, inputTokenInfo]);

  const tokenId = useMemo(() => token?.address, [token]);

  const { result: tokenInfo } = useTokenInfo(tokenId);
  const { result: tokenListInfo } = useTokenListTokenInfo(tokenId);

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
        token,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ margin: "0 0 8px 0" }}>
            <SearchWrapper />
          </Box>

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
                <TokenChartInfo infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
              ) : null}
              <TokenUI infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
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
              <TokenChartWrapper infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
              <Transactions />
            </Box>
          </Box>
        </Box>
      </Box>
    </SwapProContext.Provider>
  );
}
