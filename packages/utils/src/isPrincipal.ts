import { Principal } from "@dfinity/principal";

export function isPrincipal(principal: any): principal is Principal {
  return !!principal && !!principal._isPrincipal;
}
