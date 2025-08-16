import { useAccountPrincipalString } from "store/auth/hooks";
import { useWithdrawErc20TokenStatus, withdrawErc20TokenStatus } from "@icpswap/hooks";
import type { WithdrawalDetail, WithdrawalSearchParameter } from "@icpswap/types";
import { useEffect, useMemo, useState } from "react";
import { MINTER_CANISTER_ID, ERC20_DISSOLVE_REFRESH } from "constants/ckERC20";
import { Principal } from "@dfinity/principal";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";
import { useErc20DissolveCompletedTxsManager, useErc20DissolveDetailsManager } from "store/web3/hooks";

const INTERVAL = 10000;

export function useErc20DissolveTxs() {
  const principal = useAccountPrincipalString();
  const [refresh, setRefresh] = useRefreshTriggerManager(ERC20_DISSOLVE_REFRESH);
  const [dissolveTxs, setDissolveTxs] = useState<undefined | WithdrawalDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const erc20DissolveDetailsManager = useErc20DissolveDetailsManager();
  const [, erc20DissolveCompletedManager] = useErc20DissolveCompletedTxsManager();

  // Update the completed dissolve txs once reload the page
  useEffect(() => {
    async function call() {
      if (isUndefinedOrNull(principal)) return undefined;

      const result = await withdrawErc20TokenStatus({
        minter_id: MINTER_CANISTER_ID,
        params: {
          BySenderAccount: {
            owner: Principal.fromText(principal),
            subaccount: [],
          },
        } as WithdrawalSearchParameter,
      });

      const completedTxs = result.map((tx) => tx.withdrawal_id.toString());

      erc20DissolveCompletedManager(completedTxs);
    }

    call();
  }, [principal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefresh();
    }, INTERVAL);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [setRefresh]);

  const params = useMemo(() => {
    if (isUndefinedOrNull(principal)) return undefined;

    return {
      BySenderAccount: {
        owner: Principal.fromText(principal),
        subaccount: [],
      },
    } as WithdrawalSearchParameter;
  }, [principal]);

  const { result, loading: dissolveLoading } = useWithdrawErc20TokenStatus({
    minter_id: MINTER_CANISTER_ID,
    params,
    refresh,
  });

  useEffect(() => {
    if (result) {
      setDissolveTxs(result);

      result.forEach((erc20DissolveDetails) => {
        erc20DissolveDetailsManager(erc20DissolveDetails);
      });
    }
  }, [result]);

  useEffect(() => {
    if (dissolveTxs && dissolveTxs.length > 0) {
      setLoading(false);
    } else {
      setLoading(dissolveLoading);
    }
  }, [dissolveTxs, dissolveLoading]);

  return useMemo(
    () => ({
      result: dissolveTxs,
      loading,
    }),
    [loading, dissolveTxs],
  );
}
