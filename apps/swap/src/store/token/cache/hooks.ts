import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import store from "store/index";
import { TOKEN_STANDARD } from "constants/tokens";
import { ICP } from "@icpswap/tokens";
import { registerTokens, tokenAdapter } from "@icpswap/token-adapter";
import { Null } from "@icpswap/types";

import { updateTokenStandards } from "./actions";

interface useUpdateTokenStandardProps {
  canisterId: string;
  standard: TOKEN_STANDARD;
}

export function useUpdateTokenStandard() {
  const dispatch = useAppDispatch();

  return useCallback(
    (standards: useUpdateTokenStandardProps[]) => {
      const __standards = standards.map(({ standard, canisterId }) => {
        // Register icp as icrc2 token
        if (canisterId === ICP.address) {
          return { canisterId, standard: TOKEN_STANDARD.ICRC2 };
          // Register usdc as icrc2 token
        }

        if (
          canisterId === "xevnm-gaaaa-aaaar-qafnq-cai" ||
          canisterId === "yfumr-cyaaa-aaaar-qaela-cai" ||
          canisterId === "vgqnj-miaaa-aaaal-qaapa-cai"
        ) {
          return { canisterId, standard: TOKEN_STANDARD.ICRC2 };
        }

        if (canisterId === "qfr6e-biaaa-aaaak-qafuq-cai") {
          return { canisterId, standard: TOKEN_STANDARD.ICRC1 };
        }

        return { canisterId, standard };
      });

      dispatch(updateTokenStandards(__standards));
      registerTokens(__standards);
    },
    [dispatch],
  );
}

export function useTokenStandard(canisterId: string | Null) {
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

export function useTokenStandards() {
  return useAppSelector((state) => state.tokenCache.standards);
}

export function useAllTokenIds() {
  return useAppSelector((state) => state.tokenCache.allTokenIds);
}

export function useTokenStandardIsRegistered(canisterId: string) {
  const standards = tokenAdapter.getAll();
  const canisterIds = [...standards.keys()];

  return useMemo(() => {
    if (canisterId === "ICP" || canisterId === "aaaaa-aa") return true;
    return canisterIds.includes(canisterId);
  }, [canisterId, canisterIds]);
}
