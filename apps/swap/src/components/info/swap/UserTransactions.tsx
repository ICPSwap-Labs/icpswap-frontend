import { useSwapTransactions } from "@icpswap/hooks";
import type { Null } from "@icpswap/types";
import type { ReactNode } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

import { type StyleProps, Transactions } from "./Transactions";

export interface UserTransactionsProps {
  poolId: string | Null;
  styleProps?: StyleProps;
  refresh?: number;
  CustomNoData?: ReactNode;
}

export function UserTransactions({ poolId, styleProps, CustomNoData }: UserTransactionsProps) {
  const principal = useAccountPrincipalString();

  const { data: transactionsResult, isLoading: loading } = useSwapTransactions({
    principal,
    poolId,
    page: 1,
    limit: 300,
  });

  return (
    <Transactions
      transactions={transactionsResult?.content}
      loading={loading}
      hasFilter
      styleProps={styleProps}
      CustomNoData={CustomNoData}
    />
  );
}
