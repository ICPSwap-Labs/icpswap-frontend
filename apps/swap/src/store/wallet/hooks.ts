import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { RetrieveBtcStatus, TxState } from "types/ckBTC";
import { Principal } from "@dfinity/principal";
import {
  saveWalletCacheToken,
  deleteWalletCatchToken,
  updateHideSmallBalance,
  updateCK_BTCAddresses,
  updateRetrieveState,
} from "./actions";

export function toHexString(byteArray: number[]) {
  return Array.from(byteArray, (byte) => {
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }).join("");
}

export function useWalletCatchTokenIds() {
  return useAppSelector((state) => state.wallet.cacheTokenIds);
}

export function useSaveCacheTokenCallback() {
  const dispatch = useAppDispatch();

  return useCallback(
    (cacheTokens: string[]) => {
      dispatch(saveWalletCacheToken(cacheTokens));
    },
    [dispatch],
  );
}

export function useDeleteCacheTokenCallback() {
  const dispatch = useAppDispatch();

  return useCallback(
    (cacheTokens: string[]) => {
      dispatch(deleteWalletCatchToken(cacheTokens));
    },
    [dispatch],
  );
}

export function useUpdateHideSmallBalanceManager(): [boolean, (hide: boolean) => void] {
  const dispatch = useAppDispatch();
  const hideSmallBalance = useAppSelector((state) => state.wallet.hideSmallBalance);

  const updateHideSmallBalanceCallback = useCallback(
    (hideSmallBalance) => {
      dispatch(updateHideSmallBalance(hideSmallBalance));
    },
    [dispatch],
  );

  return useMemo(
    () => [hideSmallBalance, updateHideSmallBalanceCallback],
    [hideSmallBalance, updateHideSmallBalanceCallback],
  );
}

export function useUserBTCDepositAddress(principal: string | undefined) {
  return useAppSelector((state) => state.wallet.ckBTCAddresses)[`${principal}_deposit`];
}

export function useUserBTCWithdrawAddress(principal: string | undefined) {
  const address = useAppSelector((state) => state.wallet.ckBTCAddresses)[`${principal}_withdraw`];
  if (!address) return undefined;
  const { owner, subaccount } = JSON.parse(address) as { owner: string; subaccount: number[] | undefined };

  return {
    owner,
    subaccount: subaccount && subaccount.length > 0 ? [Uint8Array.from(subaccount)] : [],
  };
}

export function useUpdateUserBTCDepositAddress() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, address: string) => {
      dispatch(updateCK_BTCAddresses({ principal, address, type: "deposit" }));
    },
    [dispatch],
  );
}

export function useUpdateUserBTCWithdrawAddress() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, owner: Principal, subaccount: Uint8Array[] | []) => {
      const address = JSON.stringify({ owner: owner.toString(), subaccount: [...(subaccount[0] ?? [])] });
      dispatch(updateCK_BTCAddresses({ principal, address, type: "withdraw" }));
    },
    [dispatch],
  );
}

export function useUpdateUserTx() {
  const dispatch = useAppDispatch();

  return useCallback(
    (principal: string, block_index: bigint, status: undefined | RetrieveBtcStatus, value: string | undefined) => {
      const txid = status ? Object.values(status)[0]?.txid : undefined;
      const txIdString = txid ? toHexString([...txid].reverse()) : "";

      dispatch(
        updateRetrieveState({
          principal,
          block_index: Number(block_index),
          txid: txIdString,
          state: (status ? Object.keys(status)[0] : "") as TxState,
          value: value ?? "",
        }),
      );
    },
    [dispatch],
  );
}

export function useUserTxs(principal: string | undefined) {
  const states = useAppSelector((state) => state.wallet.retrieveState);

  return useMemo(() => {
    if (principal && states) {
      return states[principal];
    }

    return undefined;
  }, [principal, states]);
}
