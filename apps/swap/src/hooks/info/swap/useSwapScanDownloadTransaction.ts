import { useMemo } from "react";
import { useDownloadSwapTransactions } from "hooks/info/swap/useDownloadSwapTransactions";
import { useDownloadUserTransactions } from "hooks/info/swap/useDownloadSwapUserTransactions";
import { Null } from "@icpswap/types";

export interface UseSwapScanTransactionDownloadProps {
  pair: string | Null;
  principal: string | Null;
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
