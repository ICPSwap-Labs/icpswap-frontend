import { Principal } from "@icpswap/dfinity";
import { useWithdrawErc20TokenStatus, withdrawErc20TokenStatus } from "@icpswap/hooks";
import type { WithdrawalDetail, WithdrawalSearchParameter } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { ERC20_DISSOLVE_REFRESH, MINTER_CANISTER_ID } from "constants/ckERC20";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";
import { useSuccessTip } from "hooks/useTips";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useErc20DissolveUnCompletedTxsManager, useErc20DissolveDetailsManager } from "store/web3/hooks";
import { isErc20Finalized } from "utils/web3/dissolve";

const INTERVAL = 10_000;

/**
 * Return the erc20 dissolve transactions of the current user,
 * and update the uncompleted dissolve txs in the store, tips when a dissolve tx is completed.
 */
export function useErc20DissolveTxs() {
  const principal = useAccountPrincipalString();
  const [openTip] = useSuccessTip();
  const { t } = useTranslation();
  const [refresh] = useRefreshTriggerManager(ERC20_DISSOLVE_REFRESH);
  const [dissolveTxs, setDissolveTxs] = useState<undefined | WithdrawalDetail[]>([]);

  const erc20DissolveDetailsManager = useErc20DissolveDetailsManager();
  const [uncompletedTxs, erc20DissolveUnCompletedManager, clearUncompletedTxs] =
    useErc20DissolveUnCompletedTxsManager();

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
    clearUncompletedTxs();

    withdrawErc20TokenStatus({
      minter_id: MINTER_CANISTER_ID,
      params,
    }).then((result) => {
      if (cancelled) return;

      result
        .filter((tx) => !isErc20Finalized(tx.status))
        .forEach((tx) => erc20DissolveUnCompletedManager(tx.withdrawal_id.toString(), "add"));
    });
    return () => {
      cancelled = true;
    };
  }, [params, erc20DissolveUnCompletedManager, clearUncompletedTxs]);

  const { data: withdrawalErc20Result, isLoading } = useWithdrawErc20TokenStatus({
    minter_id: MINTER_CANISTER_ID,
    params,
    refresh,
    refetchInterval: INTERVAL,
  });

  useEffect(() => {
    if (!withdrawalErc20Result) return;
    setDissolveTxs(withdrawalErc20Result);
    withdrawalErc20Result.forEach((tx) => {
      erc20DissolveDetailsManager(tx);
      if (isErc20Finalized(tx.status) && uncompletedTxs.includes(tx.withdrawal_id.toString())) {
        erc20DissolveUnCompletedManager(tx.withdrawal_id.toString(), "delete");
        openTip(t("ck.dissolve.completed", { symbol: tx.token_symbol.replace("ck", "") }));
      }
    });
  }, [withdrawalErc20Result, uncompletedTxs, erc20DissolveDetailsManager, erc20DissolveUnCompletedManager, t, openTip]);

  const loading = (dissolveTxs?.length ?? 0) === 0 && isLoading;

  return useMemo(
    () => ({
      result: dissolveTxs,
      loading,
    }),
    [dissolveTxs, loading],
  );
}
