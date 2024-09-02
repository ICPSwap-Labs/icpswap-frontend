import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import store from "store/index";
import { TOKEN_STANDARD, tokenAdapter } from "@icpswap/token-adapter";
import { updateTokenStandard, updateTokenCapId } from "./actions";

export function useUpdateTokenStandards() {
  const dispatch = useAppDispatch();

  return useCallback(
    ({ canisterId, standard }: { canisterId: string; standard: TOKEN_STANDARD }) => {
      if (canisterId) {
        dispatch(updateTokenStandard({ canisterId, standard }));
      }
    },
    [dispatch],
  );
}

export function useTokenStandards() {
  return useAppSelector((state) => state.tokenCache.standards);
}

export function useTokenStandardIsRegistered(canisterId: string) {
  const standards = tokenAdapter.getAll();
  const canisterIds = [...standards.keys()];

  return useMemo(() => {
    if (canisterId === "ICP" || canisterId === "aaaaa-aa") return true;
    return canisterIds.includes(canisterId);
  }, [canisterId, canisterIds]);
}

export function useTokenStandard(canisterId: string | undefined) {
  const standards = useAppSelector((state) => state.tokenCache.standards);

  return useMemo(() => {
    if (canisterId) {
      return standards[canisterId];
    }
  }, [canisterId, standards]);
}

export function getTokenStandard(canisterId: string | undefined) {
  const {
    tokenCache: { standards },
  } = store.getState();

  if (canisterId) {
    return standards[canisterId];
  }
}

export function useUpdateTokenCapId() {
  const dispatch = useAppDispatch();

  return useCallback(
    ({ canisterId, capId }: { canisterId: string; capId: string }) => {
      if (canisterId) {
        dispatch(updateTokenCapId({ canisterId, capId }));
      }
    },
    [dispatch],
  );
}

export function useStateTokenCapId(canisterId: string | undefined) {
  const caps = useAppSelector((state) => state.tokenCache.caps);

  return useMemo(() => {
    if (!canisterId) return undefined;
    return caps[canisterId] === "xxxxx" ? undefined : caps[canisterId];
  }, [caps, canisterId]);
}
