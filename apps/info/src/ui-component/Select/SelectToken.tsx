import { Box, Avatar, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Select } from "ui-component/index";
import { useTokensFromList, useSwapPools } from "@icpswap/hooks";
import { useTokenInfo } from "hooks/token";
import { ICP } from "constants/tokens";

interface TokenMenuItemProps {
  canisterId: string;
  symbol?: string;
}

function TokenMenuItem({ canisterId, symbol }: TokenMenuItemProps) {
  const { result: tokenInfo } = useTokenInfo(canisterId);

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
}

export function SelectToken({ value: tokenId, onTokenChange }: SelectTokenProps) {
  const [value, setValue] = useState<string | null>(null);

  const { result: tokens } = useTokensFromList();
  const { result: swapPools } = useSwapPools();

  useEffect(() => {
    if (tokenId) {
      setValue(tokenId);
    }
  }, [tokenId]);

  const menus = useMemo(() => {
    let contents = tokens?.map((ele) => ({
      value: ele.canisterId,
      label: <TokenMenuItem symbol={ele.symbol} canisterId={ele.canisterId} />,
    }));

    if (contents) {
      contents.unshift({
        value: ICP.address,
        label: <TokenMenuItem symbol={ICP.symbol ?? "ICP"} canisterId={ICP.address} />,
      });
    }

    if (swapPools && contents) {
      const poolTokens = swapPools.reduce((prev, curr) => {
        return [...new Set(prev.concat([curr.token0.address, curr.token1.address]))];
      }, [] as string[]);

      const poolTokensContent = poolTokens
        .filter((ele) => !contents?.find((e) => e.value === ele))
        .map((ele) => ({
          value: ele,
          label: <TokenMenuItem canisterId={ele} />,
        }));

      if (contents) {
        contents = contents.concat(poolTokensContent);
      }
    }

    return contents;
  }, [tokens, swapPools]);

  const handleValueChange = (value: string) => {
    setValue(value);

    if (onTokenChange) {
      onTokenChange(value);
    }
  };

  return (
    <Select
      placeholder="Select a token"
      menus={menus}
      menuMaxHeight="240px"
      onChange={handleValueChange}
      value={value}
    />
  );
}
