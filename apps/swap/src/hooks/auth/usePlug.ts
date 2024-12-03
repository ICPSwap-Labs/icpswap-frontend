import { useEffect } from "react";
import { useCleanLogState } from "store/auth/hooks";

export function usePlugExternalDisconnect() {
  const cleanLogState = useCleanLogState();

  useEffect(() => {
    if (window.ic && window.ic.plug) {
      if (window.ic.plug.onExternalDisconnect) {
        window.ic.plug.onExternalDisconnect(() => {
          // Do not use useUserLogout, logout will exec window.ic.plug.onExternalDisconnect, and case a Loop execution
          cleanLogState();
        });
      }

      if (window.ic.plug.onLockStateChange)
        window.ic.plug.onLockStateChange((isLocked) => {
          if (isLocked) {
            cleanLogState();
          }
        });
    }
  }, []);
}
