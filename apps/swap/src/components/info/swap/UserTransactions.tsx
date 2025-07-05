import { useSwapTransactions } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { Null } from "@icpswap/types";
import { ReactNode } from "react";

import { Transactions, StyleProps } from "./Transactions";

export interface UserTransactionsProps {
  poolId: string | Null;
  styleProps?: StyleProps;
  refresh?: number;
  CustomNoData?: ReactNode;
}

export function UserTransactions({ poolId, styleProps, CustomNoData }: UserTransactionsProps) {
  const principal = useAccountPrincipalString();

  const { result: transactionsResult, loading } = useSwapTransactions({ principal, poolId, page: 1, limit: 300 });

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
