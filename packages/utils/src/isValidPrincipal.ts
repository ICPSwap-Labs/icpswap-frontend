import { Principal } from "@dfinity/principal";

export function isValidPrincipal(principal: string): boolean {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (e) {
    return false;
  }
}
