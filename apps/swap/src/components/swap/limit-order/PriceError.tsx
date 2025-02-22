import { useContext, useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { tickToPrice, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { WaringIcon } from "assets/icons/WaringIcon";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

import { LimitContext } from "./context";

export interface PriceErrorProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
  orderPriceTick: number | Null;
  minSettableTick: number | Null;
  ui?: "normal" | "pro";
}

export function PriceError({
  inputToken,
  outputToken,
  minSettableTick,
  orderPriceTick,
  ui = "normal",
}: PriceErrorProps) {
  const { t } = useTranslation();
  const { selectedPool, inverted } = useContext(LimitContext);

  const pricePercent = useMemo(() => {
    if (isNullArgs(orderPriceTick) || isNullArgs(minSettableTick) || isNullArgs(inputToken) || isNullArgs(outputToken))
      return null;

    const orderPrice = tickToPrice(inputToken, outputToken, orderPriceTick);
    const minPrice = tickToPrice(inputToken, outputToken, minSettableTick).toFixed(outputToken.decimals);

    if (new BigNumber(orderPrice.toFixed(outputToken.decimals)).isGreaterThan(minPrice)) return null;

    const __percent = new BigNumber(orderPrice.toFixed(8)).minus(minPrice).dividedBy(minPrice).toFixed(4);

    if (new BigNumber(__percent).isLessThan(0)) return __percent;

    return null;
  }, [selectedPool, orderPriceTick, inputToken, minSettableTick, inputToken, outputToken]);

  return pricePercent ? (
    <Box
      sx={{
        padding: ui === "normal" ? "16px" : "10px",
        background: "rgba(211, 98, 91, .2)",
        borderRadius: ui === "normal" ? "16px" : "12px",
      }}
    >
      <Flex gap="0 8px">
        <WaringIcon color="#D3625B" />

        <Typography color="#D3625B" sx={{ lineHeight: "20px", fontSize: ui === "normal" ? "14px" : "12px" }}>
          {t("limit.price.error", { key: inverted ? "higher" : "lower" })}
        </Typography>
      </Flex>
    </Box>
  ) : null;
}
