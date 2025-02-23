import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";

export interface SwapProEntryProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function SwapProEntry({ inputToken, outputToken }: SwapProEntryProps) {
  const theme = useTheme();
  const history = useHistory();

  const handleToSwapPro = useCallback(() => {
    if (nonNullArgs(inputToken) && nonNullArgs(outputToken)) {
      history.push(`/swap/pro?input=${inputToken.address}&output=${outputToken.address}`);
    } else {
      history.push(`/swap/pro`);
    }
  }, [history, inputToken, outputToken]);

  return (
    <Flex
      onClick={handleToSwapPro}
      sx={{
        width: "32px",
        height: "32px",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "40px",
        background: theme.palette.background.level2,
      }}
    >
      <img width="16px" height="16px" src="/images/pro-entry.svg" alt="" />
    </Flex>
  );
}
