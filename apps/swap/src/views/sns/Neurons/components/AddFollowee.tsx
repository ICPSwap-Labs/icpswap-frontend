import { useState } from "react";
import { Button } from "@mui/material";
import { Trans } from "@lingui/macro";
import { Neuron } from "@icpswap/types";

import { AddFolloweeModal } from "./AddFolloweeModal";

export interface AddFolloweeProps {
  onFollowSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_id: bigint;
}

export function AddFollowee({ func_id, onFollowSuccess, neuron, governance_id, neuron_id }: AddFolloweeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        <Trans>Add Followee</Trans>
      </Button>

      <AddFolloweeModal
        open={open}
        onClose={() => setOpen(false)}
        neuron={neuron}
        neuron_id={neuron_id}
        func_ids={[func_id]}
        governance_id={governance_id}
        onFollowSuccess={onFollowSuccess}
      />
    </>
  );
}
