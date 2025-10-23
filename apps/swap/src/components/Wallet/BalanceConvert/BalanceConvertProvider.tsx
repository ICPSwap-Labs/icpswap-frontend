import { useState, useCallback, ReactNode } from "react";
import { ConvertToIcp } from "components/Wallet/context";
import { BalanceConvertContext } from "components/Wallet/BalanceConvert/context";

interface BalanceConvertProviderProps {
  children: ReactNode;
}

export function BalanceConvertProvider({ children }: BalanceConvertProviderProps) {
  const [tokensConvertToSwap, setTokensConvertToIcp] = useState<Array<ConvertToIcp> | undefined>(undefined);
  const [convertedTokenIds, setConvertedTokenIds] = useState<string[]>([]);
  const [convertLoading, setConvertLoading] = useState<boolean>(false);
  const [checkedConvertTokenIds, setCheckedConvertTokenIds] = useState<string[]>([]);

  const handleUpdateConvertedTokenIds = useCallback(
    (tokenIds: string[], clear?: boolean) => {
      if (clear) {
        setConvertedTokenIds([]);
        return;
      }

      setConvertedTokenIds((prevState) => {
        return [...new Set([...prevState, ...tokenIds])];
      });
    },
    [setConvertedTokenIds],
  );

  return (
    <BalanceConvertContext.Provider
      value={{
        tokensConvertToSwap,
        setTokensConvertToIcp,
        convertedTokenIds,
        setConvertedTokenIds: handleUpdateConvertedTokenIds,
        convertLoading,
        setConvertLoading,
        checkedConvertTokenIds,
        setCheckedConvertTokenIds,
      }}
    >
      {children}
    </BalanceConvertContext.Provider>
  );
}
