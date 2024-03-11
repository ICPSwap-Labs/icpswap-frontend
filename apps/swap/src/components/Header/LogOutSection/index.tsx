import { useState, ReactNode } from "react";
import { Box } from "@mui/material";
import LogoutConfirmModal from "./Confirm";
import { useUserLogout } from "store/auth/hooks";

export default function LogOutSection({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const logout = useUserLogout();

  const onLogoutConfirm = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <>
      <Box onClick={() => setLogoutConfirmOpen(true)}>{children}</Box>
      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onConfirm={onLogoutConfirm}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </>
  );
}
