import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { Tab } from "constants/index";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface SwapProEntryProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  limit?: boolean;
}

export function SwapProEntry({ inputToken, outputToken, limit }: SwapProEntryProps) {
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
      className="swap-toolbar-control"
      onClick={handleToSwapPro}
      sx={{
        width: "36px",
        height: "36px",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "4px",
        border: "1px solid var(--color-base-300)",
        background: "transparent",
      }}
    >
      <img width="16px" height="16px" src="/images/pro-entry.svg" alt="" />
    </Flex>
  );
}
