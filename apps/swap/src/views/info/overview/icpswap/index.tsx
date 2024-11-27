import { Box, Typography, useTheme } from "components/Mui";
import { Trans } from "@lingui/macro";
import { formatDollarAmount } from "@icpswap/utils";
import { useSwapProtocolData, useTokensFromList } from "@icpswap/hooks";
import { Flex, MainCard } from "@icpswap/ui";

import { Staking } from "./Staking";
import { Farm } from "./Farm";
import { Swap } from "./Swap";

export function ICPSwap() {
  const theme = useTheme();

  const { result: swapProtocol } = useSwapProtocolData();
  const { result: tokenList } = useTokensFromList();

  return (
    <Box sx={{ width: "100%" }}>
      <MainCard level={3}>
        <Typography fontSize="18px" color="text.primary" fontWeight={500}>
          ICPSwap
        </Typography>

        <Box
          sx={{
            background: theme.palette.background.level4,
            borderRadius: "24px",
            padding: "24px 0",
            display: "flex",
            margin: "32px 0 0 0",
            border: "1px solid #38446C",
          }}
        >
          <Flex sx={{ flex: "50%" }} vertical gap="16px 0" align="center">
            <Typography>TVL</Typography>
            <Typography sx={{ fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
              {swapProtocol ? formatDollarAmount(swapProtocol.tvlUSD) : "--"}
            </Typography>
          </Flex>
          <Flex sx={{ flex: "50%" }} vertical gap="16px 0">
            <Typography>Token List</Typography>
            <Typography sx={{ fontSize: "24px", fontWeight: 500, color: "text.primary" }}>
              <Trans>{tokenList ? tokenList.length : "--"} Tokens</Trans>
            </Typography>
          </Flex>
        </Box>

        <Box sx={{ margin: "24px 0 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 24px" }}>
          <Swap />
          <Staking />
          <Farm />
        </Box>
      </MainCard>
    </Box>
  );
}
