import { Principal } from "@dfinity/principal";
import { encodePrincipalToEthAddress } from "@dfinity/cketh";

export const principalToBytes32 = (principal: string): string => {
  return encodePrincipalToEthAddress(Principal.fromText(principal));
};
