import { useCallback } from "react";
import { useTheme } from "components/Mui";
import { MenuItem } from "@icpswap/ui";
import { useTaggedTokenManager } from "store/wallet/hooks";

interface RemoveItemProps {
  tokenId: string;
  isLast?: boolean;
}

export function RemoveItem({ tokenId, isLast }: RemoveItemProps) {
  const theme = useTheme();
  const { deleteTaggedTokens } = useTaggedTokenManager();

  const handleRemoveToken = useCallback(() => {
    deleteTaggedTokens([tokenId]);
  }, [deleteTaggedTokens, tokenId]);

  return (
    <MenuItem
      value="Remove"
      label="Remove"
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
