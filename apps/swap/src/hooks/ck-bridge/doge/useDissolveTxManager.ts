import { isUndefinedOrNull } from "@icpswap/utils";
import { useCallback, useEffect, useMemo } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { cleanDogeDissolveTxs, updateDogeDissolveTxs } from "store/wallet/actions";
import { type DogeDissolveTx, DogeDissolveTxState } from "types/chain-key";
import { isDogeDissolveEnded } from "utils/chain-key/doge";

export function useUpdateDissolveTx() {
  const dispatch = useAppDispatch();
  const principal = useAccountPrincipalString();

  return useCallback(
    async ({ block, amount }: { block: string; amount: string }) => {
      if (!principal) return;

      const tx: DogeDissolveTx = {
        principal,
        txid: undefined,
        value: amount,
        id: crypto.randomUUID(),
        block_index: block.toString(),
        state: DogeDissolveTxState.Pending,
      };

      dispatch(updateDogeDissolveTxs(tx));
    },
    [principal, dispatch],
  );
}

export function useDissolveTxManager() {
  const dispatch = useAppDispatch();
  const principal = useAccountPrincipalString();

  return useCallback(
    async (tx: DogeDissolveTx) => {
      if (!principal) return;
      dispatch(updateDogeDissolveTxs(tx));
    },
    [principal, dispatch],
  );
}

export function useDogeDissolveTxs() {
  const allDissolveTxs = useAppSelector((state) => state.wallet.dogeDissolveTxs);
  const principal = useAccountPrincipalString();

  return useMemo(() => {
    if (isUndefinedOrNull(allDissolveTxs) || isUndefinedOrNull(principal)) return undefined;

    return allDissolveTxs.filter((tx) => tx.principal === principal);
  }, [principal, allDissolveTxs]);
}

export function useDogeDissolveTx(hash: string | undefined) {
  const allDissolveTxs = useDogeDissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(allDissolveTxs) || isUndefinedOrNull(hash)) return undefined;

    return allDissolveTxs.find((tx) => tx.txid === hash);
  }, [allDissolveTxs, hash]);
}

export function useDogeUnFinalizedDissolveTxs() {
  const dissolveTxs = useDogeDissolveTxs();

  return useMemo(() => {
    if (isUndefinedOrNull(dissolveTxs)) return undefined;

    return dissolveTxs.filter((tx) => {
      return !isDogeDissolveEnded(tx.state);
    });
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- stringify array dependency to stop hook loop
  }, [JSON.stringify(dissolveTxs)]);
}

export function useCleanDogeDissolveTxs() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(cleanDogeDissolveTxs());
  }, [dispatch]);
}
