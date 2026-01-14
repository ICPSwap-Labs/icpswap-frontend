import { usePositions } from "hooks/liquidity/usePositions";
import { isUndefinedOrNull, pageArgsFormat } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";
import { Null } from "@icpswap/types";
import { useLimitOrders } from "@icpswap/hooks";
import { type PaginationPadding } from "@icpswap/ui";

import { PositionTableUI } from "./PositionTableUI";

export interface PositionTableProps {
  wrapperClassName?: string;
  principal?: string;
  poolId: string | Null;
  padding?: string;
  empty?: string;
  paginationPadding?: PaginationPadding;
}

export function PositionTable({
  poolId,
  principal,
  wrapperClassName,
  padding,
  paginationPadding,
  empty,
}: PositionTableProps) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = usePositions(poolId, principal, offset, pagination.pageSize);

  const positions = result?.content;
  const totalElements = result?.totalElements;

  const handlePageChange = (page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  };

  // Reset pagination when pool or principal change
  useEffect(() => {
    setPagination({ pageNum: 1, pageSize: pagination.pageSize });
  }, [poolId, principal]);

  const { result: allLimitOrdersResult } = useLimitOrders(poolId);
  const allLimitOrders = useMemo(() => {
    if (isUndefinedOrNull(allLimitOrdersResult)) return null;

    return allLimitOrdersResult.lowerLimitOrders
      .concat(allLimitOrdersResult.upperLimitOrders)
      .map((element) => element[1].userPositionId);
  }, [allLimitOrdersResult]);

  return (
    <PositionTableUI
      poolId={poolId}
      wrapperClassName={wrapperClassName}
      loading={loading}
      positions={positions}
      onPaginationChange={handlePageChange}
      page={pagination.pageNum}
      totalElements={totalElements}
      allLimitOrders={allLimitOrders}
      padding={padding}
      empty={empty}
      paginationPadding={paginationPadding}
    />
  );
}
