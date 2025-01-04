import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { WaringIcon } from "assets/icons/WaringIcon";
import { Null } from "@icpswap/types";

export interface LimitSupportedProps {
  available: boolean;
  noLiquidity: boolean | Null;
  ui?: "normal" | "pro";
}

export function LimitSupported({ available, noLiquidity, ui = "normal" }: LimitSupportedProps) {
  return available === false || noLiquidity === true ? (
    <Box
      sx={{
        padding: ui === "normal" ? "16px" : "10px",
        background: "rgba(211, 98, 91, .2)",
        borderRadius: ui === "normal" ? "16px" : "10px",
      }}
    >
      <Flex gap="0 8px">
        <WaringIcon color="#D3625B" />

        <Typography color="#D3625B" sx={{ lineHeight: "20px", fontSize: ui === "normal" ? "14px" : "12px" }}>
          <Trans>Limit order feature isn’t available for this pair yet</Trans>
        </Typography>
      </Flex>
    </Box>
  ) : null;
}
