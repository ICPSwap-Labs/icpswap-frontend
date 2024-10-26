import { useState } from "react";
import { Neuron } from "@icpswap/types";
import { X } from "react-feather";

import { DeleteFolloweeModal } from "./DeleteFolloweeModal";

export interface DeleteFolloweeProps {
  onDeleteSuccess?: () => void;
  neuron: Neuron | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  func_id: bigint;
  follow_id: Uint8Array | number[];
}

export function DeleteFollowee({
  func_id,
  onDeleteSuccess,
  neuron,
  governance_id,
  neuron_id,
  follow_id,
}: DeleteFolloweeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <X style={{ cursor: "pointer" }} size="18px" onClick={() => setOpen(true)} />

      <DeleteFolloweeModal
        onClose={() => setOpen(false)}
        open={open}
        onDeleteSuccess={onDeleteSuccess}
        follow_ids={[follow_id]}
        neuron_id={neuron_id}
        governance_id={governance_id}
        neuron={neuron}
        func_ids={[func_id]}
      />
    </>
  );
}
