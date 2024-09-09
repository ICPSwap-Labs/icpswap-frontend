import { useState } from "react";
import { Button } from "@mui/material";
import { disburseNeuron } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { ConfirmModal } from "@icpswap/ui";

export interface DisburseProps {
  onDisburseSuccess?: () => void;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function Disburse({ onDisburseSuccess, governance_id, neuron_id, disabled }: DisburseProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();
    setOpen(false);

    const { data, message, status } = await disburseNeuron(governance_id, neuron_id);

    const result = data ? data.command[0] : undefined;
    const stop_dissolving_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!stop_dissolving_neuron_error) {
        openTip(t`Disburse successfully`, TIP_SUCCESS);
        if (onDisburseSuccess) onDisburseSuccess();
      } else {
        const message = stop_dissolving_neuron_error.error_message;
        openTip(message === "" ? t`Failed to disburse` : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to disburse`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={disabled}>
        <Trans>Disburse</Trans>
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title={t`Disburse`}
        onConfirm={handleConfirm}
        text={t`Are you sure you want to disburse this neuron?`}
      />
    </>
  );
}
