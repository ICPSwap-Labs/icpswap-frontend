import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  saveWalletCacheToken,
  deleteWalletCatchToken,
  updateHideSmallBalance,
  updateCK_BTCAddresses,
  updateRetrieveState,
} from "./actions";
import { useCacheTokenList } from "store/global/hooks";
import { useImportedTokens } from "store/token/cache/hooks";
import { RetrieveBtcStatus, TxState } from "types/ckBTC";
import { Principal } from "@dfinity/principal";

export function toHexString(byteArray: number[]) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function fromHexString(hex: string) {
  if (hex.substr(0, 2) === "0x") hex = hex.substr(2);
  for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function useWalletCatchTokenIds() {
  return useAppSelector((state) => state.wallet.cacheTokenIds);
}

export function useWalletTokens() {
  const globalCacheTokenList = useCacheTokenList();
  const importedTokens = useImportedTokens();
  const cacheTokenIds = useWalletCatchTokenIds() ?? [];

  let tokens = [];

  for (let i = 0; i < cacheTokenIds.length; i++) {
    const tokenId = cacheTokenIds[i];
    const token = globalCacheTokenList.filter((token) => token.canisterId?.toString() === tokenId)[0];

    if (token) {
      tokens.push(token);
    } else {
      if (!!importedTokens[tokenId]) {
        tokens.push(importedTokens[tokenId]);
      }
    }
  }

  return tokens;
}

export function useWalletTokenCanisterIds() {
  const globalCacheTokenList = useCacheTokenList();
  const importedTokens = useImportedTokens();
  const cacheTokenIds = useWalletCatchTokenIds() ?? [];

  let tokens = [];

  for (let i = 0; i < cacheTokenIds.length; i++) {
    const tokenId = cacheTokenIds[i];
    const token = globalCacheTokenList.filter((token) => token.canisterId?.toString() === tokenId)[0];

    if (token) {
      tokens.push(token);
    } else {
      if (!!importedTokens[tokenId]) {
        tokens.push(importedTokens[tokenId]);
      }
    }
  }

  return tokens;
}

export function useSaveCacheTokenCallback() {
  const dispatch = useAppDispatch();

  return useCallback(
    (cacheTokens) => {
      dispatch(saveWalletCacheToken(cacheTokens));
    },
    [dispatch],
  );
}

export function useDeleteCacheTokenCallback() {
  const dispatch = useAppDispatch();

  return useCallback(
    (cacheTokens) => {
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
    owner: owner,
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
      const txIdString = !!txid ? toHexString([...txid].reverse()) : "";

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
