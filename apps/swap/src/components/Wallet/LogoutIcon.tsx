import { Box } from "components/Mui";
import { useWalletStore } from "components/Wallet/store";
import { useCallback } from "react";

export function LogoutIcon() {
  const { setLogoutConfirmOpen } = useWalletStore();

  const handleLogout = useCallback(() => {
    setLogoutConfirmOpen(true);
  }, [setLogoutConfirmOpen]);

  return (
    <Box sx={{ width: "36px", height: "36px", cursor: "pointer" }} onClick={handleLogout}>
      <img width="36px" height="36px" src="/images/wallet/logout.svg" alt="" />
    </Box>
  );
}
