import { Principal } from "@icp-sdk/core/principal";

/** Returns true if `principal` parses as ICP text and round-trips through `Principal.fromText`. */
export function isValidPrincipal(principal: string): boolean {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (_e) {
    return false;
  }
}
