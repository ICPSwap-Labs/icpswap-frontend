import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type DesignVersion = "classic" | "modern";

export const DESIGN_VERSION_STORAGE_KEY = "icswap.design.version";

function readDesignVersion(): DesignVersion {
  try {
    return window.localStorage.getItem(DESIGN_VERSION_STORAGE_KEY) === "classic" ? "classic" : "modern";
  } catch {
    return "modern";
  }
}

const DesignVersionContext = createContext<{
  designVersion: DesignVersion;
  setDesignVersion: (version: DesignVersion) => void;
  isClassicDesign: boolean;
} | null>(null);

export function DesignVersionProvider({ children }: { children: ReactNode }) {
  const [designVersion, setVersion] = useState<DesignVersion>(readDesignVersion);

  const setDesignVersion = useCallback((version: DesignVersion) => {
    setVersion(version);
    try {
      window.localStorage.setItem(DESIGN_VERSION_STORAGE_KEY, version);
    } catch {
      // Switching still works when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === DESIGN_VERSION_STORAGE_KEY || event.key === null) {
        setVersion(readDesignVersion());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({ designVersion, setDesignVersion, isClassicDesign: designVersion === "classic" }),
    [designVersion, setDesignVersion],
  );

  return <DesignVersionContext.Provider value={value}>{children}</DesignVersionContext.Provider>;
}

export function useDesignVersion() {
  const context = useContext(DesignVersionContext);
  if (!context) throw new Error("useDesignVersion must be used inside DesignVersionProvider");
  return context;
}
