import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { TokenMetadata } from "types/token";
import store from "store/index";
import { TOKEN_STANDARD } from "constants/tokens";
import { ICP } from "@icpswap/tokens";
import { registerTokens } from "@icpswap/token-adapter";
import { updateTokenStandard, updateImportedToken, updateAllTokenIds } from "./actions";

export function useUpdateTokenStandard() {
  const dispatch = useAppDispatch();

  return useCallback(
    ({ canisterId, standard }: { canisterId: string; standard: TOKEN_STANDARD }) => {
      if (canisterId) {
        // Register icp as icrc2 token
        if (canisterId === ICP.address) {
          dispatch(updateTokenStandard({ canisterId, standard: TOKEN_STANDARD.ICRC2 }));
          registerTokens({ canisterIds: [canisterId], standard: TOKEN_STANDARD.ICRC2 });
          // Register usdc as icrc2 token
        } else if (canisterId === "xevnm-gaaaa-aaaar-qafnq-cai" || canisterId === "yfumr-cyaaa-aaaar-qaela-cai") {
          dispatch(updateTokenStandard({ canisterId, standard: TOKEN_STANDARD.ICRC2 }));
          registerTokens({ canisterIds: [canisterId], standard: TOKEN_STANDARD.ICRC2 });
        } else {
          dispatch(updateTokenStandard({ canisterId, standard }));
          registerTokens({ canisterIds: [canisterId], standard });
        }

        dispatch(updateAllTokenIds(canisterId));
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

export function useAllTokenIds() {
  return useAppSelector((state) => state.tokenCache.allTokenIds);
}
