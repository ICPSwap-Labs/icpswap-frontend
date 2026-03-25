import type { InfoTokenRealTimeDataResponse, TokenListMetadata } from "@icpswap/types";
import { Box } from "components/Mui";
import { SwapProCardWrapper } from "components/swap/pro";
import { useMediaQuerySM } from "hooks/theme";
import { TokenCharts } from "./Charts";
import Token from "./Token";
import { TokenChartsViewSelector } from "./TokenChartsViewSelector";

export interface TokenChartWrapperProps {
  infoToken: InfoTokenRealTimeDataResponse | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export function TokenChartWrapper({ infoToken, tokenListInfo }: TokenChartWrapperProps) {
  const matchDownSM = useMediaQuerySM();

  return (
    <>
      {matchDownSM ? (
        <Box sx={{ width: "fit-content" }}>
          <TokenChartsViewSelector />
        </Box>
      ) : null}

      <SwapProCardWrapper padding="0px" background="level2">
        {!matchDownSM ? <Token infoToken={infoToken} tokenListInfo={tokenListInfo} /> : null}
        <TokenCharts />
      </SwapProCardWrapper>
    </>
  );
}
