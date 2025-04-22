import { useEffect } from "react";
import { useLogout, getConnector } from "store/auth/hooks";
import { Connector } from "constants/wallet";

export function usePlugExternalDisconnect() {
  const cleanLogState = useLogout();

  useEffect(() => {
    if (window.ic && window.ic.plug) {
      if (window.ic.plug.onExternalDisconnect) {
        window.ic.plug.onExternalDisconnect(() => {
          const connector = getConnector();

          if (connector && connector === Connector.PLUG) {
            // Do not use useUserLogout, logout will exec window.ic.plug.onExternalDisconnect, and case a Loop execution
            cleanLogState();
          }
        });
      }

      if (window.ic.plug.onLockStateChange)
        window.ic.plug.onLockStateChange((isLocked) => {
          const connector = getConnector();
          if (connector && connector === Connector.PLUG) {
            if (isLocked) {
              cleanLogState();
            }
          }
        });
    }
  }, []);
}
