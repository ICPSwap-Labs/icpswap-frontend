import { useEffect, useMemo, useState, memo } from "react";
import { Select } from "ui-component/index";
import { useSwapPools, useAllTokensOfSwap } from "@icpswap/hooks";
import { TokenPair } from "ui-component/TokenPair";
import { Box } from "@mui/material";
import type { AllTokenOfSwapTokenInfo } from "@icpswap/types";
import { generateLogoUrl } from "hooks/token/useTokenLogo";

interface PairItemProps {
  canisterId?: string;
  token0: AllTokenOfSwapTokenInfo | undefined;
  token1: AllTokenOfSwapTokenInfo | undefined;
  search: string | null | undefined;
  select?: boolean;
}

function PairMenuItem({ token0, token1, search, select }: PairItemProps) {
  return search &&
    !token0?.symbol.toLowerCase().includes(search.toLowerCase()) &&
    !token1?.symbol.toLowerCase().includes(search.toLowerCase()) &&
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
        token0Logo={token0 ? generateLogoUrl(token0.ledger_id.toString()) : ""}
        token1Logo={token1 ? generateLogoUrl(token1.ledger_id.toString()) : ""}
        token0Symbol={token0?.symbol}
        token1Symbol={token1?.symbol}
        token0Id={token0?.ledger_id.toString()}
        token1Id={token1?.ledger_id.toString()}
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
          label: <PairMenuItem token0={ele.additional.token0} token1={ele.additional.token1} search={search} />,
          selectLabel: (
            <PairMenuItem token0={ele.additional.token0} token1={ele.additional.token1} search={search} select />
          ),
          additional: JSON.stringify(ele.additional),
        }))
        .filter((ele) => !!ele.label);
    }

    return undefined;
  }, [swapPools, search, allTokensOfSwap]);

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
