import { useTheme } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useMemo, useState } from "react";
import type { Neuron, ProposalData } from "@icpswap/types";
import { shorten, toHexString } from "@icpswap/utils";
import { Collapse, Typography, Box } from "components/index";
import { Theme } from "@mui/material/styles";
import { neuronFormat, votingPowerFormat, getVotingPower, getVotingPowers, getVote } from "utils/sns/index";
import { ChevronDown, ThumbsUp, ThumbsDown } from "react-feather";
import { Vote } from "@icpswap/constants";

interface VotedNeuronItemProps {
  neuron: Neuron;
  proposal_data: ProposalData;
}

function VotedNeuronItem({ neuron, proposal_data }: VotedNeuronItemProps) {
  const theme = useTheme() as Theme;
  const YesColor = theme.colors.successDark;
  const NoColor = theme.colors.errorDark;

  const { ballot, votingPower } = useMemo(() => {
    if (!proposal_data) return {};

    return { ballot: getVote(neuron, proposal_data), votingPower: getVotingPower(neuron, proposal_data) };
  }, [neuron, proposal_data]);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: "12px" }}>
        {neuronFormat(neuron) ? shorten(neuronFormat(neuron).id, 12) : "--"}
      </Typography>

      <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
        <Typography sx={{ fontSize: "12px" }}>{votingPower ? votingPowerFormat(votingPower) : "--"}</Typography>
        {ballot ? (
          ballot.vote === Vote.Yes ? (
            <ThumbsUp size="14px" color={YesColor} />
          ) : (
            <ThumbsDown size="14px" color={NoColor} />
          )
        ) : null}
      </Box>
    </Box>
  );
}

export interface VotedNeuronsProps {
  proposal_data: ProposalData | undefined;
  votedNeurons: Neuron[] | undefined;
}

export function VotedNeurons({ proposal_data, votedNeurons }: VotedNeuronsProps) {
  const [votedOpen, setVotedOpen] = useState(false);

  return votedNeurons && proposal_data && votedNeurons.length > 0 ? (
    <Box sx={{ margin: "20px 0 0 0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{ display: "flex", gap: "0 5px", alignItems: "center", cursor: "pointer" }}
          onClick={() => setVotedOpen(!votedOpen)}
        >
          <Typography>
            <Trans>{votedNeurons.length} neurons voted</Trans>
          </Typography>
          <ChevronDown size="18px" style={{ transform: votedOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </Box>

        <Typography>
          <Trans>Voting Power: {votingPowerFormat(getVotingPowers(votedNeurons, proposal_data))}</Trans>
        </Typography>
      </Box>

      <Collapse in={votedOpen}>
        <Box sx={{ padding: "12px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px 0" }}>
            {votedNeurons.map((neuron, index) => (
              <VotedNeuronItem
                key={neuron.id[0]?.id ? toHexString(neuron.id[0]?.id) : `neuron_${index}`}
                proposal_data={proposal_data}
                neuron={neuron}
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  ) : null;
}
