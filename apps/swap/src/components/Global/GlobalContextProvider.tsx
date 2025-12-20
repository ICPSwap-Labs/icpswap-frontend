import { ReactNode, useCallback, useState } from "react";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import { GlobalContext } from "hooks/useGlobalContext";
import { PublicTokenOverview, Null } from "@icpswap/types";

interface GlobalUpdaterProviderProps {
  children: ReactNode;
}

export function GlobalContextProvider({ children }: GlobalUpdaterProviderProps) {
  const [refreshTriggers, setRefreshTriggers] = useState<{ [key: string]: number }>({});
  const [infoAllTokens, setInfoAllTokens] = useState<PublicTokenOverview[] | Null>(null);

  const { AllPools } = useInitialTokenStandard();

  const handleRefreshTriggers = useCallback(
    (key: string) => {
      setRefreshTriggers((prevState) => ({ ...prevState, [key]: (prevState[key] ?? 0) + 1 }));
    },
    [setRefreshTriggers],
  );

  return (
    <GlobalContext.Provider
      value={{
        AllPools,
        refreshTriggers,
        setRefreshTriggers: handleRefreshTriggers,
        infoAllTokens,
        setInfoAllTokens,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
