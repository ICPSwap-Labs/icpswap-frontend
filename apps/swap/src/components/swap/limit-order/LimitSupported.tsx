import { useContext } from "react";
import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";
import { WaringIcon } from "assets/icons/WaringIcon";
import { useLimitSupported } from "hooks/swap/limit-order";

import { LimitContext } from "./context";

export function LimitSupported() {
  const { selectedPool } = useContext(LimitContext);

  const available = useLimitSupported({ canisterId: selectedPool?.id });

  return available === false ? (
    <Box sx={{ padding: "16px", background: "rgba(211, 98, 91, .2)", borderRadius: "16px" }}>
      <Flex gap="0 8px">
        <WaringIcon color="#D3625B" />

        <Typography color="#D3625B" sx={{ lineHeight: "20px" }}>
          <Trans>Limit order feature isn’t available for this pair yet</Trans>
        </Typography>
      </Flex>
    </Box>
  ) : null;
}
