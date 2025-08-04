import { useAccountPrincipalString } from "store/auth/hooks";
import { useWithdrawErc20TokenStatus } from "@icpswap/hooks";
import type { WithdrawalSearchParameter } from "@icpswap/types";
import { useMemo } from "react";
import { MINTER_CANISTER_ID, ERC20_DISSOLVE_REFRESH } from "constants/ckERC20";
import { Principal } from "@dfinity/principal";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useRefreshTrigger } from "hooks/useGlobalContext";

export function useErc20DissolveTxs() {
  const principal = useAccountPrincipalString();
  const refresh = useRefreshTrigger(ERC20_DISSOLVE_REFRESH);

  const params = useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;

    return {
      BySenderAccount: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
    } as WithdrawalSearchParameter;
  }, [principal]);

  return useWithdrawErc20TokenStatus({
    minter_id: MINTER_CANISTER_ID,
    params,
    refresh,
  });
}
