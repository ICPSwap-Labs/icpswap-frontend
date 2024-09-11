import { useHistory } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { Box, Typography, Button } from "components/Mui";
import { Trans } from "@lingui/macro";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";

export interface CreatePoolProps {
  fontSize?: "12px" | "14px";
  margin?: string;
  ui?: "pro" | "normal";
  bg1?: string;
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function CreatePool({ inputToken, outputToken, fontSize = "14px", ui }: CreatePoolProps) {
  const history = useHistory();

  const __fontSize = useMemo(() => {
    if (ui === "pro") return "12px";
    return fontSize;
  }, [fontSize, ui]);

  const handleCreatePool = useCallback(() => {
    if (!inputToken || !outputToken) return;

    history.push(
      `/liquidity/add/${inputToken.address}/${outputToken.address}?path=${window.btoa(
        `/swap?input=${inputToken.address}&output=${outputToken.address}`,
      )}`,
    );
  }, [inputToken, outputToken]);

  return (
    <Box
      mt="8px"
      sx={{
        background: "#111936",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <Flex align="center" justify="space-between" gap="0 20px">
        <Typography sx={{ fontSize: __fontSize, maxWidth: "280px", lineHeight: "20px" }}>
          <Trans>The trading pair has not been created. You can create this trading pair</Trans>
        </Typography>

        <Button sx={{ minWidth: "98px" }} variant="contained" size="small" onClick={handleCreatePool}>
          <Trans>Create Pool</Trans>
        </Button>
      </Flex>
    </Box>
  );
}
