import { useState } from "react";
import { toHexString } from "@icpswap/utils";
import { setNeuronFollows } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { t } from "@lingui/macro";
import { Neuron } from "@icpswap/types";
import { ConfirmModal } from "@icpswap/ui";

export interface DeleteFolloweeProps {
  open: boolean;
  onDeleteSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_ids: bigint[];
  follow_ids: (Uint8Array | number[])[] | "all";
  onClose: () => void;
}

export function DeleteFolloweeModal({
  func_ids,
  onDeleteSuccess,
  neuron,
  governance_id,
  neuron_id,
  follow_ids,
  open,
  onClose,
}: DeleteFolloweeProps) {
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteFollowee = async () => {
    if (loading || !governance_id || !neuron || !neuron_id) return;

    onClose();
    setLoading(true);
    openFullscreenLoading();

    await Promise.all(
      func_ids.map(async (func_id) => {
        const follow_result = neuron.followees.find(([id]) => id === func_id);

        if (follow_result) {
          const [id, { followees }] = follow_result;
          let all_delete_followee_ids: string[] = [];

          if (follow_ids === "all") {
            all_delete_followee_ids = followees.map((followee) => toHexString(followee.id));
          } else {
            all_delete_followee_ids = follow_ids.map((id) => toHexString(id));
          }

          const new_followees = followees.filter(
            (followee) => !all_delete_followee_ids.includes(toHexString(followee.id)),
          );

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
        }
      }),
    );

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <ConfirmModal
      open={open}
      onConfirm={handleDeleteFollowee}
      onClose={onClose}
      title={t`Delete Followee`}
      text={t`Are you sure to delete this followee?`}
    />
  );
}
