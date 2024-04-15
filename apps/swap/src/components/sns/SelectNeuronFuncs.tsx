import { useMemo, useState } from "react";
import { Select, AvatarImage } from "components/index";
import { useSNSTokensRootIds, useNeuronSystemFunctions } from "@icpswap/hooks";
import { Box, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Modal } from "@icpswap/ui";

export interface SelectNeuronFuncsProps {
  onChange: (value: string) => void;
  value: string | null;
  neuron_id: Uint8Array | number[];
  governance_id: string | undefined;
}

export function SelectNeuronFuncs({ onChange, governance_id, value, neuron_id }: SelectNeuronFuncsProps) {
  const [open, setOpen] = useState(false);
  const { result: snsTokens } = useSNSTokensRootIds();

  const { result } = useNeuronSystemFunctions(governance_id);

  console.log("result:", result);

  const completedSns = useMemo(() => {
    if (!snsTokens) return undefined;
    return snsTokens.data.filter((e) => e.swap_lifecycle.lifecycle === "LIFECYCLE_COMMITTED");
  }, [snsTokens]);

  const menus = useMemo(() => {
    if (!completedSns) return [];
    return completedSns?.map((e) => ({
      value: e.root_canister_id,
      label: (
        <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
          <AvatarImage src={e.logo} sx={{ width: "24px", height: "24px" }} />
          <Typography fontWeight={500}>{e.name}</Typography>
        </Box>
      ),
    }));
  }, [completedSns]);

  const handleConfirm = () => {
    console.log("Selected");
  };

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Typography>
          <Trans>Types</Trans>
        </Typography>
      </Box>

      <Modal open={open} title={t`Types`} onClose={() => setOpen(false)} showConfirm onConfirm={handleConfirm}>
        <Box>
          <Typography>
            <Trans>Select All</Trans>
          </Typography>
          <Typography>
            <Trans>Clear</Trans>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
