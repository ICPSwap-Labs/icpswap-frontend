import { useState, useCallback, memo, useEffect } from "react";
import { Button, CircularProgress } from "components/Mui";
import { Flex, Image } from "@icpswap/ui";
import { useDownloadSwapTransactions } from "hooks/info/swap/index";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";

interface SwapTransactionsProps {
  pair: string;
  principal: string | Null;
}

export function __SwapTransactions({ pair, principal }: SwapTransactionsProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const { download, abort } = useDownloadSwapTransactions();

  const handleDownload = useCallback(async () => {
    setLoading(true);
    await download({ pair, principal });
    setLoading(false);
  }, [download, principal, pair]);

  // If principal and pair is changed, abort the elder calls
  useEffect(() => {
    abort(true);
  }, [principal, pair]);

  return (
    <Button variant="contained" onClick={handleDownload} disabled={loading}>
      <Flex gap="0 4px">
        {loading ? (
          <CircularProgress color="inherit" size={16} />
        ) : (
          <Image src="/images/download.svg" sx={{ width: "16px", height: "16px", borderRadius: "0px" }} />
        )}
        {t("common.export")}
      </Flex>
    </Button>
  );
}

export const SwapTransactionsDownload = memo(__SwapTransactions);
