import { useHistory } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { Box, Typography, Button } from "components/Mui";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";

export interface CreatePoolProps {
  fontSize?: "12px" | "14px";
  margin?: string;
  ui?: "pro" | "normal";
  bg1?: string;
  inputToken: Token | Null;
  outputToken: Token | Null;
}

export function CreatePool({ inputToken, outputToken, fontSize = "14px", ui }: CreatePoolProps) {
  const { t } = useTranslation();
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
        width: "100%",
        background: "#111936",
        padding: "16px",
        borderRadius: "16px",
      }}
    >
      <Flex fullWidth align="center" justify="space-between" gap="0 20px">
        <Typography sx={{ fontSize: __fontSize, maxWidth: "280px", lineHeight: "20px" }}>
          {t("liquidity.no.liquidity.descriptions")}
        </Typography>

        <Button sx={{ minWidth: "98px" }} variant="contained" size="small" onClick={handleCreatePool}>
          {t("common.liquidity.add")}
        </Button>
      </Flex>
    </Box>
  );
}
