import type { PublicTokenOverview, TokenListMetadata } from "@icpswap/types";
import type { TokenInfo } from "types/token";

import Token from "./Token";
import TokenCharts from "./Charts";
import { SwapProCardWrapper } from "../SwapProWrapper";

export interface TokenChartWrapperProps {
  infoToken: PublicTokenOverview | undefined;
  tokenInfo: TokenInfo | undefined;
  tokenListInfo: TokenListMetadata | undefined;
}

export default function TokenChartWrapper({ infoToken, tokenInfo, tokenListInfo }: TokenChartWrapperProps) {
  return (
    <SwapProCardWrapper padding="0px" background="level2">
      <Token infoToken={infoToken} tokenInfo={tokenInfo} tokenListInfo={tokenListInfo} />
      <TokenCharts />
    </SwapProCardWrapper>
  );
}
