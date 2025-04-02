import { Null } from "@icpswap/types";
import { useUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useRefreshTriggerManager } from "hooks/index";
import { USER_LIMIT_ORDERS_KEY } from "constants/limit";

import { PendingTableProUI } from "./PendingTableProUI";

export interface LimitOrdersTableProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function PendingTablePro({ poolId, wrapperClassName }: LimitOrdersTableProps) {
  const principal = useAccountPrincipalString();

  const [refreshTrigger, setLimitOrdersRefreshTrigger] = useRefreshTriggerManager(USER_LIMIT_ORDERS_KEY);

  const { result: userLimitOrders, loading } = useUserLimitOrders(poolId, principal, refreshTrigger);

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
