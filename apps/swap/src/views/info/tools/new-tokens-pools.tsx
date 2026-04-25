import { BreadcrumbsV1 } from "@icpswap/ui";
import { InfoWrapper } from "components/index";
import { LatestPools } from "components/info/tools/LatestPools";
import { LatestTokens } from "components/info/tools/LatestTokens";
import { Box } from "components/Mui";
import { useTranslation } from "react-i18next";

export default function NewTokensPools() {
  const { t } = useTranslation();

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1
        links={[{ label: t("common.tools"), link: "/info-tools" }, { label: t("info.tools.new.tokens.pools") }]}
      />

      <Box sx={{ height: "20px", width: "100%" }} />

      <LatestTokens />

      <Box sx={{ height: "20px", width: "100%" }} />

      <LatestPools />
    </InfoWrapper>
  );
}
