import { useMemo, useState, useEffect, useContext } from "react";
import { Box, useTheme, useMediaQuery } from "components/Mui";
import { useTokenListTokenInfo, useInfoToken } from "@icpswap/hooks";
import { ICP } from "@icpswap/tokens";
import { SwapContext } from "components/swap/index";
import { ChartButton, ChartView } from "@icpswap/ui";
import { SwapProContext, PoolTokensInformation } from "components/swap/pro";
import { Tab } from "constants/index";
import { useFetchGlobalDefaultChartType } from "store/global/hooks";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { getChartView } from "utils/swap/chartType";

import HotTokens from "./HotTokens";
import Swap from "./Swap";
import TokenTvlAndLiquidityLocks from "./Token";
import { TokenChartWrapper } from "./TokenChart";
import Transactions from "./Transactions";
import { SearchWrapper } from "./layout/SearchWrapper";
import TokenChartInfo from "./TokenChart/Token";

export function SwapProContextWrapper() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { inputToken, outputToken, poolId } = useContext(SwapContext);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.Swap);
  const [chartView, setChartView] = useState<ChartButton | null>(null);

  const inputTokenInfo = useInfoToken(inputToken?.address);
  const outputTokenInfo = useInfoToken(outputToken?.address);

  const { inputTokenPrice, outputTokenPrice } = useMemo(() => {
    return {
      inputTokenPrice: inputTokenInfo?.price ? Number(inputTokenInfo.price) : undefined,
      outputTokenPrice: outputTokenInfo?.price ? Number(outputTokenInfo.price) : undefined,
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

  const defaultChartType = useFetchGlobalDefaultChartType();

  useEffect(() => {
    if (inputToken && outputToken && nonUndefinedOrNull(defaultChartType)) {
      const chartView = getChartView(defaultChartType);

      if (chartView) {
        setChartView({
          label: chartView as unknown as string,
          value: chartView,
          tokenId:
            chartView === ChartView.PRICE
              ? defaultChartType === "Token0"
                ? inputToken.address
                : outputToken.address
              : undefined,
        });
      }
    }
  }, [inputToken, outputToken, defaultChartType, setChartView, poolId]);

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

              <TokenTvlAndLiquidityLocks />

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
