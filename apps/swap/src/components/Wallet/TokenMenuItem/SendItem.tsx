import { MenuItem } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useWalletTokenContext } from "components/Wallet/token/context";
import { useToken } from "hooks/index";
import { useCallback } from "react";

interface TokenSendItemProps {
  tokenId: string;
}

export function TokenSendItem({ tokenId }: TokenSendItemProps) {
  const theme = useTheme();
  const { setPages } = useWalletContext();
  const { setSendToken } = useWalletTokenContext();
  const [, token] = useToken(tokenId);

  const handleSend = useCallback(() => {
    if (token) {
      setPages(WalletManagerPage.Send, false);
      setSendToken(token);
    }
  }, [setPages, tokenId, token]);

  return (
    <MenuItem
      value="Send"
      label="Send"
      onMenuClick={handleSend}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      rightIcon={<img width="20px" height="20px" src="/images/wallet/send.svg" alt="" />}
    />
  );
}
