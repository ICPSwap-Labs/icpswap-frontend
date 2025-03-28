import { useState } from "react";
import { Button } from "components/Mui";
import { Neuron } from "@icpswap/types";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        {t("nns.followee.add")}
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
