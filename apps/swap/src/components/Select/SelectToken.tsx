import { Box, Typography } from "components/Mui";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { Select } from "components/Select/ForToken";
import { generateLogoUrl } from "hooks/token/useTokenLogo";
import { isValidPrincipal } from "@icpswap/utils";
import { TokenImage } from "components/index";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { Principal } from "@dfinity/principal";
import { useStateSwapAllTokens } from "store/global/hooks";

import type { MenuProps, StringifyAllTokenOfSwapTokenInfo } from "./types";

interface TokenMenuItemProps {
  tokenInfo: AllTokenOfSwapTokenInfo;
  symbol?: string;
  search?: string;
  color?: "primary" | "secondary";
  panel?: boolean;
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

function TokenMenuItem({ tokenInfo, symbol, search, color, panel }: TokenMenuItemProps) {
  const hide = useMemo(() => {
    return isTokenHide(tokenInfo, search);
  }, [search, tokenInfo]);

  return hide ? null : (
    <Box sx={{ display: "flex", gap: panel ? "0 4px" : "0 8px", alignItems: "center" }}>
      <TokenImage
        logo={generateLogoUrl(tokenInfo.ledger_id.toString())}
        size="24px"
        tokenId={tokenInfo.ledger_id.toString()}
      />
      <Typography color={color === "primary" ? "text.primary" : "text.secondary"} component="span">
        {symbol ?? tokenInfo?.symbol ?? "--"}
      </Typography>
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
  showBackground?: boolean;
  showClean?: boolean;
  panelPadding?: string;
  defaultPanel?: ReactNode;
}

export function SelectToken({
  value: tokenId,
  onTokenChange,
  border,
  filter,
  search: hasSearch,
  filled,
  fullHeight,
  showBackground,
  showClean,
  panelPadding,
  defaultPanel,
}: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const allTokensOfSwap = useStateSwapAllTokens();

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
      minMenuWidth="180px"
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
      border={border}
      onSearch={setSearch}
      search={hasSearch}
      menuFilter={handleFilterMenu}
      filled={filled}
      fullHeight={fullHeight}
      showBackground={showBackground}
      showClean={showClean}
      panelPadding={panelPadding}
      panel={(menu: MenuProps | null | undefined) => {
        if (!menu) return defaultPanel;
        if (!menu.additional) return null;

        const additional = JSON.parse(menu.additional) as StringifyAllTokenOfSwapTokenInfo;

        const tokenInfo = {
          ...additional,
          ledger_id: Principal.fromText(additional.ledger_id.__principal__),
        } as AllTokenOfSwapTokenInfo;

        return <TokenMenuItem tokenInfo={tokenInfo} color="primary" panel />;
      }}
    />
  );
}
