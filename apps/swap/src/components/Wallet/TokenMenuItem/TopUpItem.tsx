import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { useWalletContext } from "components/Wallet/context";
import { useWalletTokenContext } from "components/Wallet/token/context";

interface TopUpItemProps {
  tokenId: string;
}

export function TopUpItem({ tokenId }: TopUpItemProps) {
  const theme = useTheme();
  const { setOpen } = useWalletContext();
  const { setXTCTopUpShow } = useWalletTokenContext();

  const handleTopUp = useCallback(() => {
    setOpen(false);
    setXTCTopUpShow(true);
  }, [tokenId]);

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
