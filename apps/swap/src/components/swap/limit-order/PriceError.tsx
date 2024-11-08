import { useContext, useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { tickToPrice, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { WaringIcon } from "assets/icons/WaringIcon";
import { BigNumber, isNullArgs, numToPercent } from "@icpswap/utils";

import { LimitContext } from "./context";

export interface PriceErrorProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  currentPrice: string | Null;
  minUseableTick: number | Null;
  orderPriceTick: number | Null;
  minSettableTick: number | Null;
}

export function PriceError({ inputToken, outputToken, minSettableTick, orderPriceTick }: PriceErrorProps) {
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
    <Box sx={{ padding: "16px", background: "rgba(211, 98, 91, .2)", borderRadius: "16px" }}>
      <Flex gap="0 8px">
        <WaringIcon color="#D3625B" />

        <Typography color="#D3625B" sx={{ lineHeight: "20px" }}>
          <Trans>
            Your limit price is {numToPercent(new BigNumber(pricePercent).abs())} {inverted ? "higher" : "lower"} than
            settable limit order price. Adjust your limit price to proceed.
          </Trans>
        </Typography>
      </Flex>
    </Box>
  ) : null;
}
