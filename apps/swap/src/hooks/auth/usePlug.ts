import { useEffect } from "react";
import { useUserLogout } from "store/auth/hooks";

export function usePlugExternalDisconnect() {
  const logout = useUserLogout();

  useEffect(() => {
    window.ic.plug.onExternalDisconnect(logout);
    window.ic.plug.onLockStateChange((isLocked) => {
      if (isLocked) {
        logout();
      }
    });
  }, []);
}
