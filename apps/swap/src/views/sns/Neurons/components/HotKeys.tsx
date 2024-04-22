import { Trans, t } from "@lingui/macro";
import { Modal } from "@icpswap/ui";
import { Button, Box, Typography, FilledTextField } from "components/index";
import { useMemo, useState } from "react";
import { isValidPrincipal, shorten } from "@icpswap/utils";
import { neuronAddPermissions, neuronRemovePermissions } from "@icpswap/hooks";
import { SnsNeuronPermissions } from "@icpswap/constants";
import type { Neuron, NeuronPermission } from "@icpswap/types";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { Principal } from "@dfinity/principal";
import { useAccountPrincipal } from "store/auth/hooks";
import { X } from "react-feather";

export interface HotKeysProps {
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  onAddSuccess?: () => void;
  onRemoveSuccess?: () => void;
  neuron: Neuron;
}

export function HotKeys({ neuron, governance_id, neuron_id, onAddSuccess, onRemoveSuccess }: HotKeysProps) {
  const principal = useAccountPrincipal();
  const [open, setOpen] = useState(false);
  const [hotKey, setHotKey] = useState<undefined | string>(undefined);

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();

  const handleHotKeyChange = (principal: string) => {
    setHotKey(principal);
  };

  const handleClose = () => {
    setHotKey(undefined);
    setOpen(false);
  };

  const handleAddHotKey = async () => {
    if (governance_id === undefined || hotKey === undefined || !neuron_id) return;

    openFullscreenLoading();

    const { status, message, data } = await neuronAddPermissions(
      governance_id,
      neuron_id,
      Principal.fromText(hotKey),
      SnsNeuronPermissions,
    );

    const result = data ? data.command[0] : undefined;
    const manage_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!manage_neuron_error) {
        openTip(t`Add hotkeys successfully`, TIP_SUCCESS);
        handleClose();
        if (onAddSuccess) onAddSuccess();
      } else {
        const message = manage_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to add hotkeys`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to add hotkeys`, TIP_ERROR);
    }

    closeFullscreenLoading();
  };

  const handleRemoveHotKey = async (permission: NeuronPermission) => {
    if (governance_id === undefined || !neuron_id) return;

    const { principal, permission_type } = permission;
    const _principal = principal[0];

    if (!_principal) return;

    openFullscreenLoading();

    const { status, message, data } = await neuronRemovePermissions(governance_id, neuron_id, _principal, [
      ...permission_type,
    ]);

    const result = data ? data.command[0] : undefined;
    const manage_neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!manage_neuron_error) {
        openTip(t`Remove hotkeys successfully`, TIP_SUCCESS);
        if (onRemoveSuccess) onRemoveSuccess();
      } else {
        const message = manage_neuron_error.error_message;
        openTip(message !== "" ? message : t`Failed to remove hotkeys`, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to remove hotkeys`, TIP_ERROR);
    }

    closeFullscreenLoading();
  };

  const permissions = useMemo(() => {
    return neuron.permissions.filter((permission) => {
      return permission.principal.toString() !== principal?.toString();
    });
  }, [neuron, principal]);

  let error: string | undefined;
  if (!hotKey) error = t`Enter the hotkey`;
  if (hotKey && !isValidPrincipal(hotKey)) error = t`Invalid principal ID`;

  return (
    <Box>
      <Typography color="text.primary" fontSize="16px" fontWeight={600}>
        <Trans>Hotkeys</Trans>
      </Typography>

      <Typography fontSize="12px" sx={{ margin: "10px 0 0 0" }}>
        <Trans>
          To vote with this neuron from another dapp, add the principal id you have in the other dapp as a hotkey.
        </Trans>
      </Typography>

      <Box sx={{ margin: "10px 0 0 0", display: "flex", flexDirection: "column", gap: "6px 0" }}>
        {permissions.map((permission) => (
          <Box
            key={permission.principal.toString()}
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 500,
              }}
            >
              {shorten(permission.principal.toString(), 12)}
            </Typography>

            <X
              style={{ cursor: "pointer", color: "#fff" }}
              size="18px"
              onClick={() => handleRemoveHotKey(permission)}
            />
          </Box>
        ))}
      </Box>

      <Button sx={{ margin: "10px 0 0 0" }} onClick={() => setOpen(true)} variant="contained" size="small">
        <Trans>Add Hotkey</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Add Hotkey`}>
        <FilledTextField placeholder={t`Enter hotkey principal ID`} onChange={handleHotKeyChange} />
        <Box sx={{ margin: "20px 0 0 0" }}>
          <Button fullWidth variant="contained" size="large" disabled={error !== undefined} onClick={handleAddHotKey}>
            {error === undefined ? <Trans>Confirm</Trans> : error}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
