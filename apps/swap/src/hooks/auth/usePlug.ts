import { useEffect } from "react";
import { useUserLogout } from "store/auth/hooks";

export function usePlugExternalDisconnect() {
  const logout = useUserLogout();

  useEffect(() => {
    if (window.ic.plug) {
      if (window.ic.plug.onExternalDisconnect) window.ic.plug.onExternalDisconnect(logout);
      if (window.ic.plug.onLockStateChange)
        window.ic.plug.onLockStateChange((isLocked) => {
          if (isLocked) {
            logout();
          }
        });
    }
  }, []);
}
