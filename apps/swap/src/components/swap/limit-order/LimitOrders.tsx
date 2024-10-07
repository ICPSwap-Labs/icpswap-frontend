import { useCallback, useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { Trans } from "@lingui/macro";
import { Flex, LoadingRow, NoData } from "@icpswap/ui";
import { Pool } from "@icpswap/swap-sdk";
import { useUserLimitOrders } from "@icpswap/hooks";
import { ArrowLeft } from "react-feather";
import { useAccountPrincipal } from "store/auth/hooks";
import { Null } from "@icpswap/types";
import { useRefreshTriggerManager } from "hooks/index";

import { LimitOrder } from "./LimitOrder";

export interface LimitOrdersProps {
  ui?: "pro" | "normal";
  pool: Pool | Null;
  onBack: () => void;
}

export function LimitOrders({ ui = "normal", pool, onBack }: LimitOrdersProps) {
  const principal = useAccountPrincipal();
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("LimitOrders");

  const { result: userLimitOrdersResult, loading } = useUserLimitOrders(
    pool?.id,
    principal?.toString(),
    refreshTrigger,
  );

  const userLimitOrders = useMemo(() => {
    if (!userLimitOrdersResult) return undefined;
    return userLimitOrdersResult.lowerLimitOrderIds.concat(userLimitOrdersResult.upperLimitOrdersIds);
  }, [userLimitOrdersResult]);

  const handleCancelSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: ui === "pro" ? "6px 0" : "6px 0" }}>
      <Flex justify="space-between">
        <Flex gap="0 8px" sx={{ cursor: "pointer" }} onClick={onBack}>
          <ArrowLeft size={18} />
          <Typography>
            <Trans>Back</Trans>
          </Typography>
        </Flex>
      </Flex>

      {loading ? (
        <Box>
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        </Box>
      ) : !userLimitOrders || userLimitOrders.length === 0 ? (
        <NoData />
      ) : (
        <Flex vertical align="flex-start" fullWidth gap="6px 0" sx={{ margin: "16px 0 0 0" }}>
          {userLimitOrders.map(({ userPositionId, timestamp }) => (
            <LimitOrder
              key={userPositionId.toString()}
              positionId={userPositionId}
              time={timestamp}
              pool={pool}
              onCancelSuccess={handleCancelSuccess}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}
