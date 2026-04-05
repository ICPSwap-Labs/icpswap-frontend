import { principalToAccount } from "./principal";

/**
 * Internet Computer dashboard URL for an account (long hex) or canister id (short principal text).
 */
export function icDashboardExplorerLink(address: string) {
  if (address.length > 27) {
    const account = principalToAccount(address);
    return `https://dashboard.internetcomputer.org/account/${account}`;
  }

  return `https://dashboard.internetcomputer.org/canister/${address}`;
}
