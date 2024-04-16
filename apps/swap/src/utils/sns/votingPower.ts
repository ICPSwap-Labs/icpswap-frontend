import type { Neuron, ProposalData } from "@icpswap/types";
import { neuronFormat } from "./neurons";

export function getVotingPower(neuron: Neuron, proposal: ProposalData) {
  let voting_power = BigInt(0);

  const neuronId = neuronFormat(neuron).id;
  const ballot = proposal.ballots.find(([ballotId]) => ballotId === neuronId);

  if (ballot) {
    voting_power = ballot[1].voting_power;
  }

  return voting_power;
}

export function getVotingPowers(neurons: Neuron[], proposal: ProposalData) {
  let voting_powers = BigInt(0);

  neurons.forEach((neuron) => {
    const neuronId = neuronFormat(neuron).id;
    const ballot = proposal.ballots.find(([ballotId]) => ballotId === neuronId);

    if (ballot) {
      voting_powers += ballot[1].voting_power;
    }
  });

  return voting_powers;
}
