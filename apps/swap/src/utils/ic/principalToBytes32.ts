import { encodePrincipalToEthAddress } from "@icp-sdk/canisters/cketh";
import { Principal } from "@icp-sdk/core/principal";

export const principalToBytes32 = (principal: string): string => {
  return encodePrincipalToEthAddress(Principal.fromText(principal));
};
