import { Box, Typography } from "components/Mui";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Select } from "components/Select/ForToken";
import { TokenPair } from "components/TokenPair";
import type { IcpSwapAPITokenInfo, Null } from "@icpswap/types";
import { useTokenLogo } from "hooks/token/useTokenLogo";
import { Principal } from "@dfinity/principal";
import { useStateSwapAllTokens } from "store/global/hooks";
import { useAllSwapPools } from "store/swap/hooks";
import { useTranslation } from "react-i18next";

import type { MenuProps } from "./types";

function isTokenHide(tokenInfo: IcpSwapAPITokenInfo, search: string | undefined) {
  if (!search) return false;
  if (!tokenInfo) return true;

  if (
    !tokenInfo.symbol.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
    !tokenInfo.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )
    return true;

  return false;
}

interface PairItemProps {
  canisterId?: string;
  token0: IcpSwapAPITokenInfo | undefined;
  token1: IcpSwapAPITokenInfo | undefined;
  select?: boolean;
  color?: "primary" | "secondary";
}

function PairMenuItem({ token0, token1, select, color }: PairItemProps) {
  const token0Logo = useTokenLogo(token0?.ledgerId);
  const token1Logo = useTokenLogo(token1?.ledgerId);

  return (
    <Box
      sx={
        select
          ? null
          : {
              cursor: "pointer",
              "&:hover": {
                background: "#313D67",
              },
            }
      }
    >
      <TokenPair
        token0Logo={token0Logo}
        token1Logo={token1Logo}
        token0Symbol={token0?.symbol}
        token1Symbol={token1?.symbol}
        token0Id={token0?.ledgerId}
        token1Id={token1?.ledgerId}
        color={color}
      />
    </Box>
  );
}

export interface SelectPairProps {
  border?: boolean;
  value?: string | Null;
  onPairChange?: (poolId: string | undefined) => void;
  filter?: (tokenInfo: IcpSwapAPITokenInfo) => boolean;
  search?: boolean;
  filled?: boolean;
  fullHeight?: boolean;
  showBackground?: boolean;
  showClean?: boolean;
  panelPadding?: string;
  defaultPanel?: ReactNode;
  customPanel?: (menu: MenuProps | Null) => ReactNode;
  allPair?: boolean;
}

export function SelectPair({
  value: poolId,
  onPairChange,
  border,
  filter,
  search: hasSearch,
  filled,
  fullHeight,
  showBackground = true,
  showClean = true,
  panelPadding,
  defaultPanel,
  customPanel,
  allPair,
}: SelectPairProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | null | undefined>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const swapAllTokens = useStateSwapAllTokens();
  const swapPools = useAllSwapPools();

  useEffect(() => {
    if (poolId) {
      setValue(poolId);
    }
  }, [poolId]);

  const menus = useMemo(() => {
    if (swapPools && swapAllTokens) {
      const data = swapPools.map((ele) => {
        const token0 = swapAllTokens.find((token) => token.ledgerId === ele.token0.address);
        const token1 = swapAllTokens.find((token) => token.ledgerId === ele.token1.address);

        return {
          poolId: ele.canisterId.toString(),
          token0: ele.token0.address,
          token1: ele.token1.address,
          additional: {
            token0,
            token1,
          },
        };
      });

      const menus = data
        .map((ele) => ({
          value: ele.poolId,
          label: <PairMenuItem token0={ele.additional.token0} token1={ele.additional.token1} />,
          additional: JSON.stringify(ele.additional),
        }))
        .filter((ele) => !!ele.label);

      if (allPair) {
        menus.unshift({
          value: "ALL PAIR",
          label: <Typography color="inherit">All Pair</Typography>,
          additional: "",
        });
      }

      return menus;
    }

    return undefined;
  }, [swapPools, swapAllTokens, allPair]);

  const handleValueChange = (value: string | undefined) => {
    setValue(value);

    if (onPairChange) {
      onPairChange(value);
    }
  };

  const handleFilterMenu = (menu: MenuProps) => {
    if (!menu.additional) return false;

    const additional = JSON.parse(menu.additional) as {
      token0: IcpSwapAPITokenInfo;
      token1: IcpSwapAPITokenInfo;
    };

    return (
      (isTokenHide(additional.token0, search) && isTokenHide(additional.token1, search)) ||
      (!!filter && filter(additional.token0))
    );
  };

  return (
    <Select
      placeholder={t("common.select.a.pair")}
      menus={menus}
      minMenuWidth="214px"
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
      panel={(menu: MenuProps | Null) => {
        if (!menu) return defaultPanel;
        if (!menu.additional) return menu.label;

        if (customPanel) return customPanel(menu);

        const additional = JSON.parse(menu.additional) as {
          token0: IcpSwapAPITokenInfo;
          token1: IcpSwapAPITokenInfo;
        };

        if (!additional.token0 || !additional.token1) return menu.label;

        const token0 = {
          ...additional.token0,
          ledger_id: Principal.fromText(additional.token0.ledgerId),
        } as IcpSwapAPITokenInfo;

        const token1 = {
          ...additional.token1,
          ledger_id: Principal.fromText(additional.token1.ledgerId),
        } as IcpSwapAPITokenInfo;

        return <PairMenuItem token0={token0} token1={token1} select color="primary" />;
      }}
    />
  );
}
