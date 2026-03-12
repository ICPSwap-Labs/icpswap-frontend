import { Principal } from "@icp-sdk/core/principal";
import { encodePrincipalToEthAddress } from "@icp-sdk/canisters/cketh";

export const principalToBytes32 = (principal: string): string => {
  return encodePrincipalToEthAddress(Principal.fromText(principal));
};
