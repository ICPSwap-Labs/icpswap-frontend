import { useEffect, useMemo, useState, memo } from "react";
import { Select } from "ui-component/index";
import { useSwapPools } from "@icpswap/hooks";
import { useTokenInfo } from "hooks/token";
import { TokenPair } from "ui-component/TokenPair";
import { Box } from "@mui/material";

interface PairItemProps {
  canisterId?: string;
  token0: string;
  token1: string;
  search: string | null | undefined;
  select?: boolean;
}

function PairMenuItem({ token0, token1, search, select }: PairItemProps) {
  const { result: token0Info } = useTokenInfo(token0);
  const { result: token1Info } = useTokenInfo(token1);

  return search &&
    !token0Info?.symbol.toLowerCase().includes(search.toLowerCase()) &&
    !token1Info?.symbol.toLowerCase().includes(search.toLowerCase()) &&
    !select ? null : (
    <Box
      sx={
        select
          ? null
          : {
              padding: "10px 10px",
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
        token0Symbol={token0Info?.symbol}
        token1Symbol={token1Info?.symbol}
        token0Id={token0Info?.canisterId}
        token1Id={token1Info?.canisterId}
      />
    </Box>
  );
}

export interface SelectPairProps {
  value?: string;
  onPairChange?: (tokenId: string | undefined) => void;
}

export const SelectPair = memo(({ value: poolId, onPairChange }: SelectPairProps) => {
  const [value, setValue] = useState<string | null | undefined>(null);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { result: swapPools } = useSwapPools();

  useEffect(() => {
    if (poolId) {
      setValue(poolId);
    }
  }, [poolId]);

  const menus = useMemo(() => {
    if (swapPools) {
      const data = swapPools.map((ele) => ({
        poolId: ele.canisterId.toString(),
        token0: ele.token0.address,
        token1: ele.token1.address,
      }));

      return data
        .map((ele) => ({
          value: ele.poolId,
          label: <PairMenuItem token0={ele.token0} token1={ele.token1} search={search} />,
          selectLabel: <PairMenuItem token0={ele.token0} token1={ele.token1} search={search} select />,
        }))
        .filter((ele) => !!ele.label);
    }

    return undefined;
  }, [swapPools, search]);

  const handleValueChange = (value: string | undefined) => {
    setValue(value);

    if (onPairChange) {
      onPairChange(value);
    }
  };

  return (
    <Select
      placeholder="Select a pair"
      menus={menus}
      width="214px"
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
      onSearch={setSearch}
      search
      customLabel
    />
  );
});
