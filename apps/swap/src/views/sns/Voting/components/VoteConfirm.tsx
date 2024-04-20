import { useState } from "react";
import { neuronVoteForProposal } from "@icpswap/hooks";
import { useTips, TIP_ERROR, TIP_SUCCESS, useFullscreenLoading } from "hooks/useTips";
import { t } from "@lingui/macro";
import { Neuron, ProposalData } from "@icpswap/types";
import { ConfirmModal } from "@icpswap/ui";
import { neuronFormat, votingPowerFormat } from "utils/sns/index";
import { Vote } from "@icpswap/constants";

export interface VoteConfirmProps {
  onVoteCallEnded?: () => void;
  governance_id: string | undefined;
  proposal_id: string | undefined;
  rejected?: boolean;
  votingPowers: bigint;
  voteNeurons: Neuron[] | undefined;
  proposal: ProposalData | undefined;
  onClose: () => void;
  open: boolean;
}

export function VoteConfirm({
  proposal_id,
  onVoteCallEnded,
  governance_id,
  rejected,
  votingPowers,
  onClose,
  voteNeurons,
  proposal,
  open,
}: VoteConfirmProps) {
  const [openFullscreenLoading, closeFullscreenLoading] = useFullscreenLoading();
  const [openTip] = useTips();
  const [loading, setLoading] = useState<boolean>(false);

  const handleVote = async () => {
    if (loading || !governance_id || !proposal_id || !proposal || !voteNeurons) return;

    setLoading(true);
    openFullscreenLoading();

    let vote_called = 0;

    voteNeurons.forEach((voteNeuron) => {
      const formattedNeuron = neuronFormat(voteNeuron);
      const neuron_id = voteNeuron.id[0]?.id;

      if (formattedNeuron.id && neuron_id) {
        const ballot = proposal.ballots.find(([ballotId]) => ballotId === formattedNeuron.id);

        if (ballot) {
          const vote = rejected ? Vote.No : Vote.Yes;

          neuronVoteForProposal(governance_id, neuron_id, vote, BigInt(proposal_id)).then(
            ({ status, message, data }) => {
              vote_called += 1;

              const result = data ? data.command[0] : undefined;
              const manage_error = result ? ("Error" in result ? result.Error : undefined) : undefined;

              if (status === "ok") {
                // If neuron is already voted, make it no error tip
                if (!manage_error || manage_error.error_message === "Neuron already voted on proposal.") {
                  openTip(t`Neuron ${formattedNeuron.id} Vote successfully`, TIP_SUCCESS);
                } else {
                  const message = manage_error.error_message;
                  openTip(message !== "" ? message : t`Failed to vote neuron ${formattedNeuron.id}`, TIP_ERROR);
                }
              } else {
                openTip(message ?? t`Failed to vote neuron ${formattedNeuron.id}`, TIP_ERROR);
              }

              if (vote_called === voteNeurons.length) {
                if (onVoteCallEnded) onVoteCallEnded();
                closeFullscreenLoading();
                setLoading(false);
                onClose();
              }
            },
          );
        }
      } else {
        vote_called += 1;
      }
    });
  };

  return (
    <ConfirmModal
      open={open}
      onConfirm={handleVote}
      onClose={onClose}
      title={rejected ? t`Reject Proposal` : t`Adopt Proposal`}
      text={t`You are about to cast ${votingPowerFormat(
        votingPowers,
      )} votes against this proposal, are you sure you want to proceed?`}
    />
  );
}
