import { pageArgsFormat } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";
import { Null } from "@icpswap/types";
import { usePositionTransactions } from "@icpswap/hooks";

import { PositionTransactionsTableUI } from "./PositionTransactionsTableUI";

export interface PositionTransactionsTableProps {
  wrapperClassName?: string;
  principal?: string;
  poolId: string | Null;
  empty?: string;
}

export function PositionTransactionsTable({
  poolId,
  principal,
  wrapperClassName,
  empty,
}: PositionTransactionsTableProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const poolIds = useMemo(() => (poolId ? [poolId] : []), [poolId]);

  const { loading, result } = usePositionTransactions(poolIds, principal, offset, pagination.pageSize);

  const transactions = result?.content;
  const totalElements = result?.totalElements;

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  // Reset pagination when pool or principal change
  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });
  }, [poolId, principal]);

  return (
    <PositionTransactionsTableUI
      wrapperClassName={wrapperClassName}
      loading={loading}
      transactions={transactions}
      onPaginationChange={handlePageChange}
      page={pagination.pageNum}
      totalElements={totalElements}
      empty={empty}
    />
  );
}
