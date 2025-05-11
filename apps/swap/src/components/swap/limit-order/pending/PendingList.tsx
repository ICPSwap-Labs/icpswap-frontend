import { useCallback } from "react";
import { Box, makeStyles } from "components/Mui";
import { Flex, LoadingRow } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { useRefreshTriggerManager } from "hooks/index";
import { useLimitOrders } from "hooks/swap/limit-order/useLimitOrders";
import { SWAP_LIMIT_REFRESH_KEY } from "constants/limit";

import { PendingHeader } from "./PendingHeader";
import { PendingRow } from "./PendingRow";
import { LimitTransactionsEmpty } from "../Empty";

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr) 80px",
    },
  };
});

export interface PendingListProps {
  pair: string | Null;
}

export function PendingList({ pair }: PendingListProps) {
  const classes = useStyles();
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager(SWAP_LIMIT_REFRESH_KEY);

  const { result: userLimitOrders, loading } = useLimitOrders({ val: pair, refreshTrigger });

  const handleCancelSuccess = useCallback(() => {
    setRefreshTrigger();
  }, [setRefreshTrigger]);

  return (
    <>
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
        <Flex fullWidth justify="center">
          <LimitTransactionsEmpty />
        </Flex>
      ) : (
        <Box sx={{ width: "100%", minWidth: "1058px" }}>
          <PendingHeader wrapperClasses={classes.wrapper} />
          <Flex vertical align="flex-start" fullWidth gap="8px 0">
            {userLimitOrders.map((limitOrder) => (
              <PendingRow
                key={limitOrder[0].userPositionId.toString()}
                wrapperClasses={classes.wrapper}
                order={limitOrder[0]}
                poolId={limitOrder[1]}
                onCancelSuccess={handleCancelSuccess}
              />
            ))}
          </Flex>
        </Box>
      )}
    </>
  );
}
