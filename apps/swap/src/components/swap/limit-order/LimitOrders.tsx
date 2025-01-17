import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, LoadingRow, NoData } from "@icpswap/ui";
import { Pool } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useRefreshTriggerManager } from "hooks/index";
import { SelectPair } from "components/Select/SelectPair";
import { useLimitOrders } from "hooks/swap/limit-order/useLimitOrders";

import { LimitOrder } from "./LimitOrder";

export interface LimitOrdersProps {
  ui?: "pro" | "normal";
  pool: Pool | Null;
}

export function LimitOrders({ pool: __pool }: LimitOrdersProps) {
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("LimitOrders");
  const [pair, setPair] = useState<Null | string>(null);

  const { result: userLimitOrders, loading } = useLimitOrders({ val: pair, refreshTrigger });

  const handleCancelSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  const handlePairChange = useCallback(
    (id: string | undefined) => {
      setPair(id);
    },
    [setPair],
  );

  useEffect(() => {
    if (__pool) {
      setPair(__pool.id);
    }
  }, [__pool]);

  return (
    <>
      <Box sx={{ margin: "18px 0 0 0" }}>
        <Flex vertical gap="16px 0" fullWidth align="flex-start">
          <Flex gap="0 4px">
            <Typography>Select a pair: </Typography>
            <SelectPair
              value={pair}
              panelPadding="0"
              showClean={false}
              onPairChange={handlePairChange}
              search
              allPair
            />
          </Flex>

          {pair === "ALL PAIR" ? (
            <Typography sx={{ fontSize: "12px" }}>Fetching multiple limit orders may take some time.</Typography>
          ) : null}
        </Flex>
      </Box>

      {loading ? (
        <Box sx={{ padding: "8px" }}>
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
          {userLimitOrders.map((limitOrder) => (
            <LimitOrder
              key={limitOrder[0].userPositionId.toString()}
              order={limitOrder[0]}
              poolId={limitOrder[1]}
              onCancelSuccess={handleCancelSuccess}
            />
          ))}
        </Flex>
      )}
    </>
  );
}
