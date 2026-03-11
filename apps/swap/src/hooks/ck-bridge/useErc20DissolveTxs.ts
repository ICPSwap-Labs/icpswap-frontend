import { useAccountPrincipalString } from "store/auth/hooks";
import { useWithdrawErc20TokenStatus, withdrawErc20TokenStatus } from "@icpswap/hooks";
import type { WithdrawalDetail, WithdrawalSearchParameter } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";
import { MINTER_CANISTER_ID, ERC20_DISSOLVE_REFRESH } from "constants/ckERC20";
import { Principal } from "@dfinity/principal";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";
import { useErc20DissolveCompletedTxsManager, useErc20DissolveDetailsManager } from "store/web3/hooks";
import { isErc20Finalized } from "utils/web3/dissolve";

const INTERVAL = 10_000;

export function useErc20DissolveTxs() {
  const principal = useAccountPrincipalString();
  const [refresh] = useRefreshTriggerManager(ERC20_DISSOLVE_REFRESH);
  const [dissolveTxs, setDissolveTxs] = useState<undefined | WithdrawalDetail[]>([]);

  const erc20DissolveDetailsManager = useErc20DissolveDetailsManager();
  const [, erc20DissolveCompletedManager] = useErc20DissolveCompletedTxsManager();

  const params = useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;
    return {
      BySenderAccount: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
    } as WithdrawalSearchParameter;
  }, [principal]);

  // Update the completed dissolve txs once on principal change
  useEffect(() => {
    if (!params) return;
    let cancelled = false;
    withdrawErc20TokenStatus({
      minter_id: MINTER_CANISTER_ID,
      params,
    }).then((result) => {
      if (cancelled) return;
      const completedTxs = result.filter((tx) => isErc20Finalized(tx.status)).map((tx) => tx.withdrawal_id.toString());
      erc20DissolveCompletedManager(completedTxs);
    });
    return () => {
      cancelled = true;
    };
  }, [params, erc20DissolveCompletedManager]);

  const { data: withdrawalErc20Result, isLoading } = useWithdrawErc20TokenStatus({
    minter_id: MINTER_CANISTER_ID,
    params,
    refresh,
    refetchInterval: INTERVAL,
  });

  useEffect(() => {
    if (!withdrawalErc20Result) return;
    setDissolveTxs(withdrawalErc20Result);
    withdrawalErc20Result.forEach(erc20DissolveDetailsManager);
  }, [withdrawalErc20Result, erc20DissolveDetailsManager]);

  const loading = (dissolveTxs?.length ?? 0) === 0 && isLoading;

  return useMemo(
    () => ({
      result: dissolveTxs,
      loading,
    }),
    [dissolveTxs, loading],
  );
}
