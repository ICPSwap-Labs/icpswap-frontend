import type { ClaimEventInfo, ClaimTransaction } from "@icpswap/types";

export enum State {
  LIVE = "Live",
  NOT_STARTED = "Not started",
  CLOSED = "Closed",
}

export function getEventState(event: ClaimEventInfo) {
  if (event.claimEventStatus === BigInt(0) || event.claimEventStatus === BigInt(1)) return State.NOT_STARTED;
  if (event.claimEventStatus === BigInt(2)) return State.LIVE;
  if (event.claimEventStatus === BigInt(3)) return State.CLOSED;
  return State.NOT_STARTED;
}

export enum ClaimState {
  CLAIMED = "Claimed",
  UNCLAIMED = "Unclaimed",
}

export function getClaimEventState(event: ClaimTransaction) {
  if (event.claimStatus === BigInt(0)) return ClaimState.UNCLAIMED;
  if (event.claimStatus === BigInt(1)) return ClaimState.CLAIMED;
  return ClaimState.UNCLAIMED;
}
