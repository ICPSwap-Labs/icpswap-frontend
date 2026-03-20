import { useTokensFromAPI } from "@icpswap/hooks";
import { MainCard } from "@icpswap/ui";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { InfoWrapper } from "components/index";
import { Tokens } from "components/info/tokens/index";
import { TokensTreeMap, TreeMapColorsLabel } from "components/info/tokens/TreeMap";
import { Box, Typography } from "components/Mui";
import { useTokensManager } from "hooks/info/tokens/index";
import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

function __Tokens() {
  const { t } = useTranslation();
  const [, setTokens] = useTokensManager();
  const { data: tokens } = useTokensFromAPI();

  useEffect(() => {
    if (nonUndefinedOrNull(tokens)) {
      setTokens(tokens);
    }
  }, [tokens]);

  return (
    <InfoWrapper>
      <Box sx={{ margin: "8px 0 32px 0" }}>
        <Typography sx={{ fontSize: "14px" }}>{t("common.disclaimer.descriptions")}</Typography>
        <TokensTreeMap />
        <Box sx={{ margin: "12px 0 0 0" }}>
          <TreeMapColorsLabel />
        </Box>
      </Box>

      <MainCard>
        <Tokens />
      </MainCard>
    </InfoWrapper>
  );
}

export default memo(__Tokens);
