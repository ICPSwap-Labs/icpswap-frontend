import { useMemo, useState } from "react";
import { Button, Typography, Box, CircularProgress } from "components/Mui";
import { toHexString, hexToBytes } from "@icpswap/utils";
import { setNeuronFollows } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Modal, FilledTextField } from "components/index";
import { Neuron } from "@icpswap/types";
import { useTranslation } from "react-i18next";

export interface AddFolloweeModalProps {
  open: boolean;
  onFollowSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_ids: bigint[];
  onClose?: () => void;
}

export function AddFolloweeModal({
  func_ids,
  onFollowSuccess,
  neuron,
  governance_id,
  neuron_id,
  open,
  onClose,
}: AddFolloweeModalProps) {
  const { t } = useTranslation();
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [neuronId, setNeuronId] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    if (loading || !neuronId || !governance_id || !neuron_id || !neuron) return;

    setLoading(true);
    openFullscreenLoading();

    await Promise.all(
      func_ids.map(async (func_id) => {
        let follow_result = neuron.followees.find(([id]) => id === func_id);

        if (!follow_result) {
          follow_result = [func_id, { followees: [] }];
        }

        const [id, { followees }] = follow_result;

        const isExist = !!followees.find((e) => toHexString(e.id) === neuronId);

        if (!isExist) {
          const new_followees = followees.concat([
            {
              id: hexToBytes(neuronId),
            },
          ]);

          const { data, message, status } = await setNeuronFollows(governance_id, neuron_id, id, new_followees);

          const result = data ? data.command[0] : undefined;
          const split_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

          if (status === "ok") {
            if (!split_neuron_error) {
              openTip(t`Set followees successfully`, TIP_SUCCESS);
              if (onClose) onClose();
              if (onFollowSuccess) onFollowSuccess();
              setNeuronId("");
            } else {
              const message = split_neuron_error.error_message;
              openTip(message !== "" ? message : t`Failed to set followees`, TIP_ERROR);
            }
          } else {
            openTip(message ?? t`Failed to set followees`, TIP_ERROR);
          }
        }
      }),
    );

    setLoading(false);
    closeFullscreenLoading();
  };

  const available_neuron_id = useMemo(() => {
    let available = true;

    if (!neuronId) return false;

    try {
      hexToBytes(neuronId);
    } catch (err) {
      available = false;
    }

    return available;
  }, [neuronId]);

  let error: string | undefined;
  if (available_neuron_id === false) error = t("nns.error.neuron.invalid");
  if (neuronId === undefined) error = t("nns.error.neuron.input");

  return (
    <Modal open={open} onClose={onClose} title={t("nns.followee.add")}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
        <Box>
          <Typography sx={{ margin: "0 0 10px 0" }}>{t("nns.followee.neuron.id")}</Typography>

          <FilledTextField
            placeholder={t`Neuron Id`}
            value={neuronId}
            onChange={(value: string) => setNeuronId(value)}
            fullWidth
            autoComplete="off"
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || !!error}
          onClick={handleSubmit}
          startIcon={loading ? <CircularProgress size={26} color="inherit" /> : null}
        >
          {error || t("common.confirm")}
        </Button>
      </Box>
    </Modal>
  );
}
