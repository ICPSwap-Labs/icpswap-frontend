import { useMemo, useState, useEffect, useContext } from "react";
import { Box, useTheme, useMediaQuery } from "components/Mui";
import { useTokenListTokenInfo, useInfoToken } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { SwapContext } from "components/swap/index";
import { ChartButton } from "@icpswap/ui";
import { SwapProContext, PoolTokensInformation } from "components/swap/pro";
import { DefaultChartView } from "constants/index";

import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenUI from "./Token";
import TokenChartWrapper from "./TokenChart";
import Transactions from "./Transactions";
import { SearchWrapper } from "./layout/SearchWrapper";
import TokenChartInfo from "./TokenChart/Token";

export function SwapProContextWrapper() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { inputToken, outputToken, poolId } = useContext(SwapContext);

  const [activeTab, setActiveTab] = useState<"SWAP" | "LIMIT">("SWAP");
  const [chartView, setChartView] = useState<ChartButton | null>(DefaultChartView);

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

  const { result: tokenListInfo } = useTokenListTokenInfo(tokenId);

  useEffect(() => {
    if (token) {
      setChartView(DefaultChartView);
    }
  }, [token, setChartView, poolId]);

  return (
    <SwapProContext.Provider
      value={{
        inputTokenPrice,
        outputTokenPrice,
        token,
        chartView,
        setChartView,
        activeTab,
        setActiveTab,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Box sx={{ width: "100%", padding: "0 0 8px 0" }}>
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
                width: "380px",
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

              {matchDownSM ? <TokenChartInfo infoToken={infoToken} tokenListInfo={tokenListInfo} /> : null}

              <TokenUI />

              <PoolTokensInformation />
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
              <TokenChartWrapper infoToken={infoToken} tokenListInfo={tokenListInfo} />
              <Transactions />
            </Box>
          </Box>
        </Box>
      </Box>
    </SwapProContext.Provider>
  );
}
