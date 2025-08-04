import { useEffect, useMemo } from "react";
import { chainKeyETHMinter } from "@icpswap/actor";
import { useUpdateErc20DissolveTx } from "store/web3/hooks";
import { ERC20_DISSOLVE_REFRESH, MINTER_CANISTER_ID } from "constants/ckERC20";
import { useErc20DissolveTxs } from "hooks/ck-bridge/useErc20DissolveTxs";
import { erc20DissolveHash, erc20DissolveStatus, isErc20Finalized } from "utils/web3/dissolve";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import { useSuccessTip } from "hooks/useTips";
import { useRefreshTriggerManager } from "hooks/useGlobalContext";

export function useErc20DissolveTxWatcher() {
  const { result: erc20DissolveTxs } = useErc20DissolveTxs();
  const [openTip] = useSuccessTip();
  const [, setRefreshTrigger] = useRefreshTriggerManager(ERC20_DISSOLVE_REFRESH);

  const updateErc20DissolveTx = useUpdateErc20DissolveTx();

  const erc20DissolveUnFinalized = useMemo(() => {
    if (isUndefinedOrNull(erc20DissolveTxs)) return undefined;
    return erc20DissolveTxs.filter((tx) => !isErc20Finalized(tx.status)).map((tx) => tx.withdrawal_id);
  }, [erc20DissolveTxs]);

  useEffect(() => {
    async function call() {
      if (nonUndefinedOrNull(erc20DissolveUnFinalized) && erc20DissolveUnFinalized.length > 0) {
        for (let i = 0; i < erc20DissolveUnFinalized.length; i++) {
          const withdrawal_id = erc20DissolveUnFinalized[i];

          const dissolveResponse = await (
            await chainKeyETHMinter(MINTER_CANISTER_ID)
          ).withdrawal_status({
            ByWithdrawalId: withdrawal_id,
          });

          const dissolveResult = dissolveResponse?.[0];

          if (dissolveResult) {
            if (isErc20Finalized(dissolveResult.status)) {
              openTip(`${dissolveResult.token_symbol} dissolve successfully`);
              setRefreshTrigger();
            }

            updateErc20DissolveTx({
              withdrawal_id: dissolveResult.withdrawal_id.toString(),
              hash: erc20DissolveHash(dissolveResult.status),
              from: dissolveResult.from.toString(),
              to: dissolveResult.recipient_address,
              value: dissolveResult.withdrawal_amount.toString(),
              state: erc20DissolveStatus(dissolveResult.status),
              token_symbol: dissolveResult.token_symbol,
            });
          }
        }
      }
    }

    const timer = setInterval(() => {
      call();
    }, 10000);

    call();

    return () => {
      clearInterval(timer);
    };
  }, [erc20DissolveUnFinalized, openTip, setRefreshTrigger]);
}
