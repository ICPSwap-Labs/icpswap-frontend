import { useDogeAddress as useDogeAddressQuery } from "@icpswap/hooks";
import { useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

export function useDogeAddress() {
  const principal = useAccountPrincipalString();
  const { data: address } = useDogeAddressQuery(principal);

  return useMemo(() => address ?? undefined, [address]);
}
