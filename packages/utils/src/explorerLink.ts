import { principalToAccount } from "./principal";

export function icDashboardExplorerLink(address: string) {
  if (address.length > 27) {
    const account = principalToAccount(address);
    return `https://dashboard.internetcomputer.org/account/${account}`;
  }

  return `https://dashboard.internetcomputer.org/canister/${address}`;
}
