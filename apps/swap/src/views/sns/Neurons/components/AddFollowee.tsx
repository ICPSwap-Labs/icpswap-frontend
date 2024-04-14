import { useMemo, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { toHexString, hexToBytes } from "@icpswap/utils";
import { setNeuronFollows } from "@icpswap/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Trans, t } from "@lingui/macro";
import { Modal, FilledTextField } from "components/index";
import { Neuron } from "@icpswap/types";

export interface AddFolloweeProps {
  onFollowSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_id: bigint;
}

export function AddFollowee({ func_id, onFollowSuccess, neuron, governance_id, neuron_id }: AddFolloweeProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [neuronId, setNeuronId] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setOpen(false);
    setNeuronId("");
  };

  const handleSubmit = async () => {
    if (loading || !neuronId || !governance_id || !neuron_id || !neuron) return;

    setLoading(true);
    openFullscreenLoading();

    let follow_result = neuron.followees.find(([id]) => id === func_id);

    if (!follow_result) {
      follow_result = [func_id, { followees: [] }];
    }

    const [id, { followees }] = follow_result;

    const isExist = !!followees.find((e) => toHexString(e.id) === neuronId);

    if (isExist) {
      openTip(t`The followee is existed`, TIP_ERROR);
      setLoading(false);
      closeFullscreenLoading();
      return;
    }

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
        handleClose();
        if (onFollowSuccess) onFollowSuccess();
      } else {
        const message = split_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to set followees`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to set followees`, TIP_ERROR);
    }

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
  if (available_neuron_id === false) error = t`Invalid neuron id`;
  if (neuronId === undefined) error = t`Enter the neuron id`;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        <Trans>Add Followee</Trans>
      </Button>

      <Modal open={open} onClose={handleClose} title={t`Add Followee`}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <Box>
            <Typography sx={{ margin: "0 0 10px 0" }}>
              <Trans>Followee's Neuron Id</Trans>
            </Typography>

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
            {error || <Trans>Confirm</Trans>}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
