import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { useNavigate } from "react-router-dom";
import { ckBridgeChain } from "@icpswap/constants";
import { useWalletContext } from "components/Wallet/context";

interface ConvertItemProps {
  tokenId: string;
}

export function ConvertItem({ tokenId }: ConvertItemProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { deleteTaggedTokens } = useTaggedTokenManager();
  const { closeDrawer } = useWalletContext();

  const handleConvert = useCallback(() => {
    navigate(`/ck-bridge?tokenId=${tokenId}&chain=${ckBridgeChain.icp}`);
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
