import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex, MainCard, Tooltip } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { TokenPrice } from "components/swap/index";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { LimitContext } from "./context";

export interface CurrentPricePanelProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
  fontSize?: number;
}

export function CurrentPricePanel({ inputToken, outputToken, currentPrice, fontSize = 14 }: CurrentPricePanelProps) {
  const { t } = useTranslation();
  const { inverted } = useContext(LimitContext);

  return (
    <MainCard level={2} padding="16px" borderRadius="16px" sx={{ "@media(max-width: 640px)": { padding: "12px" } }}>
      <Flex gap="0 8px">
        <Flex gap="0 4px">
          <Typography className={`fontSize${fontSize}`} sx={{ whiteSpace: "nowrap" }}>
            {t("limit.swap.rate")}
          </Typography>
          <Tooltip tips={t("limit.swap.rate.tips")} iconSize={`${fontSize}px`} />
        </Flex>

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
