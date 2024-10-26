import { Box, BoxProps, Typography, useTheme } from "components/Mui";
import { ChevronDown } from "react-feather";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { ckBridgeChain } from "@icpswap/constants";

import { TokenImageWithChain } from "./ChainImage";

export interface SelectButtonProps {
  chain: ckBridgeChain | Null;
  select?: boolean;
  token: Token | Null;
  onClick?: BoxProps["onClick"];
  from?: boolean;
}

export function SelectButton({ token, chain, onClick, from, select = false }: SelectButtonProps) {
  const theme = useTheme();

  return (
    <Flex
      fullWidth
      sx={{ padding: "18px", borderRadius: "16px", background: theme.palette.background.level2, cursor: "pointer" }}
      justify="space-between"
      onClick={onClick}
    >
      <Flex gap="0 12px">
        <TokenImageWithChain chain={chain ?? ckBridgeChain.icp} token={token} />

        <Box>
          {from ? <Typography>From ({chain})</Typography> : <Typography>To ({chain})</Typography>}
          <Typography sx={{ margin: "12px 0 0 0", fontSize: "20px", color: "text.primary" }}>
            {chain === ckBridgeChain.icp ? token?.symbol : token?.symbol.replace("ck", "")}
          </Typography>
        </Box>
      </Flex>

      {select === true ? <ChevronDown size={18} color="#ffffff" /> : null}
    </Flex>
  );
}
