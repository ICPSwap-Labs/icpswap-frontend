import type { Principal } from "@icpswap/dfinity";

/** Runtime check for SDK `Principal` instances (`_isPrincipal`). */
export function isPrincipal(principal: any): principal is Principal {
  return !!principal && !!principal._isPrincipal;
}
