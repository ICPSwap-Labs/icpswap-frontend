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
  fontSize?: number;
}

export function CurrentPricePanel({ inputToken, outputToken, currentPrice, fontSize = 14 }: CurrentPricePanelProps) {
  const { inverted } = useContext(LimitContext);

  return (
    <MainCard level={2} padding="16px" borderRadius="16px" sx={{ "@media(max-width: 640px)": { padding: "12px" } }}>
      <Flex gap="0 8px">
        <Typography className={`fontSize${fontSize}`} sx={{ whiteSpace: "nowrap" }}>
          <Trans>Current Price</Trans>
        </Typography>

        <TokenPrice
          inverted={inverted}
          sx={{
            color: "text.primary",
            cursor: "pointer",
            textAlign: "right",
          }}
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
