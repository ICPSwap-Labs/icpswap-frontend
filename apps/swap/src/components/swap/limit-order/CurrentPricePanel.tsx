import { useContext } from "react";
import { Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex, MainCard } from "@icpswap/ui";
import { TokenPrice } from "components/swap/index";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { LimitContext } from "./context";

export interface CurrentPricePanelProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
  fontSize?: string;
}

export function CurrentPricePanel({
  inputToken,
  outputToken,
  currentPrice,
  fontSize = "14px",
}: CurrentPricePanelProps) {
  const { inverted } = useContext(LimitContext);

  return (
    <MainCard level={2} padding="20px 16px" borderRadius="16px">
      <Flex gap="0 8px">
        <Typography sx={{ fontSize }}>
          <Trans>Current Price</Trans>
        </Typography>

        <TokenPrice
          inverted={inverted}
          sx={{ color: "text.primary", cursor: "pointer", fontSize }}
          baseToken={inputToken}
          quoteToken={outputToken}
          price={currentPrice}
          showUSD
          fontSize={fontSize}
        />
      </Flex>
    </MainCard>
  );
}
