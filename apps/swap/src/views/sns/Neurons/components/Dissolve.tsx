import { useState } from "react";
import { Button } from "components/Mui";
import { dissolveNeuron } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { ConfirmModal } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface DissolveProps {
  onDissolveSuccess?: () => void;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function Dissolve({ onDissolveSuccess, governance_id, neuron_id, disabled }: DissolveProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await dissolveNeuron(governance_id, neuron_id);

    const result = data ? data.command[0] : undefined;
    const stop_dissolving_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!stop_dissolving_neuron_error) {
        openTip(t`Dissolve successfully`, TIP_SUCCESS);
        if (onDissolveSuccess) onDissolveSuccess();
      } else {
        const message = stop_dissolving_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to dissolve`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to dissolve`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" size="small" disabled={disabled}>
        {t("common.dissolve")}
      </Button>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        title={t("common.dissolve")}
        onConfirm={handleConfirm}
        text={t`This will cause your neuron to lose its age bonus. Are you sure you wish to continue?`}
      />
    </>
  );
}
