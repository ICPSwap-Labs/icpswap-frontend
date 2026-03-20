import { useUserLimitOrders } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import { USER_LIMIT_ORDERS_KEY } from "constants/limit";
import { useRefreshTriggerManager } from "hooks/index";
import { useAccountPrincipalString } from "store/auth/hooks";

import { PendingTableProUI } from "./PendingTableProUI";

export interface LimitOrdersTableProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function PendingTablePro({ poolId, wrapperClassName }: LimitOrdersTableProps) {
  const principal = useAccountPrincipalString();

  const [refreshTrigger, setLimitOrdersRefreshTrigger] = useRefreshTriggerManager(USER_LIMIT_ORDERS_KEY);

  const { data: userLimitOrders, isLoading: loading } = useUserLimitOrders(poolId, principal, refreshTrigger);

  return (
    <PendingTableProUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      limitOrders={userLimitOrders}
      setLimitOrdersRefreshTrigger={setLimitOrdersRefreshTrigger}
    />
  );
}
