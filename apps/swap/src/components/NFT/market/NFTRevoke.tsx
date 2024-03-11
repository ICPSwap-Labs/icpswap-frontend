import { Button } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { cancel } from "hooks/nft/trade";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity";
import { ResultStatus, Identity as TypeIdentity } from "types/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { getLocaleMessage } from "locales/services";
import type { NFTTokenMetadata } from "@icpswap/types";

export default function NFTInfo({
  metadata,
  onRevokeSuccess,
}: {
  metadata: NFTTokenMetadata;
  onRevokeSuccess?: () => void;
}) {
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();

  const handleCancel = async (identity: TypeIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (loading) return;

    const { status, message } = await cancel(identity, metadata.cId, metadata.tokenId);

    if (status === ResultStatus.ERROR) {
      openErrorTip(getLocaleMessage(message));
    } else {
      openSuccessTip(t`Cancelled Successfully`);
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
          <Trans>Cancel Listing</Trans>
        </Button>
      )}
    </Identity>
  );
}
