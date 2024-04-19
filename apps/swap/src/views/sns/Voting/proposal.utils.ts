import type { ProposalData } from "@icpswap/types";
import { nowInSeconds, BigNumber } from "@icpswap/utils";
import { SnsProposalDecisionStatus } from "@icpswap/constants";
import { t } from "@lingui/macro";

const PROPOSAL_TYPES = [
  {
    id: 0,
    name: "All Topics",
    description: "Catch-all w.r.t to following for all types of proposals.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 1,
    name: "Motion",
    description: "Side-effect-less proposals to set general governance direction.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 2,
    name: "Manage nervous system parameters",
    description: "Proposal to change the core parameters of SNS governance.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 3,
    name: "Upgrade SNS controlled canister",
    description: "Proposal to upgrade the wasm of an SNS controlled canister.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 4,
    name: "Add nervous system function",
    description:
      "Proposal to add a new, user-defined, nervous system function:a canister call which can then be executed by proposal.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 5,
    name: "Remove nervous system function",
    description:
      "Proposal to remove a user-defined nervous system function,which will be no longer executable by proposal.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 6,
    name: "Execute nervous system function",
    description:
      "Proposal to execute a user-defined nervous system function,previously added by an AddNervousSystemFunction proposal. A canister call will be made when executed.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 7,
    name: "Upgrade SNS to next version",
    description: "Proposal to upgrade the WASM of a core SNS canister.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 8,
    name: "Manage SNS metadata",
    description: "Proposal to change the metadata associated with an SNS.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 9,
    name: "Transfer SNS treasury funds",
    description: "Proposal to transfer funds from an SNS Governance controlled treasury account",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 10,
    name: "Register dapp canisters",
    description: "Proposal to register a dapp canister with the SNS.",
    function_type: { NativeNervousSystemFunction: {} },
  },
  {
    id: 11,
    name: "Deregister Dapp Canisters",
    description: "Proposal to deregister a previously-registered dapp canister from the SNS.",
    function_type: { NativeNervousSystemFunction: {} },
  },
];

export function convertProposalNumberToText(action: bigint) {
  return PROPOSAL_TYPES.find((e) => e.id === Number(action))?.name;
}

export const SnsRewordsText = {
  "0": t`Unknown`,
  "1": t`Accepting Votes`,
  "2": t`Ready to Settle`,
  "3": t`Settled`,
};

export enum SnsProposalRewardStatus {
  PROPOSAL_REWARD_STATUS_UNSPECIFIED = 0,
  PROPOSAL_REWARD_STATUS_ACCEPT_VOTES = 1,
  PROPOSAL_REWARD_STATUS_READY_TO_SETTLE = 2,
  PROPOSAL_REWARD_STATUS_SETTLED = 3,
}

export const snsRewardStatus = ({
  reward_event_round,
  wait_for_quiet_state,
  is_eligible_for_rewards,
}: ProposalData): SnsProposalRewardStatus => {
  if (reward_event_round > 0n) {
    return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_SETTLED;
  }

  const now = nowInSeconds();
  const deadline = wait_for_quiet_state[0]?.current_deadline_timestamp_seconds;

  if (!deadline) {
    return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_UNSPECIFIED;
  }

  if (now < deadline) {
    return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_ACCEPT_VOTES;
  }

  if (is_eligible_for_rewards) {
    return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_READY_TO_SETTLE;
  }

  return SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_SETTLED;
};

export function getProposalStatus(proposal: ProposalData) {
  const now = new Date().getTime();

  if (!proposal.decided_timestamp_seconds || new BigNumber(proposal.decided_timestamp_seconds.toString()).gt(now)) {
    return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN;
  }

  if (proposal.executed_timestamp_seconds && new BigNumber(proposal.executed_timestamp_seconds.toString()).lt(now)) {
    return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_EXECUTED;
  }

  if (proposal.failed_timestamp_seconds && new BigNumber(proposal.failed_timestamp_seconds.toString(10)).lt(now)) {
    return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_FAILED;
  }

  if (proposal.decided_timestamp_seconds && new BigNumber(proposal.decided_timestamp_seconds.toString(10)).lt(now)) {
    const total = proposal.latest_tally[0]?.total;
    const yes = proposal.latest_tally[0]?.yes;
    const no = proposal.latest_tally[0]?.no;

    if (total !== undefined && yes !== undefined && no !== undefined) {
      // at least 3% of the total voting power
      if (
        (new BigNumber(yes.toString()).gt(no.toString(10)) &&
          new BigNumber(total.toString()).times(3 / 100).lt(yes.toString())) ||
        new BigNumber(yes.toString()).times(2).gt(total.toString(10))
      ) {
        return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_ADOPTED;
      }

      return SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_REJECTED;
    }
  }

  return undefined;
}
