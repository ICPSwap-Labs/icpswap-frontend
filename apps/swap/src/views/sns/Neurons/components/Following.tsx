import { Trans, t } from "@lingui/macro";
import { useNeuronSystemFunctions, useNeuron } from "@icpswap/hooks";
import { Modal } from "@icpswap/ui";
import { Copy } from "components/index";
import { Button, Box, Typography, Collapse } from "components/Mui";
import { Neuron, NervousSystemFunction } from "@icpswap/types";
import { useMemo, useState } from "react";
import { shorten, toHexString } from "@icpswap/utils";
import { ChevronDown } from "react-feather";
import { ReactComponent as CopyIcon } from "assets/icons/Copy.svg";

import { AddFollowee } from "./AddFollowee";
import { DeleteFollowee } from "./DeleteFollowee";

interface FollowNeuronProps {
  func: NervousSystemFunction;
  neuron_id: Uint8Array | number[] | undefined;
  governance_id: string | undefined;
  neuron: Neuron | undefined;
  refreshNeuron: () => void;
}

function FollowNeuron({ neuron, func, neuron_id, governance_id, refreshNeuron }: FollowNeuronProps) {
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
            <Typography sx={{ fontSize: "12px" }} lineHeight="16px">
              {func.description}
            </Typography>
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

export interface FollowingProps {
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  disabled?: boolean;
}

export function Followings({ governance_id, neuron_id, disabled }: FollowingProps) {
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { result: neuron_system_functions } = useNeuronSystemFunctions(governance_id);
  const { result: neuron } = useNeuron(governance_id, neuron_id, refreshTrigger);

  return (
    <Box>
      <Typography color="text.primary" fontSize="16px" fontWeight={600}>
        <Trans>Following</Trans>
      </Typography>

      <Typography fontSize="12px" sx={{ margin: "10px 0 0 0", lineHeight: "16px" }}>
        <Trans>
          Following allows you to delegate your votes to another neuron holder. You still earn rewards if you delegate
          your voting rights. You can change your following at any time.
        </Trans>
      </Typography>

      <Button
        sx={{ margin: "10px 0 0 0" }}
        onClick={() => setOpen(true)}
        variant="contained"
        size="small"
        disabled={disabled}
      >
        <Trans>Following</Trans>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={t`Follow neurons`}>
        <Typography fontSize="12px" lineHeight="16px">
          <Trans>
            Follow neurons to automate your voting, and receive the maximum voting rewards. You can follow neurons on
            specific topics or all topics.
          </Trans>
        </Typography>

        <Box sx={{ margin: "40px 0 0 0", display: "flex", flexDirection: "column", gap: "20px 0" }}>
          {neuron_system_functions?.functions.map((func) => (
            <FollowNeuron
              key={func.id.toString()}
              func={func}
              neuron_id={neuron_id}
              governance_id={governance_id}
              neuron={neuron}
              refreshNeuron={() => setRefreshTrigger(refreshTrigger + 1)}
            />
          ))}
        </Box>
      </Modal>
    </Box>
  );
}
