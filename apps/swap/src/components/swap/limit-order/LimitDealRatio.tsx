import { Typography, Box, useTheme } from "components/Mui";
import { numToPercent } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { LimitOrder, Null } from "@icpswap/types";
import { Flex } from "components/index";
import { useLimitDealRatio } from "hooks/swap/limit-order/index";

export interface LimitDealRatioProps {
  position: Position | Null;
  limit: LimitOrder | Null;
}

export function LimitDealRatio({ position, limit }: LimitDealRatioProps) {
  const theme = useTheme();

  const dealRatio = useLimitDealRatio({ position, limit });

  return (
    <Flex gap="0 8px">
      <Box
        sx={{
          position: "relative",
          width: "100px",
          height: "6px",
          background: theme.colors.color0,
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: dealRatio ? numToPercent(dealRatio, 2) : "0px",
            height: "6px",
            background: theme.palette.background.success,
            borderRadius: "20px",
            top: 0,
            left: 0,
          }}
        />
      </Box>

      {dealRatio ? <Typography color="text.primary">{numToPercent(dealRatio, 2)}</Typography> : null}
    </Flex>
  );
}
