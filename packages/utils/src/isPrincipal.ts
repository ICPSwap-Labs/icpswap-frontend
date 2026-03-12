import { Principal } from "@icp-sdk/core/principal";

export function isPrincipal(principal: any): principal is Principal {
  return !!principal && !!principal._isPrincipal;
}
