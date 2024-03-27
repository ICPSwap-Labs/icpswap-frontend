import { Box, Avatar, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select, type MenuProps } from "ui-component/index";
import { useSwapPools } from "@icpswap/hooks";
import { isValidPrincipal } from "@icpswap/utils";
import { useTokensInfo, TokenInfoState } from "hooks/token/index";
import { ICP, ICP_TOKEN_INFO } from "@icpswap/tokens";
import { TokenInfo } from "types/index";

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

function TokenMenuItem({ tokenInfo, symbol }: TokenMenuItemProps) {
  return (
    <Box sx={{ display: "flex", gap: "0 8px" }}>
      <Avatar sx={{ width: "20px", height: "20px" }} src={tokenInfo?.logo}>
        &nbsp;
      </Avatar>
      <Typography>{symbol ?? tokenInfo?.symbol ?? "--"}</Typography>
    </Box>
  );
}

export interface SelectTokenProps {
  value?: string;
  onTokenChange?: (tokenId: string) => void;
  filter?: (tokenInfo: TokenInfo) => boolean;
}

export function SelectToken({ value: tokenId, onTokenChange, filter }: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);
  const { result: swapPools } = useSwapPools();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const allSwapTokenIds = useMemo(() => {
    return swapPools?.reduce((prev, curr) => {
      return [...new Set(prev.concat([curr.token0.address, curr.token1.address]))];
    }, [] as string[]);
  }, [swapPools]);

  const allSwapTokenInfos = useTokensInfo(allSwapTokenIds);

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    const contents = allSwapTokenInfos.filter(
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
  }, [allSwapTokenInfos]);

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
      search
      onSearch={handleSearchChange}
      menuFilter={handleFilterMenu}
    />
  );
}
