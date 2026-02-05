import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { BitcoinTx } from "types/ckBTC";
import { Principal } from "@dfinity/principal";
import { SortBalanceEnum, WalletSortType } from "types/index";
import { DISPLAY_IN_WALLET_BY_DEFAULT } from "constants/wallet";
import {
  updateTaggedTokens,
  deleteTaggedTokens,
  updateCK_BTCAddresses,
  updateBitcoinDissolveTxs,
  updateWalletSortType,
  updateSortBalance,
  updateHideSmallBalance,
  updateRemovedWalletDefaultTokens,
  updateHideZeroNFT,
  updateSortedTokens,
} from "store/wallet/actions";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useBitcoinBlockNumber } from "hooks/ck-bridge";
import { isBitcoinDissolveEnded } from "utils/web3/ck-bridge";

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

export function useBitcoinDissolveTxsManager() {
  const dispatch = useAppDispatch();
  const principal = useAccountPrincipalString();

  return useCallback(
    (tx: BitcoinTx) => {
      if (isUndefinedOrNull(principal)) return;
      dispatch(updateBitcoinDissolveTxs(tx));
    },
    [dispatch, principal],
  );
}

export function useBitcoinDissolveTxs() {
  const allDissolveTxs = useAppSelector((state) => state.wallet.bitcoinDissolveTxs);
  const principal = useAccountPrincipalString();

  return useMemo(() => {
    if (isUndefinedOrNull(allDissolveTxs) || isUndefinedOrNull(principal)) return undefined;
    return allDissolveTxs.filter((tx) => tx.principal === principal);
  }, [principal, allDissolveTxs]);
}

export function useBitcoinDissolveTx(hash: string | undefined) {
  const allDissolveTxs = useBitcoinDissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(allDissolveTxs) || isUndefinedOrNull(hash)) return undefined;

    return allDissolveTxs.find((tx) => tx.txid === hash);
  }, [allDissolveTxs, hash]);
}

export function useBTCDissolveUnFinalizedTxs() {
  const block = useBitcoinBlockNumber();
  const dissolveTxs = useBitcoinDissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(block) || isUndefinedOrNull(dissolveTxs)) return undefined;

    return dissolveTxs.filter((tx) => {
      return !isBitcoinDissolveEnded(tx.state);
    });
  }, [dissolveTxs, block]);
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

export function useHideZeroNFTManager(): [boolean, (hidden: boolean) => void] {
  const dispatch = useAppDispatch();
  const hideZeroNFT = useAppSelector((state) => state.wallet.hideZeroNFT);

  const callback = useCallback(
    (hidden: boolean) => {
      dispatch(updateHideZeroNFT(hidden));
    },
    [dispatch],
  );

  return useMemo(() => [hideZeroNFT, callback], [hideZeroNFT, callback]);
}

export function useSortedTokensManager(): [string[], (tokenIds: string[]) => void, (tokenIds: string[]) => void] {
  const sortedTokens = useAppSelector((state) => state.wallet.sortedTokens);
  const dispatch = useAppDispatch();

  const __updateSortedTokens = useCallback(
    (tokenIds: string[]) => {
      dispatch(updateSortedTokens([...new Set([...sortedTokens, ...tokenIds])]));
    },
    [dispatch, sortedTokens],
  );

  const __deleteSortedTokens = useCallback(
    (tokenIds: string[]) => {
      const newSortedTokens = sortedTokens.filter((id) => !tokenIds.includes(id));
      dispatch(updateSortedTokens(newSortedTokens));
    },
    [dispatch, sortedTokens],
  );

  return useMemo(
    () => [sortedTokens, __updateSortedTokens, __deleteSortedTokens],
    [sortedTokens, __updateSortedTokens, __deleteSortedTokens],
  );
}
