import { useMemo } from "react";
import { useDownloadSwapTransactions } from "hooks/info/useDownloadSwapTransactions";
import { useDownloadUserTransactions } from "hooks/info/useDownloadSwapUserTransactions";

export interface UseSwapScanTransactionDownloadProps {
  pair: string | undefined;
  principal: string | undefined;
}

export function useSwapScanTransactionDownload({ pair, principal }: UseSwapScanTransactionDownloadProps) {
  const { download, loading } = useDownloadSwapTransactions({ pair });
  const { download: downloadUserTransactions, loading: userLoading } = useDownloadUserTransactions({ principal, pair });

  return useMemo(
    () => ({
      loading: principal ? userLoading : loading,
      download: principal ? downloadUserTransactions : download,
    }),
    [loading, principal, download, downloadUserTransactions, userLoading],
  );
}
