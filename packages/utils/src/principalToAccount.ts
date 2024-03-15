import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { isSubAccount } from "./ic";
import { isValidPrincipal } from "./isValidPrincipal";

export function principalToAccount(
  principal: string,
  subAccount?: SubAccount | string
): string {
  if (!principal) return principal;

  if (
    subAccount &&
    !isSubAccount(subAccount) &&
    !isValidPrincipal(subAccount)
  ) {
    throw Error("Wrong sub account");
  }

  const sub = subAccount
    ? isSubAccount(subAccount)
      ? subAccount
      : isValidPrincipal(subAccount)
      ? SubAccount.fromPrincipal(Principal.fromText(subAccount))
      : undefined
    : undefined;

  return AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(principal),
    subAccount: sub,
  }).toHex();
}
