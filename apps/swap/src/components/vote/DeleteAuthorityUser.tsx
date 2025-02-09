import { Typography, Grid } from "components/Mui";
import { Modal } from "components/index";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Identity as CallIdentity } from "types/global";
import { useTips, MessageTypes } from "hooks/useTips";
import { Principal } from "@dfinity/principal";
import { deleteVotingAuthorityUsers } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import { useTranslation } from "react-i18next";

export default function DeleteAuthorityUser({
  open,
  onClose,
  canisterId,
  user,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  canisterId: string;
  user: string;
}) {
  const { t } = useTranslation();
  const [openTip, closeTip] = useTips();

  const handleDeleteUser = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (!identity || loading) return;

    const tipKey = openTip(t("vote.delete.user.loading", { user }), MessageTypes.loading);

    onClose();

    const { status, message } = await deleteVotingAuthorityUsers(identity, canisterId, Principal.fromText(user));

    if (status === ResultStatus.OK) {
      openTip(t`Delete successfully`, MessageTypes.success);
      if (onSuccess) onSuccess();
    } else {
      openTip(message ?? t`Failed to delete user`, ResultStatus.ERROR);
    }

    closeLoading();
    closeTip(tipKey);
  };

  return (
    <Identity onSubmit={handleDeleteUser}>
      {({ submit, loading }: CallbackProps) => (
        <Modal
          open={open}
          onClose={onClose}
          title={t("vote.delete.user")}
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
              {t("vote.confirm.delete.ser", { user })}
            </Typography>
          </Grid>
        </Modal>
      )}
    </Identity>
  );
}
