import { usePositions } from "hooks/liquidity/usePositions";
import { pageArgsFormat } from "@icpswap/utils";
import { useEffect, useState } from "react";
import { PaginationType } from "@icpswap/ui";
import { Null } from "@icpswap/types";

import { PositionTableUI } from "./PositionTableUI";

export interface PositionTableProps {
  wrapperClassName?: string;
  principal?: string;
  poolId: string | Null;
}

export function PositionTable({ poolId, principal, wrapperClassName }: PositionTableProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(poolId, principal, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const handlePageChange = (pagination: PaginationType) => {
    setPagination(pagination);
  };

  // Reset pagination when pool or principal change
  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });
  }, [poolId, principal]);

  return (
    <PositionTableUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      positions={positions}
      onPaginationChange={handlePageChange}
      pagination={pagination}
      totalElements={totalElements}
    />
  );
}
