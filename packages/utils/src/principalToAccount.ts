import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

export function principalToAccount(
  principal: string,
  subAccount?: SubAccount
): string {
  if (!principal) return principal;
  return AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(principal),
    subAccount,
  }).toHex();
}
