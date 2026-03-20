import { BridgeChainType } from "@icpswap/constants";
import { MenuItem } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useWalletContext } from "components/Wallet/context";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTaggedTokenManager } from "store/wallet/hooks";

interface ConvertItemProps {
  tokenId: string;
}

export function ConvertItem({ tokenId }: ConvertItemProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { deleteTaggedTokens } = useTaggedTokenManager();
  const { closeDrawer } = useWalletContext();

  const handleConvert = useCallback(() => {
    navigate(`/ck-bridge?tokenId=${tokenId}&chainType=${BridgeChainType.icp}`);
    closeDrawer();
  }, [navigate, deleteTaggedTokens, tokenId, closeDrawer]);

  return (
    <MenuItem
      value="Convert"
      label="Convert"
      onMenuClick={handleConvert}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      rightIcon={<img width="20px" height="20px" src="/images/wallet/convert.svg" alt="" />}
    />
  );
}
