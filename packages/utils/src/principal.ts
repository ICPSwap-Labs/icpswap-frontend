import { AccountIdentifier, SubAccount } from "@icp-sdk/canisters/ledger/icp";
import { Principal } from "@icp-sdk/core/principal";

import { isSubAccount } from "./ic";
import { isValidPrincipal } from "./isValidPrincipal";

/**
 * Derives the ledger account identifier (hex) for a principal, optionally with a subaccount
 * (`SubAccount`, another principal text, or valid principal for `SubAccount.fromPrincipal`).
 */
export function principalToAccount(principal: string, subAccount?: SubAccount | string): string {
  if (!principal) return principal;

  if (subAccount && !isSubAccount(subAccount) && !isValidPrincipal(subAccount)) {
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

/** Returns the 32-byte subaccount bytes for a principal (via `SubAccount.fromPrincipal`). */
export function principalToSubaccount(principal: string): Uint8Array {
  return SubAccount.fromPrincipal(Principal.fromText(principal)).toUint8Array();
}
