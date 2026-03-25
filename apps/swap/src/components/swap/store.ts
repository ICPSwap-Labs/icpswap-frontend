import type { Pool, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { create } from "zustand";

export interface SwapStoreProps {
  poolId: string | Null;
  setPoolId: (poolId: string) => void;
  selectedPool: Pool | Null;
  setSelectedPool: (pool: Pool) => void;
  cachedPool: Pool | Null;
  setCachedPool: (pool: Pool) => void;
  inputToken: Token | Null;
  setInputToken: (token: Token | Null) => void;
  outputToken: Token | Null;
  setOutputToken: (token: Token | Null) => void;
  noLiquidity: boolean | Null;
  setNoLiquidity: (noLiquidity: boolean | Null) => void;
  unavailableBalanceKeys: string[];
  setUnavailableBalanceKey: (key: string) => void;
  removeUnavailableBalanceKey: (key: string) => void;
  usdValueChange: string | null;
  setUSDValueChange: (change: string | null) => void;
}

export const useSwapStore = create<SwapStoreProps>((set) => ({
  poolId: undefined,
  setPoolId: (poolId: string) => set(() => ({ poolId })),
  selectedPool: undefined,
  setSelectedPool: (pool: Pool) => set(() => ({ selectedPool: pool })),
  cachedPool: undefined,
  setCachedPool: (pool: Pool) => set(() => ({ cachedPool: pool })),
  inputToken: undefined,
  setInputToken: (token: Token | Null) => set(() => ({ inputToken: token })),
  outputToken: undefined,
  setOutputToken: (token: Token | Null) => set(() => ({ outputToken: token })),
  noLiquidity: undefined,
  setNoLiquidity: (noLiquidity: boolean | Null) => set(() => ({ noLiquidity })),
  unavailableBalanceKeys: [],
  setUnavailableBalanceKey: (key: string) =>
    set((state) => ({ unavailableBalanceKeys: [...new Set([...state.unavailableBalanceKeys, key])] })),
  removeUnavailableBalanceKey: (key: string) =>
    set((state) => {
      const newKeys = [...state.unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      return { unavailableBalanceKeys: newKeys };
    }),
  usdValueChange: null,
  setUSDValueChange: (change: string | null) => set(() => ({ usdValueChange: change })),
}));
