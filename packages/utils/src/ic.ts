import { SubAccount } from "@dfinity/ledger-icp";

// TODO
export function isOkSubAccount(
  sub: SubAccount | Error | undefined
): sub is SubAccount | undefined {
  if (sub && sub instanceof Error) return false;
  return true;
}
