import { Box } from "@mui/material";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Select } from "components/Select/ForToken";
import { TokenPair } from "components/TokenPair";
import { useSwapPools } from "@icpswap/hooks";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { useTokenLogo } from "hooks/token/useTokenLogo";
import { Principal } from "@dfinity/principal";
import { useStateSwapAllTokens } from "store/global/hooks";

import type { MenuProps, StringifyAllTokenOfSwapTokenInfo } from "./types";

function isTokenHide(tokenInfo: AllTokenOfSwapTokenInfo, search: string | undefined) {
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
  token0: AllTokenOfSwapTokenInfo | undefined;
  token1: AllTokenOfSwapTokenInfo | undefined;
  select?: boolean;
  color?: "primary" | "secondary";
}

function PairMenuItem({ token0, token1, select, color }: PairItemProps) {
  const token0Logo = useTokenLogo(token0?.ledger_id.toString());
  const token1Logo = useTokenLogo(token1?.ledger_id.toString());

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
        token0Id={token0?.ledger_id.toString()}
        token1Id={token1?.ledger_id.toString()}
        color={color}
      />
    </Box>
  );
}

export interface SelectPairProps {
  border?: boolean;
  value?: string;
  onPairChange?: (poolId: string | undefined) => void;
  filter?: (tokenInfo: AllTokenOfSwapTokenInfo) => boolean;
  search?: boolean;
  filled?: boolean;
  fullHeight?: boolean;
  showBackground?: boolean;
  showClean?: boolean;
  panelPadding?: string;
  defaultPanel?: ReactNode;
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
}: SelectPairProps) {
  const [value, setValue] = useState<string | null | undefined>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const allTokensOfSwap = useStateSwapAllTokens();
  const { result: swapPools } = useSwapPools();

  useEffect(() => {
    if (poolId) {
      setValue(poolId);
    }
  }, [poolId]);

  const menus = useMemo(() => {
    if (swapPools && allTokensOfSwap) {
      const data = swapPools.map((ele) => {
        const token0 = allTokensOfSwap.find((token) => token.ledger_id.toString() === ele.token0.address);
        const token1 = allTokensOfSwap.find((token) => token.ledger_id.toString() === ele.token1.address);

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

      return data
        .map((ele) => ({
          value: ele.poolId,
          label: <PairMenuItem token0={ele.additional.token0} token1={ele.additional.token1} />,
          additional: JSON.stringify(ele.additional),
        }))
        .filter((ele) => !!ele.label);
    }

    return undefined;
  }, [swapPools, allTokensOfSwap]);

  const handleValueChange = (value: string | undefined) => {
    setValue(value);

    if (onPairChange) {
      onPairChange(value);
    }
  };

  const handleFilterMenu = (menu: MenuProps) => {
    if (!menu.additional) return false;

    const additional = JSON.parse(menu.additional) as {
      token0: AllTokenOfSwapTokenInfo;
      token1: AllTokenOfSwapTokenInfo;
    };

    return (
      (isTokenHide(additional.token0, search) && isTokenHide(additional.token1, search)) ||
      (!!filter && filter(additional.token0))
    );
  };

  return (
    <Select
      placeholder="Select a pair"
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
      panel={(menu: MenuProps | null | undefined) => {
        if (!menu) return defaultPanel;
        if (!menu.additional) return null;

        const additional = JSON.parse(menu.additional) as {
          token0: StringifyAllTokenOfSwapTokenInfo;
          token1: StringifyAllTokenOfSwapTokenInfo;
        };

        const token0 = {
          ...additional.token0,
          ledger_id: Principal.fromText(additional.token0.ledger_id.__principal__),
        } as AllTokenOfSwapTokenInfo;

        const token1 = {
          ...additional.token1,
          ledger_id: Principal.fromText(additional.token1.ledger_id.__principal__),
        } as AllTokenOfSwapTokenInfo;

        return <PairMenuItem token0={token0} token1={token1} select color="primary" />;
      }}
    />
  );
}
