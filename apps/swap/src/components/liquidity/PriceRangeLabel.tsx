import { Box, Typography, useTheme } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex, Tooltip } from "@icpswap/ui";
import { nonNullArgs, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Null, ChartTimeEnum } from "@icpswap/types";
import { SWAP_CHART_RANGE_PRICE_COLOR } from "constants/swap";

export interface PriceRangeLabelProps {
  poolPriceLower: string | number | Null;
  poolPriceUpper: string | number | Null;
  chartTime: ChartTimeEnum;
}

export function PriceRangeLabel({ poolPriceLower, poolPriceUpper, chartTime }: PriceRangeLabelProps) {
  const theme = useTheme();

  return (
    <Flex fullWidth gap="8px 3px" wrap="wrap">
      <Flex gap="0 12px">
        <Box sx={{ background: SWAP_CHART_RANGE_PRICE_COLOR, width: "8px", height: "2px" }} />
        <Flex gap="0 2px" align="center">
          <Tooltip tips={<Trans>Price data updates hourly</Trans>}>
            <Typography
              fontSize="12px"
              sx={{
                lineHeight: "16px",
                textDecoration: "underline",
                textDecorationStyle: "dashed",
                textDecorationColor: theme.palette.text.secondary,
                textUnderlineOffset: "2px",
                cursor: "pointer",
              }}
            >
              <Trans>{chartTime} Price Range:</Trans>&nbsp;
            </Typography>
          </Tooltip>
        </Flex>
      </Flex>

      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>
        {nonNullArgs(poolPriceLower) && nonNullArgs(poolPriceUpper)
          ? `${toSignificantWithGroupSeparator(poolPriceLower, 6)} - ${toSignificantWithGroupSeparator(
              poolPriceUpper,
              6,
            )}`
          : "--"}
      </Typography>
    </Flex>
  );
}
