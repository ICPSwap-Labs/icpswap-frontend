import { usePassCode } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";

export function useUserPassCodes(reload?: number) {
  const principal = useAccountPrincipal();
  return usePassCode(principal?.toString(), reload);
}
