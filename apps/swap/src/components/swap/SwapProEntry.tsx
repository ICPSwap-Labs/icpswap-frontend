import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { useTheme } from "components/Mui";
import { useNavigate } from "react-router-dom";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Tab } from "constants/index";

export interface SwapProEntryProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  limit?: boolean;
}

export function SwapProEntry({ inputToken, outputToken, limit }: SwapProEntryProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleToSwapPro = useCallback(() => {
    if (nonUndefinedOrNull(inputToken) && nonUndefinedOrNull(outputToken)) {
      navigate(
        `/swap/pro?input=${inputToken.address}&output=${outputToken.address}${limit ? `&tab=${Tab.Limit}` : ""}`,
      );
    } else {
      navigate(`/swap/pro${limit ? `tab=${Tab.Limit}` : ""}`);
    }
  }, [navigate, inputToken, outputToken, limit]);

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
