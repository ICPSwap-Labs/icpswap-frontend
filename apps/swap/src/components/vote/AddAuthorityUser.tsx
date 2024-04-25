import { useState } from "react";
import { Box } from "@mui/material";
import { Modal, FilledTextField } from "components/index";
import { Trans, t } from "@lingui/macro";
import { isValidPrincipal } from "@icpswap/utils";
import { addVotingAuthorityUsers } from "@icpswap/hooks";
import { ResultStatus } from "@icpswap/types";
import Identity, { CallbackProps, SubmitLoadingProps } from "components/Identity/index";
import { Identity as CallIdentity } from "types/global";
import { useTips, MessageTypes } from "hooks/useTips";
import { Principal } from "@dfinity/principal";

export interface AddAuthorityUserProps {
  canisterId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddAuthorityUser({ open, onClose, canisterId, onSuccess }: AddAuthorityUserProps) {
  const [user, setUser] = useState("");

  const [openTip, closeTip] = useTips();

  const handleChange = (value: string) => {
    setUser(value);
  };

  const handleAdd = async (identity: CallIdentity, { loading, closeLoading }: SubmitLoadingProps) => {
    if (!identity || loading) return;

    const tipKey = openTip(t`Add user ${user}`, MessageTypes.loading);

    onClose();

    const { status, message } = await addVotingAuthorityUsers(identity, canisterId, Principal.fromText(user));

    if (status === ResultStatus.OK) {
      openTip(t`Add successfully`, MessageTypes.success);
      if (onSuccess) onSuccess();
    } else {
      openTip(message ?? t`Failed to add user`, ResultStatus.ERROR);
    }

    closeLoading();
    closeTip(tipKey);
  };

  let error = "";
  if (user && !isValidPrincipal(user)) error = t`Invalid principal id`;
  if (!user) error = t`Enter the user's principal id`;

  return (
    <Identity onSubmit={handleAdd}>
      {({ submit, loading }: CallbackProps) => (
        <Modal
          open={open}
          onClose={onClose}
          title={t`Add User`}
          showCancel
          showConfirm
          onCancel={onClose}
          onConfirm={submit}
          confirmDisabled={!!error || loading}
          confirmText={error || <Trans>Confirm</Trans>}
        >
          <FilledTextField placeholder={t`Enter the user's principal id`} onChange={handleChange} />
          <Box sx={{ height: "40px" }} />
        </Modal>
      )}
    </Identity>
  );
}
