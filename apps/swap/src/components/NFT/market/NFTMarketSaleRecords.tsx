import { useState, useCallback } from "react";
import { useTradeTxList } from "hooks/nft/trade";
import { pageArgsFormat } from "@icpswap/utils";
import { TxRecord } from "types/nft";
import NFTSaleRecords from "./NFTSaleRecords";

export default function NFTMarketSaleRecords({ canisterId }: { canisterId?: string }) {
  const [pagination, setPagination] = useState({ pageNum: 1, pageSize: 10 });
  const [offset] = pageArgsFormat(pagination.pageNum, pagination.pageSize);

  const { loading, result } = useTradeTxList(canisterId, null, null, offset, pagination.pageSize, "time", true);
  const { totalElements, content } = result ?? { totalElements: 0, content: [] as TxRecord[] };

  const handlePageChange = useCallback(
    (pagination) => {
      setPagination(pagination);
    },
    [setPagination],
  );

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
