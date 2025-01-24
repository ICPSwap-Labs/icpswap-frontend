import { Box, useMediaQuery, useTheme } from "components/Mui";
import type { PublicTokenOverview, TokenListMetadata } from "@icpswap/types";
import { SwapProCardWrapper } from "components/swap/pro";

import Token from "./Token";
import TokenCharts from "./Charts";
import { TokenChartsViewSelector } from "./TokenChartsViewSelector";

export interface TokenChartWrapperProps {
  infoToken: PublicTokenOverview | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export default function TokenChartWrapper({ infoToken, tokenListInfo }: TokenChartWrapperProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

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
