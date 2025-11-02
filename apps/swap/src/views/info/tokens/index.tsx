import { Box, Typography } from "components/Mui";
import { MainCard } from "@icpswap/ui";
import { Tokens } from "components/info/tokens/index";
import { InfoWrapper } from "components/index";
import { useTranslation } from "react-i18next";
import { TokensTreeMap } from "components/info/tokens/TreeMap";
import { useTokensFromAPI } from "@icpswap/hooks";
import { useTokensManager } from "hooks/info/tokens/index";
import { memo, useEffect } from "react";
import { nonUndefinedOrNull } from "@icpswap/utils";

function __Tokens() {
  const { t } = useTranslation();
  const [, setTokens] = useTokensManager();
  const { result: tokens } = useTokensFromAPI();

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
      </Box>

      <MainCard>
        <Tokens />
      </MainCard>
    </InfoWrapper>
  );
}

export default memo(__Tokens);
