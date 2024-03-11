import { getCanisterId, CANISTER_NAMES } from "./canister";

export enum ProposalState {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  CLOSED = "CLOSED",
}

export const ProposalLabel = {
  [ProposalState.ACTIVE]: "Active",
  [ProposalState.PENDING]: "Pending",
  [ProposalState.CLOSED]: "Closed",
};

export const DefaultCanisterId = getCanisterId(CANISTER_NAMES.VOTE);
