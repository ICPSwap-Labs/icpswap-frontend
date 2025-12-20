import { Button } from "components/Mui";
import { cancel } from "hooks/nft/trade";
import { ResultStatus } from "types/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import type { NFTTokenMetadata, Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useLoadingCallData } from "@icpswap/hooks";
import { useCallback } from "react";

export default function NFTInfo({
  metadata,
  onRevokeSuccess,
}: {
  metadata: NFTTokenMetadata | Null;
  onRevokeSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const { loading, callback: handleCancel } = useLoadingCallData(
    useCallback(async () => {
      if (isUndefinedOrNull(metadata)) return;

      const { status, message } = await cancel(metadata.cId, metadata.tokenId);

      if (status === ResultStatus.ERROR) {
        openErrorTip(getLocaleMessage(message));
      } else {
        openSuccessTip(t("common.cancelled.success"));
        if (onRevokeSuccess) onRevokeSuccess();
      }
    }, [metadata]),
  );

  return (
    <Button
      sx={{
        borderRadius: "4px",
      }}
      size="large"
      variant="contained"
      onClick={handleCancel}
      disabled={loading}
    >
      {t("nft.cancel.listings")}
    </Button>
  );
}
