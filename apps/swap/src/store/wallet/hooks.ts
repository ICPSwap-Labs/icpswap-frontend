import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { RetrieveBtcStatus, TxState } from "types/ckBTC";
import { Principal } from "@dfinity/principal";
import { SortBalanceEnum, WalletSortType } from "types/index";
import { DISPLAY_IN_WALLET_BY_DEFAULT } from "constants/wallet";
import {
  updateTaggedTokens,
  deleteTaggedTokens,
  updateCK_BTCAddresses,
  updateRetrieveState,
  updateWalletSortType,
  updateSortBalance,
  updateHideSmallBalance,
  updateRemovedWalletDefaultTokens,
} from "store/wallet/actions";

export function toHexString(byteArray: number[]) {
  return Array.from(byteArray, (byte) => {
    return `0${(byte & 0xff).toString(16)}`.slice(-2);
  }).join("");
}

export function useRemovedWalletDefaultTokens() {
  return useAppSelector((state) => state.wallet.removedWalletDefaultTokens);
}

export function useRemovedWalletDefaultTokensManager(): [string[], (tokenId: string, add?: boolean) => void] {
  const dispatch = useAppDispatch();
  const removedWalletDefaultTokens = useRemovedWalletDefaultTokens();

  const callback = useCallback(
    (token: string, add?: boolean) => {
      dispatch(updateRemovedWalletDefaultTokens({ tokenId: token, add }));
    },
    [dispatch],
  );

  return useMemo(() => [removedWalletDefaultTokens, callback], [removedWalletDefaultTokens, callback]);
}

export function useDisplayedTokensInWallet() {
  const removedWalletDefaultTokens = useRemovedWalletDefaultTokens();

  return useMemo(() => {
    return DISPLAY_IN_WALLET_BY_DEFAULT.filter((tokenId) => !removedWalletDefaultTokens.includes(tokenId));
  }, [removedWalletDefaultTokens, DISPLAY_IN_WALLET_BY_DEFAULT]);
}

export function useTaggedTokens() {
  const taggedTokens = useAppSelector((state) => state.wallet.taggedTokens);
  const displayedWalletDefaultTokens = useDisplayedTokensInWallet();

  return useMemo(() => {
    return [...new Set([...displayedWalletDefaultTokens, ...taggedTokens])];
  }, [taggedTokens, displayedWalletDefaultTokens]);
}

export function useUpdateTaggedTokenCallback() {
  const dispatch = useAppDispatch();
  const [, removedWalletDefaultTokens] = useRemovedWalletDefaultTokensManager();

  return useCallback(
    (tokens: string[]) => {
      dispatch(updateTaggedTokens(tokens));

      tokens.forEach((token) => {
        if (DISPLAY_IN_WALLET_BY_DEFAULT.includes(token)) {
          removedWalletDefaultTokens(token, true);
        }
      });
    },
    [dispatch],
  );
}

export function useDeleteTaggedTokenCallback() {
  const dispatch = useAppDispatch();
  const [, removedWalletDefaultTokens] = useRemovedWalletDefaultTokensManager();

  return useCallback(
    (tokens: string[]) => {
      dispatch(deleteTaggedTokens(tokens));

      tokens.forEach((token) => {
        if (DISPLAY_IN_WALLET_BY_DEFAULT.includes(token)) {
          removedWalletDefaultTokens(token, false);
        }
      });
    },
    [dispatch],
  );
}

export function useTaggedTokenManager() {
  const taggedTokens = useTaggedTokens();

  const updateTaggedTokens = useUpdateTaggedTokenCallback();
  const deleteTaggedTokens = useDeleteTaggedTokenCallback();

  return useMemo(
    () => ({ taggedTokens, updateTaggedTokens, deleteTaggedTokens }),
    [taggedTokens, updateTaggedTokens, deleteTaggedTokens],
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

export function useWalletSortType() {
  return useAppSelector((state) => state.wallet.sort);
}

export function useWalletSortManager() {
  const sortType = useWalletSortType();
  const dispatch = useAppDispatch();

  const update = useCallback(
    (val: WalletSortType) => {
      dispatch(updateWalletSortType(val));
    },
    [dispatch],
  );

  return useMemo(() => ({ sort: sortType, updateWalletSortType: update }), [update, sortType]);
}

export function useSortBalanceValue() {
  return useAppSelector((state) => state.wallet.sortBalance);
}

export function useSortBalanceManager() {
  const sortBalance = useSortBalanceValue();
  const dispatch = useAppDispatch();

  const update = useCallback(
    (val: SortBalanceEnum) => {
      dispatch(updateSortBalance(val));
    },
    [dispatch],
  );

  return useMemo(() => ({ sortBalance, updateSortBalance: update }), [update, sortBalance]);
}

export function useHideSmallBalanceManager(): [boolean, (hidden: boolean) => void] {
  const dispatch = useAppDispatch();
  const hideSmallBalance = useAppSelector((state) => state.wallet.hideSmallBalance);

  const callback = useCallback(
    (hidden: boolean) => {
      dispatch(updateHideSmallBalance(hidden));
    },
    [dispatch, updateHideSmallBalance],
  );

  return useMemo(() => [hideSmallBalance, callback], [hideSmallBalance, callback]);
}
