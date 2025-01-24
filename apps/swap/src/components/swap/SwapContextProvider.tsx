import { useState, useCallback, ReactNode } from "react";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { SwapContext } from "components/swap/index";

interface SwapContextProviderProps {
  children: ReactNode;
}

export function SwapContextProvider({ children }: SwapContextProviderProps) {
  const [usdValueChange, setUSDValueChange] = useState<string | null>(null);
  const [poolId, setPoolId] = useState<string | Null>(null);
  // The value does not change to undefined if the pool is undefined.
  const [cachedPool, setCachedPool] = useState<Pool | Null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | Null>(null);
  const [inputToken, setInputToken] = useState<Token | Null>(null);
  const [outputToken, setOutputToken] = useState<Token | Null>(null);
  const [noLiquidity, setNoLiquidity] = useState<boolean | Null>(null);
  const [unavailableBalanceKeys, setUnavailableBalanceKeys] = useState<string[]>([]);

  const handleAddKeys = useCallback(
    (key: string) => {
      setUnavailableBalanceKeys((prevState) => [...new Set([...prevState, key])]);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  const handleRemoveKeys = useCallback(
    (key: string) => {
      const newKeys = [...unavailableBalanceKeys];
      newKeys.splice(newKeys.indexOf(key), 1);
      setUnavailableBalanceKeys(newKeys);
    },
    [unavailableBalanceKeys, setUnavailableBalanceKeys],
  );

  return (
    <SwapContext.Provider
      value={{
        poolId,
        setPoolId,
        cachedPool,
        setCachedPool,
        selectedPool,
        setSelectedPool,
        unavailableBalanceKeys,
        setUnavailableBalanceKey: handleAddKeys,
        removeUnavailableBalanceKey: handleRemoveKeys,
        usdValueChange,
        setUSDValueChange,
        setNoLiquidity,
        noLiquidity,
        inputToken,
        setInputToken,
        outputToken,
        setOutputToken,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
}
