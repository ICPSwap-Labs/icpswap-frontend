import { Box } from "components/Mui";
import { useCallback } from "react";
import { useWalletContext } from "components/Wallet/context";

export function LogoutIcon() {
  const { setLogoutConfirmOpen } = useWalletContext();

  const handleLogout = useCallback(() => {
    setLogoutConfirmOpen(true);
  }, [setLogoutConfirmOpen]);

  return (
    <Box sx={{ width: "36px", height: "36px", cursor: "pointer" }} onClick={handleLogout}>
      <img width="36px" height="36px" src="/images/wallet/logout.svg" alt="" />
    </Box>
  );
}
