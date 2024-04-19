export enum SnsSwapLifecycle {
  Unspecified = 0,
  Pending = 1,
  Open = 2,
  Committed = 3,
  Aborted = 4,
  Adopted = 5,
}

export enum Vote {
  Unspecified = 0,
  Yes = 1,
  No = 2,
}

export enum SnsProposalDecisionStatus {
  PROPOSAL_DECISION_STATUS_UNSPECIFIED = 0,
  PROPOSAL_DECISION_STATUS_OPEN = 1,
  PROPOSAL_DECISION_STATUS_REJECTED = 2,
  PROPOSAL_DECISION_STATUS_ADOPTED = 3,
  PROPOSAL_DECISION_STATUS_EXECUTED = 4,
  PROPOSAL_DECISION_STATUS_FAILED = 5,
}
