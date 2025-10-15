import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { ckUSDC, ICP } from "@icpswap/tokens";
import { useHistory } from "react-router-dom";
import { useWalletContext } from "components/Wallet/context";

interface SwapItemProps {
  tokenId: string;
}

export function SwapItem({ tokenId }: SwapItemProps) {
  const theme = useTheme();
  const history = useHistory();
  const { setOpen } = useWalletContext();

  const handleSwap = useCallback(() => {
    if (tokenId === ICP.address) {
      history.push(`/swap?input=${ICP.address}&output=${ckUSDC.address}`);
    } else {
      history.push(`/swap?input=${tokenId}&output=${ICP.address}`);
    }
    setOpen(false);
  }, [tokenId]);

  return (
    <MenuItem
      value="Swap"
      label="Swap"
      onMenuClick={handleSwap}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      isFirst
      rightIcon={<img width="20px" height="20px" src="/images/wallet/swap.svg" alt="" />}
    />
  );
}
