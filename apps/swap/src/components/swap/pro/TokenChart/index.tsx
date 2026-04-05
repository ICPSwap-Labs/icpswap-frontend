import type { Token } from "@icpswap/swap-sdk";
import type { InfoTokenRealTimeDataResponse, Null, TokenListMetadata } from "@icpswap/types";
import { Box } from "components/Mui";
import { SwapProCardWrapper } from "components/swap/pro";
import { TokenCharts } from "components/swap/pro/TokenChart/Charts";
import { TokenChartInfo } from "components/swap/pro/TokenChart/TokenChartInfo";
import { TokenChartsViewSelector } from "components/swap/pro/TokenChart/TokenChartsViewSelector";
import { useMediaQuerySM } from "hooks/theme";

export interface TokenChartWrapperProps {
  infoToken: InfoTokenRealTimeDataResponse | undefined;
  tokenListInfo: TokenListMetadata | undefined;
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function TokenChartWrapper({ infoToken, tokenListInfo, inputToken, outputToken }: TokenChartWrapperProps) {
  const matchDownSM = useMediaQuerySM();

  return (
    <>
      {matchDownSM ? (
        <Box sx={{ width: "fit-content" }}>
          <TokenChartsViewSelector />
        </Box>
      ) : null}

      <SwapProCardWrapper padding="0px" background="level2">
        {!matchDownSM ? (
          <TokenChartInfo
            infoToken={infoToken}
            tokenListInfo={tokenListInfo}
            inputToken={inputToken}
            outputToken={outputToken}
          />
        ) : null}
        <TokenCharts />
      </SwapProCardWrapper>
    </>
  );
}
