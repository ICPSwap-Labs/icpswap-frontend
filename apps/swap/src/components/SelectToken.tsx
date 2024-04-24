import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select, type MenuProps } from "components/Select/ForToken";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { isValidPrincipal } from "@icpswap/utils";
import { TokenImage } from "components/index";
import { useAllTokensOfSwap } from "@icpswap/hooks";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";

interface TokenMenuItemProps {
  tokenInfo: AllTokenOfSwapTokenInfo;
  symbol?: string;
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

function TokenMenuItem({ tokenInfo, symbol, search }: TokenMenuItemProps) {
  const hide = useMemo(() => {
    return isTokenHide(tokenInfo, search);
  }, [search, tokenInfo]);

  const { result: token } = useTokenInfo(tokenInfo.ledger_id.toString());

  return hide ? null : (
    <Box sx={{ display: "flex", gap: "0 8px" }}>
      <TokenImage logo={token?.logo} size="20px" tokenId={tokenInfo.ledger_id.toString()} />
      <Typography component="span">{symbol ?? tokenInfo?.symbol ?? "--"}</Typography>
    </Box>
  );
}

export interface SelectTokenProps {
  border?: boolean;
  value?: string;
  onTokenChange?: (tokenId: string) => void;
  filter?: (tokenInfo: AllTokenOfSwapTokenInfo) => boolean;
  search?: boolean;
  filled?: boolean;
  fullHeight?: boolean;
}

export function SelectToken({
  value: tokenId,
  onTokenChange,
  border,
  filter,
  search: hasSearch,
  filled,
  fullHeight,
}: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { result: allTokensOfSwap } = useAllTokensOfSwap();

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    if (!allTokensOfSwap) return undefined;

    return allTokensOfSwap.map((tokenInfo) => {
      return {
        value: tokenInfo.ledger_id.toString(),
        label: <TokenMenuItem tokenInfo={tokenInfo} />,
        additional: JSON.stringify(tokenInfo),
      };
    });
  }, [allTokensOfSwap]);

  const handleValueChange = (value: string) => {
    setValue(value);
    if (onTokenChange) {
      onTokenChange(value);
    }
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
      border={border}
      onSearch={setSearch}
      search={hasSearch}
      menuFilter={handleFilterMenu}
      filled={filled}
      fullHeight={fullHeight}
    />
  );
}
