import { useContext, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { LimitContext } from "components/swap/limit-order/index";
import { Trans } from "@lingui/macro";
import { useUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { ArrowRight } from "react-feather";
import { useRefreshTriggerManager } from "hooks/index";
import { SWAP_LIMIT_REFRESH_KEY } from "constants/swap";

interface UserLimitOrdersProps {
  onClick: () => void;
}

export function UserLimitPanel({ onClick }: UserLimitOrdersProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const { selectedPool } = useContext(LimitContext);

  const [refreshTrigger] = useRefreshTriggerManager(SWAP_LIMIT_REFRESH_KEY);

  const { result } = useUserLimitOrders(selectedPool?.id, principal?.toString(), refreshTrigger);

  const allLimitOrders = useMemo(() => {
    if (!result) return undefined;
    return result.lowerLimitOrderIds.concat(result.upperLimitOrdersIds);
  }, [result]);

  return (
    <Box
      mt="8px"
      sx={{
        width: "100%",
        background: theme.palette.background.level1,
        padding: "24px",
        borderRadius: "16px",
        cursor: "pointer",
      }}
    >
      <Flex justify="space-between" onClick={onClick}>
        <Typography>
          <Trans>All {allLimitOrders ? allLimitOrders.length : "--"} limits</Trans>
        </Typography>
        <ArrowRight size={18} />
      </Flex>
    </Box>
  );
}
