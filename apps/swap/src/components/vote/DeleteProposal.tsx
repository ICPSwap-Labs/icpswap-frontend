import { Typography, Grid } from "components/Mui";
import { Modal } from "components/index";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Identity as CallIdentity } from "types/global";
import { useTips, MessageTypes } from "hooks/useTips";
import { ResultStatus } from "@icpswap/types";
import { deleteVotingProposal } from "@icpswap/hooks";
import { useTranslation } from "react-i18next";

export default function DeleteProposal({
  open,
  onClose,
  proposalId,
  canisterId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  canisterId: string;
  proposalId: string;
}) {
  const { t } = useTranslation();
  const [openTip, closeTip] = useTips();

  const handleDeleteProposal = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (!identity || loading) return;

    const tipKey = openTip(t`Delete proposal`, MessageTypes.loading);

    onClose();

    const { status, message } = await deleteVotingProposal(identity, canisterId, proposalId);

    if (status === ResultStatus.OK) {
      openTip(t`Delete successfully`, MessageTypes.success);
      if (onSuccess) onSuccess();
    } else {
      openTip(message ?? t`Failed to delete proposal`, ResultStatus.ERROR);
    }

    closeLoading();
    closeTip(tipKey);
  };

  return (
    <Identity onSubmit={handleDeleteProposal}>
      {({ submit, loading }: CallbackProps) => (
        <Modal
          open={open}
          onClose={onClose}
          title={t("vote.delete.proposal")}
          onConfirm={submit}
          onCancel={onClose}
          showCancel
          showConfirm
          confirmDisabled={loading}
        >
          <Grid container alignItems="center" justifyContent="center">
            <Typography
              fontSize="14px"
              sx={{ maxWidth: "420px", lineHeight: "28px" }}
              color="text.primary"
              align="center"
            >
              {t`Are you sure want to delete this proposal!`}
            </Typography>
          </Grid>
        </Modal>
      )}
    </Identity>
  );
}
