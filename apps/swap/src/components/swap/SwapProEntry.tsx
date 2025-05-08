import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useHistory } from "react-router-dom";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonNullArgs } from "@icpswap/utils";
import { Tab } from "constants/index";

export interface SwapProEntryProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  limit?: boolean;
}

export function SwapProEntry({ inputToken, outputToken, limit }: SwapProEntryProps) {
  const theme = useTheme();
  const history = useHistory();

  const handleToSwapPro = useCallback(() => {
    if (nonNullArgs(inputToken) && nonNullArgs(outputToken)) {
      history.push(
        `/swap/pro?input=${inputToken.address}&output=${outputToken.address}${limit ? `&tab=${Tab.Limit}` : ""}`,
      );
    } else {
      history.push(`/swap/pro${limit ? `tab=${Tab.Limit}` : ""}`);
    }
  }, [history, inputToken, outputToken, limit]);

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
