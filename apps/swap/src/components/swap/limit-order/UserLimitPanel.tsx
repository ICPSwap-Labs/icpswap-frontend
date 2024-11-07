import { useContext } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { LimitContext } from "components/swap/limit-order/index";
import { Trans } from "@lingui/macro";
import { useUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { ArrowRight } from "react-feather";
import { useRefreshTriggerManager } from "hooks/index";
import { SWAP_LIMIT_REFRESH_KEY } from "constants/swap";
import { isNullArgs } from "@icpswap/utils";

interface UserLimitOrdersProps {
  onClick: () => void;
}

export function UserLimitPanel({ onClick }: UserLimitOrdersProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const { selectedPool } = useContext(LimitContext);

  const [refreshTrigger] = useRefreshTriggerManager(SWAP_LIMIT_REFRESH_KEY);

  const { result: allLimitOrders } = useUserLimitOrders(selectedPool?.id, principal?.toString(), refreshTrigger);

  return (
    <Box
      mt="8px"
      sx={{
        display: isNullArgs(allLimitOrders) || allLimitOrders.length === 0 ? "none" : "block",
        width: "100%",
        background: theme.palette.background.level1,
        padding: "24px",
        borderRadius: "16px",
        cursor: "pointer",
      }}
    >
      <Flex justify="space-between" onClick={onClick}>
        <Typography>
          <Trans>Limit Order History</Trans>
        </Typography>
        <ArrowRight size={18} />
      </Flex>
    </Box>
  );
}
