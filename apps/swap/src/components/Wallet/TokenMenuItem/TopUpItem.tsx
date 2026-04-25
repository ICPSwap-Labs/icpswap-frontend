import { MenuItem } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useWalletStore } from "components/Wallet/store";
import { useWalletTokenStore } from "components/Wallet/token/store";
import { useCallback } from "react";

export function TopUpItem() {
  const theme = useTheme();
  const { setOpen } = useWalletStore();
  const { setXTCTopUpShow } = useWalletTokenStore();

  const handleTopUp = useCallback(() => {
    setOpen(false);
    setXTCTopUpShow(true);
  }, [setOpen, setXTCTopUpShow]);

  return (
    <MenuItem
      value="Top-up"
      label="Top-up"
      onMenuClick={handleTopUp}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      rightIcon={<img width="20px" height="20px" src="/images/wallet/top_up.svg" alt="" />}
    />
  );
}
