import { pageArgsFormat } from "@icpswap/utils";
import { useTradeTxList } from "hooks/nft/trade";
import { useCallback, useState } from "react";
import type { TxRecord } from "types/nft";
import NFTSaleRecords from "./NFTSaleRecords";

export default function NFTMarketSaleRecords({ canisterId }: { canisterId?: string }) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { isLoading: loading, data: result } = useTradeTxList(
    canisterId,
    null,
    null,
    offset,
    pagination.pageSize,
    "time",
    true,
  );
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TxRecord[] };

  const handlePageChange = useCallback((page: number) => {
    setPagination({ pageNum: page, pageSize: 10 });
  }, []);

  return (
    <NFTSaleRecords
      pagination={pagination}
      handlePageChange={handlePageChange}
      content={content}
      loading={loading}
      totalElements={totalElements}
    />
  );
}
