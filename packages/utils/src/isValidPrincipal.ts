import { Principal } from "@icpswap/dfinity";

/** Returns true if `principal` parses as ICP text and round-trips through `Principal.fromText`. */
export function isValidPrincipal(principal: string): boolean {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (_e) {
    return false;
  }
}
