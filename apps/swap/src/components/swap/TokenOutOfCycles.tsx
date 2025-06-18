import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { Box, Typography } from "components/Mui";
import { Flex, Checkbox } from "@icpswap/ui";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useTokenOutOfCycles } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useToken } from "hooks/index";

export interface TokenOutOfCyclesProps {
  onCheckChange: (checked: boolean) => void;
  ui?: "pro";
  inputToken: Token | Null;
  outputToken: Token | Null;
  updateTokensOutOfCycles: (tokenIds: string[]) => void;
}

export const TokenOutOfCycles = memo(
  ({ inputToken, outputToken, onCheckChange, ui, updateTokensOutOfCycles }: TokenOutOfCyclesProps) => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);

    const handleCheck = useCallback((check: boolean) => {
      setChecked(check);
      onCheckChange(check);
    }, []);

    const tokenIds = useMemo(() => {
      if (isUndefinedOrNull(inputToken) || isUndefinedOrNull(outputToken)) return undefined;

      return [inputToken.address, outputToken.address];
    }, [inputToken, outputToken]);

    const { result: cyclesResult } = useTokenOutOfCycles({ tokenIds });

    const tokensOutOfCycles = useMemo(() => {
      if (isUndefinedOrNull(cyclesResult)) return undefined;

      return cyclesResult.data?.filter((element) => element.available === false).map((element) => element.ledgerId);
    }, [cyclesResult]);

    const [, token] = useToken(tokensOutOfCycles ? tokensOutOfCycles[0] : undefined);

    useEffect(() => {
      if (tokensOutOfCycles && tokensOutOfCycles.length > 0) {
        updateTokensOutOfCycles(tokensOutOfCycles);
      }
    }, [tokensOutOfCycles]);

    return tokensOutOfCycles && tokensOutOfCycles.length > 0 ? (
      <Box
        sx={{
          padding: ui === "pro" ? "10px" : "16px",
          background: "rgba(211, 98, 91, 0.15)",
          borderRadius: "16px",
        }}
      >
        <Flex gap="0 8px" align="flex-start">
          <Flex>
            <Checkbox checked={checked} onCheckedChange={handleCheck} />
          </Flex>

          <Typography
            style={{
              color: "#D3625B",
              lineHeight: "15px",
              fontSize: "12px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => handleCheck(!checked)}
          >
            {t("swap.token.out.of.cycles", { symbol: token?.symbol })}
          </Typography>
        </Flex>
      </Box>
    ) : null;
  },
);
