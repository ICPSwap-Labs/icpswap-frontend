import { Principal } from "@icp-sdk/core/principal";

export function isValidPrincipal(principal: string): boolean {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (_e) {
    return false;
  }
}
