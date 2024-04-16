import type { Neuron, ProposalData } from "@icpswap/types";
import { neuronFormat } from "./neurons";

export function getVote(neuron: Neuron, proposal: ProposalData) {
  const neuronId = neuronFormat(neuron).id;
  const ballot = proposal.ballots.find(([ballotId]) => ballotId === neuronId);

  return ballot?.[1];
}
