import { useState, useCallback, memo, useEffect, useMemo } from "react";
import { Button, CircularProgress } from "components/Mui";
import { Flex, Tooltip } from "@icpswap/ui";
import { useDownloadSwapTransactions } from "hooks/info/swap/index";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";
import { isUndefinedOrNull, mockALinkAndOpen } from "@icpswap/utils";
import { getDownloadSwapTransactionsLink } from "@icpswap/hooks";
import { Download } from "react-feather";

interface SwapTransactionsProps {
  pair: string;
  principal: string | Null;
  startTime: number | undefined;
  endTime: number | undefined;
}

export function __SwapTransactions({ pair, principal, startTime, endTime }: SwapTransactionsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { download, abort } = useDownloadSwapTransactions();

  const handleDownload = useCallback(async () => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(startTime) || isUndefinedOrNull(endTime)) return;
    setLoading(true);

    const link = getDownloadSwapTransactionsLink({
      poolId: pair,
      principal,
      begin: startTime,
      end: endTime,
    });

    mockALinkAndOpen(link, "download-swap-transactions");

    setLoading(false);
  }, [download, principal, pair, startTime, endTime]);

  // If principal and pair is changed, abort the elder calls
  useEffect(() => {
    abort(true);
  }, [principal, pair]);

  const disabled = useMemo(() => {
    if (isUndefinedOrNull(principal) || isUndefinedOrNull(startTime) || isUndefinedOrNull(endTime)) return true;
    if (loading) return true;
    return false;
  }, [principal, startTime, endTime, loading]);

  return (
    <Flex gap="0 8px">
      <Button variant="contained" onClick={handleDownload} disabled={disabled}>
        <Flex gap="0 4px">
          {loading ? <CircularProgress color="inherit" size={16} /> : <Download size={18} />}
          {t("common.export.to.csv")}
        </Flex>
      </Button>
      <Tooltip tips="Please enter a Principal ID to export swap history" />
    </Flex>
  );
}

export const SwapTransactionsDownload = memo(__SwapTransactions);
