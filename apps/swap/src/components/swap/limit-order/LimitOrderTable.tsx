import { Null } from "@icpswap/types";
import { useUserLimitOrders } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useRefreshTriggerManager } from "hooks/index";

import { LimitOrdersTableUI } from "./LimitOrderTableUI";

export interface LimitOrdersTableProps {
  wrapperClassName?: string;
  poolId: string | Null;
}

export function LimitOrdersTable({ poolId, wrapperClassName }: LimitOrdersTableProps) {
  const principal = useAccountPrincipalString();

  const [refreshTrigger, setLimitOrdersRefreshTrigger] = useRefreshTriggerManager("CANCEL_LIMIT_ORDER");

  const { result: userLimitOrders, loading } = useUserLimitOrders(poolId, principal, refreshTrigger);

  return (
    <LimitOrdersTableUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      limitOrders={userLimitOrders}
      setLimitOrdersRefreshTrigger={setLimitOrdersRefreshTrigger}
    />
  );
}
