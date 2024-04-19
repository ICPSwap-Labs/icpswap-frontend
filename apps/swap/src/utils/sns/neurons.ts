import type { Neuron, DissolveState, NervousSystemParameters, ProposalData, SnsBallot } from "@icpswap/types";
import { BigNumber, nowInSeconds, toHexString, asciiStringToByteArray } from "@icpswap/utils";
import { Principal } from "@dfinity/principal";
import { SubAccount } from "@dfinity/ledger-icp";
import { arrayOfNumberToUint8Array } from "@dfinity/utils";
import { sha256 } from "@noble/hashes/sha256";

export enum NeuronState {
  Unspecified = 0,
  Locked = 1,
  Dissolving = 2,
  Dissolved = 3,
  Spawning = 4,
}

export enum NeuronStateText {
  Unspecified = "Unspecified",
  Locked = "Locked",
  Dissolving = "Dissolving",
  Dissolved = "Dissolved",
  Spawning = "Spawning",
}

export function neuronStateText(state: NeuronState): NeuronStateText | undefined {
  switch (state) {
    case NeuronState.Dissolved:
      return NeuronStateText.Dissolved;
    case NeuronState.Dissolving:
      return NeuronStateText.Dissolving;
    case NeuronState.Unspecified:
      return NeuronStateText.Unspecified;
    case NeuronState.Spawning:
      return NeuronStateText.Spawning;
    case NeuronState.Locked:
      return NeuronStateText.Locked;
    default:
      break;
  }
}

export function neuronState(state: DissolveState | undefined): NeuronState {
  if (!state) return NeuronState.Unspecified;

  const state_key = Object.keys(state)[0];

  if (state_key === "DissolveDelaySeconds") {
    const delay_seconds: bigint = state[state_key];
    if (new BigNumber(delay_seconds.toString()).gt(0)) return NeuronState.Locked;
    return NeuronState.Dissolved;
  }

  const now = new Date().getTime();
  const dissolve_time: bigint = state[state_key];
  if (new BigNumber(dissolve_time.toString()).times(1000).gt(now)) return NeuronState.Dissolving;
  return NeuronState.Dissolved;
}

export function neuronFormat(neuron: Neuron) {
  const neuronId = neuron.id[0];

  const hex = neuronId ? toHexString(neuronId.id) : undefined;

  const dissolve_state = neuron.dissolve_state[0];

  const dissolve_delay = dissolve_state
    ? "DissolveDelaySeconds" in dissolve_state
      ? dissolve_state.DissolveDelaySeconds
      : undefined
    : undefined;

  const when_dissolved_timestamp_seconds = dissolve_state
    ? "WhenDissolvedTimestampSeconds" in dissolve_state
      ? dissolve_state.WhenDissolvedTimestampSeconds
      : undefined
    : undefined;

  return {
    ...neuron,
    id: hex,
    staked_maturity_e8s_equivalent: neuron.staked_maturity_e8s_equivalent[0],
    source_nns_neuron_id: neuron.source_nns_neuron_id[0],
    auto_stake_maturity: neuron.auto_stake_maturity[0],
    dissolve_state: neuronState(neuron.dissolve_state[0]),
    dissolve_state_text: neuronStateText(neuronState(neuron.dissolve_state[0])),
    dissolve_delay,
    when_dissolved_timestamp_seconds,
    vesting_period_seconds: neuron.vesting_period_seconds[0],
    neuron,
  };
}

export const getDissolvingTimestampSeconds = (neuron: Neuron): bigint | undefined => {
  const dissolve_state = neuron.dissolve_state[0];

  if (dissolve_state === undefined) return undefined;

  return neuronState(dissolve_state) === NeuronState.Dissolving && "WhenDissolvedTimestampSeconds" in dissolve_state
    ? dissolve_state.WhenDissolvedTimestampSeconds
    : undefined;
};

export const getDissolvingTimeInSeconds = (neuron: Neuron): bigint | undefined => {
  const dissolvingTimestamp = getDissolvingTimestampSeconds(neuron);
  if (dissolvingTimestamp === undefined) return undefined;
  return dissolvingTimestamp - BigInt(nowInSeconds());
};

// export const getSpawningTimeInSeconds = (neuron: Neuron): bigint | undefined => {
//   const dissolve_state = neuron.dissolve_state[0];

//   if (dissolve_state === undefined || neuron.) return undefined;

//   return neuronState(dissolve_state) === NeuronState.Spawning ? neuron?.spawnAtTimesSeconds !== undefined
//     ? neuron.fullNeuron.spawnAtTimesSeconds - BigInt(nowInSeconds())
//     : undefined;
// }

export function getNervousVotingPower(
  neuron: Neuron,
  nervousSystemParameters: NervousSystemParameters,
  decimals: number,
) {
  const dissolve_state = neuron.dissolve_state[0];

  if (!dissolve_state) return undefined;

  let dissolve_delay = 0;

  const state_key = Object.keys(dissolve_state)[0];

  if (state_key === "DissolveDelaySeconds") {
    const delay_seconds: bigint = dissolve_state[state_key];
    dissolve_delay = Number(delay_seconds);
  } else {
    const now = Math.ceil(new Date().getTime() / 1000);
    const dissolve_time: bigint = dissolve_state[state_key];
    if (Number(dissolve_time) - now >= 0) {
      dissolve_delay = Number(dissolve_time) - now;
    } else {
      dissolve_delay = 0;
    }
  }

  const neuron_minimum_dissolve_delay_to_vote_seconds =
    nervousSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0];
  if (!neuron_minimum_dissolve_delay_to_vote_seconds) return 0;

  if (
    dissolve_delay === 0 ||
    new BigNumber(dissolve_delay).lt(neuron_minimum_dissolve_delay_to_vote_seconds.toString(10))
  ) {
    return "0";
  }

  const max_dissolve_delay_seconds = nervousSystemParameters.max_dissolve_delay_seconds[0];
  const max_dissolve_delay_bonus_percentage = nervousSystemParameters.max_dissolve_delay_bonus_percentage[0];

  if (!max_dissolve_delay_seconds || !max_dissolve_delay_bonus_percentage) return 0;

  const dissolveDelayBonus = new BigNumber(dissolve_delay)
    .div(max_dissolve_delay_seconds.toString(10))
    .times(max_dissolve_delay_bonus_percentage.toString(10))
    .div(100)
    .plus(1);

  const now = new Date().getTime() / 1000;
  let aging = BigInt(
    parseInt(new BigNumber(now).minus(neuron.aging_since_timestamp_seconds.toString(10)).toString(10)),
  );

  if (state_key === "WhenDissolvedTimestampSeconds") {
    aging = BigInt(0);
  }

  const max_neuron_age_for_age_bonus = nervousSystemParameters.max_neuron_age_for_age_bonus[0];
  const max_age_bonus_percentage = nervousSystemParameters.max_age_bonus_percentage[0];

  if (!max_neuron_age_for_age_bonus || !max_age_bonus_percentage) return 0;

  const ageBonus = new BigNumber(aging.toString(10))
    .div(max_neuron_age_for_age_bonus.toString(10))
    .times(max_age_bonus_percentage.toString(10))
    .div(100)
    .plus(1);

  const staked_maturity_e8s_equivalent = neuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
  const voting_balance = new BigNumber(neuron.cached_neuron_stake_e8s.toString(10))
    .plus(staked_maturity_e8s_equivalent.toString(10))
    .div(10 ** decimals)
    .toString(10);

  return new BigNumber(voting_balance)
    .times(dissolveDelayBonus)
    .times(ageBonus)
    .times(neuron.voting_power_percentage_multiplier.toString(10))
    .div(100)
    .decimalPlaces(2, 0)
    .toString(10);
}

export function canSpawnNeuron(neuron: Neuron): boolean {
  const maturity_e8s_equivalent = neuron.maturity_e8s_equivalent;
  // 1/95
  return new BigNumber(maturity_e8s_equivalent.toString()).lt(105263158);
}

export interface IneligibleNeuronsArgs {
  neurons: Neuron[];
  proposal: ProposalData;
}

export const filterIneligibleNeurons = ({ neurons, proposal }: IneligibleNeuronsArgs): Neuron[] => {
  const { ballots, proposal_creation_timestamp_seconds } = proposal;

  return neurons.filter((neuron: Neuron) => {
    const { created_timestamp_seconds, id } = neuronFormat(neuron);

    const createdSinceProposal: boolean = created_timestamp_seconds > proposal_creation_timestamp_seconds;

    const dissolveTooShort: boolean = ballots.find(([ballotNeuronId]) => ballotNeuronId === id) === undefined;

    return createdSinceProposal || dissolveTooShort;
  });
};

export interface VoteableForProposalArgs {
  ballots: [string, SnsBallot][];
  neuronId: string | undefined;
}

export function voteableForProposal({ ballots, neuronId }: VoteableForProposalArgs) {
  if (!neuronId) return undefined;
  const ballot: [string, SnsBallot] | undefined = ballots.find(([id]) => id === neuronId);
  if (!ballot) return false;
  return ballot[1].vote === 0;
}

export interface VotableNeuronsArgs {
  neurons: Neuron[];
  proposal: ProposalData;
}

export const filterVotableNeurons = ({ neurons, proposal }: VotableNeuronsArgs): Neuron[] => {
  return neurons.filter((neuron: Neuron) => {
    const formattedNeuron = neuronFormat(neuron);

    return (
      voteableForProposal({ ballots: proposal.ballots, neuronId: formattedNeuron.id }) &&
      filterIneligibleNeurons({ neurons, proposal }).find((ineligibleNeuron: Neuron) => {
        const formattedIneligibleNeuron = neuronFormat(ineligibleNeuron);
        return formattedNeuron.id === formattedIneligibleNeuron.id;
      }) === undefined
    );
  });
};

export interface VotedNeuronsArgs {
  neurons: Neuron[];
  proposal: ProposalData;
}

export const filterVotedNeurons = ({ neurons, proposal }: VotedNeuronsArgs): Neuron[] => {
  return neurons.filter((neuron: Neuron) => {
    const formattedNeuron = neuronFormat(neuron);
    return (
      !voteableForProposal({ ballots: proposal.ballots, neuronId: formattedNeuron.id }) &&
      filterIneligibleNeurons({ neurons, proposal }).find((ineligibleNeuron: Neuron) => {
        const formattedIneligibleNeuron = neuronFormat(ineligibleNeuron);
        return formattedNeuron.id === formattedIneligibleNeuron.id;
      }) === undefined
    );
  });
};

export function votingPowerFormat(votingPower_es8: bigint) {
  return new BigNumber(votingPower_es8.toString()).dividedBy(10 ** 8).toFormat(2);
}

export function getNeuronStakeSubAccountBytes(nonce: Uint8Array, principal: Principal): Uint8Array {
  const padding = asciiStringToByteArray("neuron-stake");
  const shaObj = sha256.create();
  shaObj.update(arrayOfNumberToUint8Array([0x0c, ...padding, ...principal.toUint8Array(), ...nonce]));
  return shaObj.digest();
}

export function buildNeuronStakeSubAccount(nonce: Uint8Array, principal: Principal): SubAccount {
  return SubAccount.fromBytes(getNeuronStakeSubAccountBytes(nonce, principal)) as SubAccount;
}
