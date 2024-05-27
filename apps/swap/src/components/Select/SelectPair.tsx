import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select, type MenuProps } from "components/Select/ForToken";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenPair } from "components/TokenPair";
import { useSwapPools, useAllTokensOfSwap } from "@icpswap/hooks";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";

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
}

function PairMenuItem({ token0, token1, select }: PairItemProps) {
  const { result: token0Info } = useTokenInfo(token0?.ledger_id.toString());
  const { result: token1Info } = useTokenInfo(token1?.ledger_id.toString());

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
        token0Logo={token0Info?.logo}
        token1Logo={token1Info?.logo}
        token0Symbol={token0?.symbol}
        token1Symbol={token1?.symbol}
        token0Id={token0?.ledger_id.toString()}
        token1Id={token1?.ledger_id.toString()}
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
}

export function SelectPair({
  value: poolId,
  onPairChange,
  border,
  filter,
  search: hasSearch,
  filled,
  fullHeight,
}: SelectPairProps) {
  const [value, setValue] = useState<string | null | undefined>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { result: allTokensOfSwap } = useAllTokensOfSwap();
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
          selectLabel: <PairMenuItem token0={ele.additional.token0} token1={ele.additional.token1} select />,
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
