import { Box, Typography } from "components/Mui";
import { MainCard } from "@icpswap/ui";
import { Tokens } from "components/info/tokens/index";
import { InfoWrapper } from "components/index";
import { useTranslation } from "react-i18next";
import { TokensTreeMap } from "components/info/tokens/TreeMap";

export default function __Tokens() {
  const { t } = useTranslation();

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
