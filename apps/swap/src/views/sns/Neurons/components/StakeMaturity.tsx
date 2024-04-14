import { Button, Box, Typography } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { stakeNeuronMaturity } from "@icpswap/hooks";
import { Flex, Modal, Progression } from "@icpswap/ui";
import { Neuron } from "@icpswap/types";
import { useMemo, useState } from "react";
import { TokenInfo } from "types/token";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";

export interface StakeMaturityProps {
  neuron: Neuron;
  token: TokenInfo | undefined;
  governance_id: string | undefined;
  neuron_id: Uint8Array | number[] | undefined;
  onDisburseSuccess?: () => void;
}

export function StakeMaturity({ neuron, token, governance_id, neuron_id }: StakeMaturityProps) {
  const [open, setOpen] = useState(false);
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);
  const [maturityPercent, setMaturityPercent] = useState<number>(0);

  const { available_maturity } = useMemo(() => {
    return {
      auto_stake_maturity: neuron.auto_stake_maturity[0],
      staked_maturity: neuron.staked_maturity_e8s_equivalent[0],
      available_maturity: neuron.maturity_e8s_equivalent,
    };
  }, [neuron]);

  const handleStakeMaturity = async () => {
    if (loading || !governance_id || !neuron_id || maturityPercent === 0) return;

    setLoading(true);
    openFullscreenLoading();

    const { data, message, status } = await stakeNeuronMaturity(governance_id, neuron_id, maturityPercent);

    const result = data ? data.command[0] : undefined;
    const neuron_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

    if (status === "ok") {
      if (!neuron_error) {
        openTip(t`Stake maturity successfully`, TIP_SUCCESS);
        setOpen(false);
        setLoading(false);
      } else {
        const message = neuron_error.error_message;
        openTip(message === "" ? t`Failed to stake maturity` : message, TIP_ERROR);
      }
    } else {
      openTip(message ?? t`Failed to stake maturity`, TIP_ERROR);
    }

    closeFullscreenLoading();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        size="small"
        disabled={available_maturity.toString() === "0"}
      >
        <Trans>Stake</Trans>
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t`Stake Maturity`}
        showCancel
        showConfirm
        onConfirm={handleStakeMaturity}
        onCancel={() => setOpen(false)}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px 0" }}>
          <Flex justify="space-between" align="center">
            <Typography color="text.primary">
              <Trans>Maturity Available</Trans>
            </Typography>
            <Typography>
              {token
                ? toSignificantWithGroupSeparator(parseTokenAmount(available_maturity, token?.decimals).toString())
                : "--"}
            </Typography>
          </Flex>

          <Typography>
            <Trans>Choose how much of the maturity available to stake into this neuron.</Trans>
          </Typography>

          <Box sx={{ padding: "0 20px 0 0" }}>
            <Progression value={maturityPercent} onChange={(value: number) => setMaturityPercent(value)} />
          </Box>

          <Typography align="right" color="text.primary">
            {token
              ? toSignificantWithGroupSeparator(
                  parseTokenAmount(available_maturity, token.decimals)
                    .multipliedBy(maturityPercent)
                    .dividedBy(100)
                    .toString(),
                )
              : "--"}{" "}
            maturity {maturityPercent}%
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
