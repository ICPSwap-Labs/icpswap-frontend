import { useInfoToken, useTokenListTokenInfo } from "@icpswap/hooks";
import type { Token } from "@icpswap/swap-sdk";
import { ICP } from "@icpswap/tokens";
import type { InfoTokenRealTimeDataResponse } from "@icpswap/types";
import { ChartView } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Box } from "components/Mui";
import { PoolTokensInformation, useSwapProStore } from "components/swap/pro";
import { useSwapStore } from "components/swap/store";
import { useMediaQuerySM } from "hooks/theme";
import { useEffect, useState } from "react";
import { useFetchGlobalDefaultChartType } from "store/global/hooks";
import { getChartView } from "utils/swap/chartType";
import HotTokens from "./HotTokens";
import { SearchWrapper } from "./layout/SearchWrapper";
import Swap from "./Swap";
import TokenTvlAndLiquidityLocks from "./Token";
import { TokenChartWrapper } from "./TokenChart";
import TokenChartInfo from "./TokenChart/Token";
import Transactions from "./Transactions";

export function SwapProContextWrapper() {
  const matchDownSM = useMediaQuerySM();

  const { inputToken, outputToken } = useSwapStore();
  const { token, setToken, setChartView } = useSwapProStore();

  const [infoToken, setInfoToken] = useState<InfoTokenRealTimeDataResponse | undefined>(undefined);

  const inputTokenInfo = useInfoToken(inputToken?.address);
  const outputTokenInfo = useInfoToken(outputToken?.address);

  useEffect(() => {
    if (!outputToken || !inputToken) return;

    let token: Token = outputToken;
    let infoToken: InfoTokenRealTimeDataResponse | undefined = outputTokenInfo;

    if (outputToken.address === ICP.address) {
      token = inputToken;
      infoToken = inputTokenInfo;
    } else if (inputToken.address === ICP.address) {
      token = outputToken;
      infoToken = outputTokenInfo;
    }

    setToken(token);
    setInfoToken(infoToken);
  }, [outputToken, inputToken, outputTokenInfo, inputTokenInfo, setToken]);

  const { data: tokenListInfo } = useTokenListTokenInfo(token?.address);

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
  }, [inputToken, outputToken, defaultChartType, setChartView]);

  return (
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
  );
}
