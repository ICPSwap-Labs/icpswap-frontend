import { Button } from "components/Mui";
import { cancel } from "hooks/nft/trade";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { ResultStatus, Identity as TypeIdentity } from "types/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import type { NFTTokenMetadata, Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { isUndefinedOrNull } from "@icpswap/utils";

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

  const handleCancel = async (identity: TypeIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading || isUndefinedOrNull(metadata)) return;

    const { status, message } = await cancel(identity, metadata.cId, metadata.tokenId);

    if (status === ResultStatus.ERROR) {
      openErrorTip(getLocaleMessage(message));
    } else {
      openSuccessTip(t("common.cancelled.success"));
      if (onRevokeSuccess) onRevokeSuccess();
    }

    closeLoading();
  };

  return (
    <Identity onSubmit={handleCancel} fullScreenLoading>
      {({ submit, loading }: CallbackProps) => (
        <Button
          sx={{
            borderRadius: "4px",
          }}
          size="large"
          variant="contained"
          onClick={submit}
          disabled={loading}
        >
          {t("nft.cancel.listings")}
        </Button>
      )}
    </Identity>
  );
}
