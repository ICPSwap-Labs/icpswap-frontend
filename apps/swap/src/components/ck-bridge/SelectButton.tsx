import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { TokenImageWithChain } from "components/ck-bridge/ChainImage";
import { Box, type BoxProps, Typography, useTheme } from "components/Mui";
import { ChevronDown } from "react-feather";

export interface SelectButtonProps {
  chain: BridgeChainType | Null;
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
        <TokenImageWithChain chain={chain ?? BridgeChainType.icp} token={token} />

        <Box>
          {from ? (
            <Typography>From ({chain === BridgeChainType.erc20 ? BridgeChainType.eth : chain})</Typography>
          ) : (
            <Typography>To ({chain === BridgeChainType.erc20 ? BridgeChainType.eth : chain})</Typography>
          )}
          <Typography sx={{ margin: "12px 0 0 0", fontSize: "20px", color: "text.primary" }}>
            {chain === BridgeChainType.icp ? token?.symbol : token?.symbol.replace("ck", "")}
          </Typography>
        </Box>
      </Flex>

      {select === true ? <ChevronDown size={18} color="#ffffff" /> : null}
    </Flex>
  );
}
