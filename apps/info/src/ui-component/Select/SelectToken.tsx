import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select, type MenuProps, TokenImage } from "ui-component/index";
import { isValidPrincipal } from "@icpswap/utils";
import { useTokenInfo } from "hooks/token/index";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { useAllTokensOfSwap } from "@icpswap/hooks";

interface TokenMenuItemProps {
  tokenInfo: AllTokenOfSwapTokenInfo;
  search?: string;
}

function isTokenHide(tokenInfo: AllTokenOfSwapTokenInfo, search: string | undefined) {
  if (!!search && isValidPrincipal(search) && tokenInfo.ledger_id.toString() !== search) return true;
  if (
    !!search &&
    !!tokenInfo &&
    !tokenInfo.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
    !tokenInfo.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )
    return true;
  return false;
}

function TokenMenuItem({ tokenInfo }: TokenMenuItemProps) {
  const { result: token } = useTokenInfo(tokenInfo.ledger_id.toString());

  return (
    <Box sx={{ display: "flex", gap: "0 8px" }}>
      <TokenImage size="20px" logo={token?.logo} tokenId={tokenInfo.ledger_id.toString()} />
      <Typography>{tokenInfo.symbol ?? "--"}</Typography>
    </Box>
  );
}

export interface SelectTokenProps {
  value?: string;
  onTokenChange?: (tokenId: string) => void;
  filter?: (tokenInfo: AllTokenOfSwapTokenInfo) => boolean;
}

export function SelectToken({ value: tokenId, onTokenChange, filter }: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { result: allTokens } = useAllTokensOfSwap();

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    if (!allTokens) return [];

    return allTokens.map((tokenInfo) => {
      return {
        value: tokenInfo.ledger_id.toString(),
        label: <TokenMenuItem tokenInfo={tokenInfo} />,
        additional: JSON.stringify(tokenInfo),
      };
    });
  }, [allTokens]);

  const handleValueChange = (value: string) => {
    setValue(value);

    if (onTokenChange) {
      onTokenChange(value);
    }
  };

  const handleSearchChange = (value: string | undefined) => {
    setSearch(value);
  };

  const handleFilterMenu = (menu: MenuProps) => {
    if (!menu.additional) return false;

    const tokenInfo = JSON.parse(menu.additional) as AllTokenOfSwapTokenInfo;

    return isTokenHide(tokenInfo, search) || (!!filter && filter(tokenInfo));
  };

  return (
    <Select
      placeholder="Select a token"
      menus={menus}
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
      search
      onSearch={handleSearchChange}
      menuFilter={handleFilterMenu}
    />
  );
}
