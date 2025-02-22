import { useMemo, useState } from "react";
import type { Neuron, ProposalData } from "@icpswap/types";
import { shorten, toHexString } from "@icpswap/utils";
import { Collapse, Typography, Box, useTheme } from "components/Mui";
import { neuronFormat, votingPowerFormat, getVotingPower, getVotingPowers, getVote } from "utils/sns/index";
import { ChevronDown, ThumbsUp, ThumbsDown } from "react-feather";
import { Vote } from "@icpswap/constants";
import { useTranslation } from "react-i18next";

interface VotedNeuronItemProps {
  neuron: Neuron;
  proposal_data: ProposalData;
}

function VotedNeuronItem({ neuron, proposal_data }: VotedNeuronItemProps) {
  const theme = useTheme();
  const YesColor = theme.colors.successDark;
  const NoColor = theme.colors.danger;

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
  const { t } = useTranslation();
  const [votedOpen, setVotedOpen] = useState(false);

  return votedNeurons && proposal_data && votedNeurons.length > 0 ? (
    <Box sx={{ margin: "20px 0 0 0" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "5px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "0 5px",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setVotedOpen(!votedOpen)}
        >
          <Typography>{t("nns.voting.number.voted", { number: votedNeurons.length })}</Typography>
          <ChevronDown size="18px" style={{ transform: votedOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </Box>

        <Typography>
          {t("nns.voting.power.amount", { amount: votingPowerFormat(getVotingPowers(votedNeurons, proposal_data)) })}
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
