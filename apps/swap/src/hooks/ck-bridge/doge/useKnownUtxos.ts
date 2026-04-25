import { useDogeKnownUtxos } from "@icpswap/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";

export function useUserDogeKnownUtxos() {
  const principal = useAccountPrincipalString();

  return useDogeKnownUtxos(principal);
}
