import { SubAccount } from "@icpswap/dfinity";

/** False when `sub` is an `Error`; true for `SubAccount`, `undefined`, or other non-error values. */
export function isOkSubAccount(sub: SubAccount | Error | undefined): sub is SubAccount | undefined {
  if (sub && sub instanceof Error) return false;
  return true;
}

/** True when `sub` is an instance of ledger `SubAccount`. */
export function isSubAccount(sub: any): sub is SubAccount {
  if (sub && sub instanceof SubAccount) return true;
  return false;
}
