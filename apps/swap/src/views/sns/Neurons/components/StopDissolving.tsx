import { useState } from "react";
import { Button } from "@mui/material";
import { stopDissolvingNeuron } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { ConfirmModal } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface StopDissolvingProps {
  onStopSuccess?: () => void;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function StopDissolving({ onStopSuccess, governance_id, neuron_id, disabled }: StopDissolvingProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await stopDissolvingNeuron(governance_id, neuron_id);

    const result = data ? data.command[0] : undefined;
    const stop_dissolving_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!stop_dissolving_neuron_error) {
        openTip(t`Stop dissolving successfully`, TIP_SUCCESS);
        if (onStopSuccess) onStopSuccess();
      } else {
        const message = stop_dissolving_neuron_error.error_message;
        openTip(message === "" ? t`Failed to stop dissolving` : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to stop dissolving`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={disabled}>
        {t("nns.stop.dissolving")}
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title={t("nns.stop.dissolving")}
        onConfirm={handleConfirm}
        text={t`Are you sure you want to stop the dissolve process?`}
      />
    </>
  );
}
