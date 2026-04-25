import { Principal, encodePrincipalToEthAddress } from "@icpswap/dfinity";

export const principalToBytes32 = (principal: string): string => {
  return encodePrincipalToEthAddress(Principal.fromText(principal));
};
