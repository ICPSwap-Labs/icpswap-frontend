import { Box, Avatar, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select, type MenuProps } from "components/Select/ForToken";
import { useAllTokenIds } from "hooks/useAllTokens";
import { TokenInfoState, useTokensInfo } from "hooks/token/useTokenInfo";
import { ICP, ICP_TOKEN_INFO } from "constants/tokens";
import { isValidPrincipal } from "@icpswap/utils";
import { TokenInfo } from "types/token";

interface TokenMenuItemProps {
  tokenInfo: TokenInfo;
  symbol?: string;
  search?: string;
}

function isTokenHide(tokenInfo: TokenInfo, search: string | undefined) {
  if (!!search && isValidPrincipal(search) && tokenInfo.canisterId !== search) return true;
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

  return hide ? null : (
    <Box sx={{ display: "flex", gap: "0 8px" }}>
      <Avatar sx={{ width: "20px", height: "20px" }} src={tokenInfo?.logo}>
        &nbsp;
      </Avatar>
      <Typography component="span">{symbol ?? tokenInfo?.symbol ?? "--"}</Typography>
    </Box>
  );
}

export interface SelectTokenProps {
  border?: boolean;
  value?: string;
  onTokenChange?: (tokenId: string) => void;
  filter?: (tokenInfo: TokenInfo) => boolean;
  search?: boolean;
}

export function SelectToken({ value: tokenId, onTokenChange, border, filter, search: hasSearch }: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const allTokenIds = useAllTokenIds();
  const allTokenInfos = useTokensInfo(allTokenIds);

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    let contents = allTokenInfos.filter(
      (ele) => ele[0] === TokenInfoState.EXISTS && ele[1]?.canisterId !== ICP.address,
    ) as [TokenInfoState, TokenInfo][];

    contents.unshift([TokenInfoState.EXISTS, ICP_TOKEN_INFO]);

    return contents.map((ele) => {
      const tokenInfo = ele[1];
      return {
        value: tokenInfo.canisterId,
        label: <TokenMenuItem tokenInfo={tokenInfo} />,
        additional: JSON.stringify(tokenInfo),
      };
    });
  }, [allTokenInfos]);

  const handleValueChange = (value: string) => {
    setValue(value);
    if (onTokenChange) {
      onTokenChange(value);
    }
  };

  const handleFilterMenu = (menu: MenuProps) => {
    if (!menu.additional) return false;

    const tokenInfo = JSON.parse(menu.additional) as TokenInfo;

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
    />
  );
}
