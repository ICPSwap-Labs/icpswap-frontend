import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { updateTokenStandard, updateImportedToken } from "./actions";
import { TokenMetadata } from "types/token";
import store from "store/index";
import { ICP, TOKEN_STANDARD } from "constants/tokens";
import { registerTokens } from "@icpswap/token-adapter";

export function useUpdateTokenStandard() {
  const dispatch = useAppDispatch();

  return useCallback(
    ({ canisterId, standard }: { canisterId: string; standard: TOKEN_STANDARD }) => {
      if (canisterId) {
        // Register icp as icrc2 token
        if (canisterId === ICP.address) {
          dispatch(updateTokenStandard({ canisterId, standard: TOKEN_STANDARD.ICRC2 }));
          registerTokens({ canisterIds: [canisterId], standard: TOKEN_STANDARD.ICRC2 });
        } else {
          dispatch(updateTokenStandard({ canisterId, standard }));
          registerTokens({ canisterIds: [canisterId], standard });
        }
      }
    },
    [dispatch],
  );
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

export function useUpdateImportedToken() {
  const dispatch = useAppDispatch();

  return useCallback(
    (canisterId: string, metadata: TokenMetadata) => {
      dispatch(updateImportedToken({ canisterId, metadata }));
    },
    [dispatch],
  );
}

export function useImportedTokens() {
  return useAppSelector((state) => state.tokenCache.importedTokens);
}

export function useTokenStandards() {
  return useAppSelector((state) => state.tokenCache.standards);
}
