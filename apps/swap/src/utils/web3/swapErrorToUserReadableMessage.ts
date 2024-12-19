/* eslint-disable no-param-reassign */

import { UserRejectedRequestError } from "./errors";

function getReason(error: any): string | undefined {
  let reason: string | undefined;
  while (error) {
    reason = error.reason ?? error.message ?? reason;
    error = error.error ?? error.data?.originalError;
  }
  return reason;
}

export function didUserReject(error: any): boolean {
  const reason = getReason(error);
  if (
    error?.code === 4001 ||
    // ethers v5.7.0 wrapped error
    error?.code === "ACTION_REJECTED" ||
    // For Rainbow :
    (reason?.match(/request/i) && reason?.match(/reject/i)) ||
    // For Frame:
    reason?.match(/declined/i) ||
    // For SafePal:
    reason?.match(/cancell?ed by user/i) ||
    // For Trust:
    reason?.match(/user cancell?ed/i) ||
    // For Coinbase:
    reason?.match(/user denied/i) ||
    // For Fireblocks
    reason?.match(/user rejected/i) ||
    error instanceof UserRejectedRequestError
  ) {
    return true;
  }
  return false;
}
