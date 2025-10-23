import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { useWalletTokenContext } from "components/Wallet/token/context";

interface RemoveItemProps {
  tokenId: string;
  isLast?: boolean;
  onRemoveClick?: () => void;
}

export function RemoveItem({ tokenId, isLast, onRemoveClick }: RemoveItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setRemoveTokenId } = useWalletTokenContext();

  const handleRemoveToken = useCallback(() => {
    setRemoveTokenId(tokenId);
    if (onRemoveClick) {
      onRemoveClick();
    }
  }, [setRemoveTokenId, tokenId, onRemoveClick]);

  return (
    <MenuItem
      value="Remove"
      label={t("common.remove")}
      onMenuClick={handleRemoveToken}
      background={theme.palette.background.level3}
      activeBackground={theme.palette.background.level1}
      height="36px"
      padding="0 16px"
      isLast={isLast}
      rightIcon={<img width="20px" height="20px" src="/images/wallet/remove.svg" alt="" />}
      labelColor="#D3625B"
    />
  );
}
