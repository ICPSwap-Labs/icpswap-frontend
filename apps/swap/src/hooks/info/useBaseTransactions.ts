import { useBaseTransactions as _useBaseTransactions, useBaseStorage } from "@icpswap/hooks";

export function useBaseTransactions(offset: number, limit: number) {
  const { result: baseStorageId } = useBaseStorage();
  return _useBaseTransactions(baseStorageId, offset, limit);
}
