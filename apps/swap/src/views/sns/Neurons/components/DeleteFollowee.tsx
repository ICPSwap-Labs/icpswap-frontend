import { useState } from "react";
import { toHexString } from "@icpswap/utils";
import { setNeuronFollows } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { t } from "@lingui/macro";
import { Neuron } from "@icpswap/types";
import { X } from "react-feather";
import { ConfirmModal } from "@icpswap/ui";

export interface DeleteFolloweeProps {
  onDeleteSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_id: bigint;
  follow_id: Uint8Array | number[];
}

export function DeleteFollowee({
  func_id,
  onDeleteSuccess,
  neuron,
  governance_id,
  neuron_id,
  follow_id,
}: DeleteFolloweeProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteFollowee = async () => {
    if (loading || !governance_id || !neuron || !neuron_id) return;

    setOpen(false);
    setLoading(true);
    openFullscreenLoading();

    const follow_result = neuron.followees.find(([id]) => id === func_id);

    if (!follow_result) {
      openTip(t`Some unknown error happened`, TIP_ERROR);
      setLoading(false);
      closeFullscreenLoading();
      return;
    }

    const [id, { followees }] = follow_result;

    const new_followees = followees.filter((followee) => toHexString(followee.id) !== toHexString(follow_id));

    const { data, message, status } = await setNeuronFollows(governance_id, neuron_id, id, new_followees);

    const result = data ? data.command[0] : undefined;
    const split_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!split_neuron_error) {
        openTip(t`Delete followees successfully`, TIP_SUCCESS);
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        const message = split_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to delete followees`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to delete followees`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <>
      <X style={{ cursor: "pointer" }} size="18px" onClick={() => setOpen(true)} />

      <ConfirmModal
        open={open}
        onConfirm={handleDeleteFollowee}
        onClose={() => setOpen(false)}
        title={t`Delete Followee`}
        text={t`Are you sure to delete this followee?`}
      />
    </>
  );
}
