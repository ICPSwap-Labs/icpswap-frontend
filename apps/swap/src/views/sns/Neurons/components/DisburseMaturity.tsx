import { Button } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { disburseNeuronMaturity } from "@icpswap/hooks";
import { ConfirmModal } from "@icpswap/ui";
import { Neuron } from "@icpswap/types";
import { useMemo, useState } from "react";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";

export interface DisburseMaturityProps {
  neuron: Neuron;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  onDisburseMaturitySuccess?: () => void;
  disabled?: boolean;
}

export function DisburseMaturity({
  neuron,
  governance_id,
  neuron_id,
  onDisburseMaturitySuccess,
  disabled,
}: DisburseMaturityProps) {
  const [disburseOpen, setDisburseOpen] = useState(false);

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const { available_maturity } = useMemo(() => {
    return {
      auto_stake_maturity: neuron.auto_stake_maturity[0],
      staked_maturity: neuron.staked_maturity_e8s_equivalent[0],
      available_maturity: neuron.maturity_e8s_equivalent,
    };
  }, [neuron]);

  const handleDisburseMaturity = async () => {
    if (loading || !governance_id || !neuron_id) return;

    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await disburseNeuronMaturity(governance_id, neuron_id);

    const result = data ? data.command[0] : undefined;
    const neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!neuron_error) {
        openTip(t`Disburse maturity successfully`, TIP_SUCCESS);
        setDisburseOpen(false);
        if (onDisburseMaturitySuccess) onDisburseMaturitySuccess();
      } else {
        const message = neuron_error.error_message;
        openTip(message === "" ? t`Failed to disburse maturity` : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to disburse maturity`, TIP_ERROR);
    }

    setLoading(false);
    closeFullscreenLoading();
  };

  return (
    <>
      <Button
        onClick={() => setDisburseOpen(true)}
        variant="contained"
        size="small"
        disabled={available_maturity.toString() === "0" || disabled}
      >
        <Trans>Disburse</Trans>
      </Button>

      <ConfirmModal
        open={disburseOpen}
        onClose={() => setDisburseOpen(false)}
        title={t`Disburse Maturity`}
        onConfirm={handleDisburseMaturity}
        text={t`Are you sure you want to disburse this neuron?`}
      />
    </>
  );
}
