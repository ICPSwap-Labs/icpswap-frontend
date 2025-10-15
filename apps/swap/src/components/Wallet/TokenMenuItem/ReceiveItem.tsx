import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";

interface TokenReceiveItemProps {
  tokenId: string;
}

export function TokenReceiveItem({ tokenId }: TokenReceiveItemProps) {
  const theme = useTheme();
  const { setPages, setTokenReceiveId } = useWalletContext();

  const handleReceive = useCallback(() => {
    setPages(WalletManagerPage.Receive, false);
    setTokenReceiveId(tokenId);
  }, [setPages, tokenId]);

  return (
    <MenuItem
      value="Receive"
      label="Receive"
      onMenuClick={handleReceive}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      rightIcon={<img width="20px" height="20px" src="/images/wallet/receive.svg" alt="" />}
    />
  );
}
