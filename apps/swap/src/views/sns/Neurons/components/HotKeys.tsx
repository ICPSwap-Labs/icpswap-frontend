import { Trans, t } from "@lingui/macro";
import { Modal } from "@icpswap/ui";
import { Button, Box, Typography, Collapse, Copy, FilledTextField } from "components/index";
import { Neuron, NervousSystemFunction } from "@icpswap/types";
import { useMemo, useState } from "react";
import { isValidPrincipal, shorten, toHexString } from "@icpswap/utils";
import { ChevronDown } from "react-feather";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";

import { AddFollowee } from "./AddFollowee";
import { DeleteFollowee } from "./DeleteFollowee";

interface HotKeyProps {
  func: NervousSystemFunction;
  neuron_id: Uint8Array | number[] | undefined;
  governance_id: string | undefined;
  neuron: Neuron | undefined;
  refreshNeuron: () => void;
}

function HotKey({ neuron, func, neuron_id, governance_id, refreshNeuron }: HotKeyProps) {
  const [open, setOpen] = useState(false);

  const following = useMemo(() => {
    if (!neuron) return undefined;

    return neuron.followees
      .filter(([id]) => id === func.id)
      .map(([, followees]) => followees.followees)
      .flat();
  }, [neuron, func]);

  const handleRefreshNeuron = () => {
    refreshNeuron();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: "text.primary",
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography color="text.primary">{func.name}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0 5px",
          }}
        >
          <Typography color="text.primary">{following?.length ?? "0"}</Typography>
          <ChevronDown style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "all 300ms" }} />
        </Box>
      </Box>

      <Collapse appear={false} in={open}>
        <Box sx={{ margin: "10px 0 0 0" }}>
          <Box>
            <Typography sx={{ fontSize: "12px" }}>{func.description}</Typography>
          </Box>

          {following && following.length > 0 ? (
            <Box sx={{ margin: "20px 0 0 0" }}>
              <Typography>
                <Trans>Current Following</Trans>
              </Typography>

              <Box sx={{ margin: "10px 0 0 0" }}>
                {following?.map((follow) => (
                  <Box
                    key={toHexString(follow.id)}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                      <Typography>{shorten(toHexString(follow.id), 8)}</Typography>
                      <Copy content={toHexString(follow.id)}>
                        <CopyIcon />
                      </Copy>
                    </Box>

                    <DeleteFollowee
                      neuron_id={neuron_id}
                      governance_id={governance_id}
                      neuron={neuron}
                      func_id={func.id}
                      follow_id={follow.id}
                      onDeleteSuccess={handleRefreshNeuron}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}

          <Box sx={{ display: "flex", justifyContent: "center", margin: "30px 0 0 0" }}>
            <AddFollowee
              neuron={neuron}
              func_id={func.id}
              neuron_id={neuron_id}
              governance_id={governance_id}
              onFollowSuccess={handleRefreshNeuron}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export interface HotKeysProps {
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
}

export function HotKeys({ governance_id, neuron_id }: HotKeysProps) {
  const [open, setOpen] = useState(false);
  const [hotKey, setHotKey] = useState<undefined | string>(undefined);

  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleHotKeyChange = (principal: string) => {
    setHotKey(principal);
  };

  const handleAddHotKey = async () => {
    setLoading(true);
    openFullscreenLoading();

    setOpen(true);
    setLoading(false);
    closeFullscreenLoading();
  };

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
