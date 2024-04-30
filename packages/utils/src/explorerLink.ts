import { principalToAccount } from "./principalToAccount";
import { isValidAccount } from "./isValidAccount";
import { isValidPrincipal } from "./isValidPrincipal";

export function explorerLink(id: string) {
  if (isValidAccount(id)) {
    return `https://dashboard.internetcomputer.org/account/${id}`;
  }

  if (id.length > 27 && isValidPrincipal(id)) {
    const account = principalToAccount(id);
    return `https://dashboard.internetcomputer.org/account/${account}`;
  }

  return `https://dashboard.internetcomputer.org/canister/${id}`;
}
