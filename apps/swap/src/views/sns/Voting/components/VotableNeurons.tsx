import { Trans } from "@lingui/macro";
import { useEffect, useMemo, useState } from "react";
import type { Neuron, ProposalData } from "@icpswap/types";
import { shorten } from "@icpswap/utils";
import { Collapse, Typography, Box, Checkbox } from "components/index";
import { neuronFormat, votingPowerFormat, getVotingPowers, getVotingPower } from "utils/sns/index";
import { ChevronDown } from "react-feather";

export interface ProposalDetailsProps {
  voteableNeurons: Neuron[];
  onCheckedChange: (neuronIds: string[], votingPowers: bigint) => void;
  proposal: ProposalData;
}

export function VotableNeurons({ voteableNeurons, onCheckedChange, proposal }: ProposalDetailsProps) {
  const [checkedNeurons, setCheckedNeurons] = useState<string[]>([]);
  const [votableOpen, setVoteableOpen] = useState(false);

  useEffect(() => {
    const checkedNeurons = voteableNeurons
      .map((neuron) => {
        const formattedNeuron = neuronFormat(neuron);
        return formattedNeuron.id;
      })
      .filter((id) => id !== undefined) as string[];

    setCheckedNeurons(checkedNeurons);

    const votingPowers = getVotingPowers(
      voteableNeurons.filter((voteableNeuron) => {
        const formattedNeuron = neuronFormat(voteableNeuron);
        if (!formattedNeuron.id) return false;
        return checkedNeurons.includes(formattedNeuron.id);
      }),
      proposal,
    );

    onCheckedChange(checkedNeurons, votingPowers);
  }, [voteableNeurons, proposal]);

  const handleToggleOpen = () => {
    setVoteableOpen(!votableOpen);
  };

  const handleCheckedChange = (checked: boolean, neuronId: string | undefined) => {
    if (!neuronId) return;

    let checkedNeuronIds: string[] = [];

    if (checked) {
      checkedNeuronIds = [...checkedNeurons, neuronId];
      setCheckedNeurons(checkedNeuronIds);
    } else {
      checkedNeuronIds = [...checkedNeurons];
      checkedNeuronIds.splice(checkedNeurons.indexOf(neuronId), 1);
      setCheckedNeurons(checkedNeuronIds);
    }

    const votingPowers = getVotingPowers(
      voteableNeurons.filter((voteableNeuron) => {
        const formattedNeuron = neuronFormat(voteableNeuron);
        if (!formattedNeuron.id) return false;
        return checkedNeuronIds.includes(formattedNeuron.id);
      }),
      proposal,
    );

    onCheckedChange(checkedNeuronIds, votingPowers);
  };

  const votingPowers = useMemo(() => {
    const votingPowers = getVotingPowers(
      voteableNeurons.filter((voteableNeuron) => {
        const formattedNeuron = neuronFormat(voteableNeuron);
        if (!formattedNeuron.id) return false;
        return checkedNeurons.includes(formattedNeuron.id);
      }),
      proposal,
    );

    return votingPowers;
  }, [voteableNeurons, proposal, checkedNeurons]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          alignItems: "center",
        }}
        onClick={handleToggleOpen}
      >
        <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center", width: "fit-content" }}>
          <Typography>
            <Trans>
              Vote with {checkedNeurons.length}/{voteableNeurons.length} Neurons
            </Trans>
          </Typography>

          <ChevronDown size="18px" style={{ transform: votableOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </Box>

        <Typography>
          <Trans>Voting Power: {votingPowerFormat(votingPowers)}</Trans>
        </Typography>
      </Box>

      <Collapse in={votableOpen}>
        <Box sx={{ padding: "12px 0", display: "flex", flexDirection: "column", gap: "10px 0" }}>
          {voteableNeurons.map((neuron) => {
            const formattedNeuron = neuronFormat(neuron);

            if (formattedNeuron.id === undefined) return null;

            return (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: "12px" }}>{shorten(formattedNeuron.id, 12)}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: "0 8px" }}>
                  <Typography sx={{ fontSize: "12px" }}>
                    {votingPowerFormat(getVotingPower(neuron, proposal))}
                  </Typography>

                  <Checkbox
                    checked={checkedNeurons.includes(formattedNeuron.id)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                      handleCheckedChange(checked, formattedNeuron.id)
                    }
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </>
  );
}
