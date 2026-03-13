import { useAccountPrincipal } from "store/auth/hooks";
import { usePassCode } from "@icpswap/hooks";

export function useUserPassCodes(reload?: number) {
  const principal = useAccountPrincipal();
  return usePassCode(principal?.toString(), reload);
}
