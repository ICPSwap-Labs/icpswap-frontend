import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";

export interface SwapProButtonProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function SwapProButton({ inputToken, outputToken }: SwapProButtonProps) {
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
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "40px",
        background: theme.palette.background.level3,
      }}
    >
      <img width="16px" height="16px" src="/images/chart.svg" alt="" />
    </Flex>
  );
}
