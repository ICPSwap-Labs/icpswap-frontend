import { GlobalContext } from "hooks/useGlobalContext";
import { useInitialTokenStandard } from "hooks/useInitialTokenStandard";
import { type ReactNode, useCallback, useState } from "react";

interface GlobalUpdaterProviderProps {
  children: ReactNode;
}

export function GlobalContextProvider({ children }: GlobalUpdaterProviderProps) {
  const [refreshTriggers, setRefreshTriggers] = useState<{ [key: string]: number }>({});

  const { AllPools } = useInitialTokenStandard();

  const handleRefreshTriggers = useCallback((key: string) => {
    setRefreshTriggers((prevState) => ({ ...prevState, [key]: (prevState[key] ?? 0) + 1 }));
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        AllPools,
        refreshTriggers,
        setRefreshTriggers: handleRefreshTriggers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
